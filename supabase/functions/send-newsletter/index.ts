
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { MedicalNewsletterEmail } from "./_templates/medical-newsletter.tsx";

// Используем SMTP API ключ для авторизованного домена
const resend = new Resend(Deno.env.get("RESEND_SMTP_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterArticle {
  title: string;
  summary: string;
  url: string;
}

interface NewsletterTip {
  icon: string;
  title: string;
  description: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Начинаем отправку еженедельного newsletter...');
    
    // Получаем всех активных подписчиков с еженедельной частотой
    const { data: subscriptions, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('is_active', true)
      .eq('frequency', 'weekly');

    if (error) {
      console.error('Ошибка получения подписок:', error);
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('Нет активных подписчиков для еженедельной рассылки');
      return new Response(
        JSON.stringify({ message: 'Нет активных подписчиков' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Получаем имена пользователей
    const userIds = subscriptions.map(sub => sub.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nickname')
      .in('id', userIds);

    // Подготавливаем контент для newsletter
    const articles: NewsletterArticle[] = [
      {
        title: "Новые исследования в области longevity",
        summary: "Ученые обнаружили новые биомаркеры, связанные с процессами старения и способами их замедления.",
        url: "https://everliv.online/blog/longevity-research"
      },
      {
        title: "Персонализированная медицина: будущее уже здесь",
        summary: "Как генетическое тестирование и ИИ меняют подходы к лечению и профилактике заболеваний.",
        url: "https://everliv.online/blog/personalized-medicine"
      },
      {
        title: "Оптимизация сна для улучшения здоровья",
        summary: "Практические рекомендации по улучшению качества сна на основе последних научных данных.",
        url: "https://everliv.online/blog/sleep-optimization"
      }
    ];

    const tips: NewsletterTip[] = [
      {
        icon: "🥗",
        title: "Питание и микроэлементы",
        description: "Включите в рацион больше продуктов, богатых магнием и витамином D для поддержания энергии."
      },
      {
        icon: "🏃‍♂️",
        title: "Кардио для долголетия",
        description: "15-20 минут интенсивной кардио нагрузки 3 раза в неделю значительно улучшают здоровье сердца."
      },
      {
        icon: "🧘",
        title: "Управление стрессом",
        description: "Практика медитации всего 10 минут в день снижает уровень кортизола на 23%."
      }
    ];

    // Отправляем newsletter каждому подписчику
    let successCount = 0;
    let errorCount = 0;

    for (const subscription of subscriptions) {
      try {
        const profile = profiles?.find(p => p.id === subscription.user_id);
        const userName = profile?.nickname || subscription.email.split('@')[0];

        const html = await renderAsync(
          React.createElement(MedicalNewsletterEmail, {
            userName,
            articles,
            tips,
          })
        );

        const emailResponse = await resend.emails.send({
          from: "EVERLIV <noreply@updates.everliv.online>",
          to: [subscription.email],
          subject: "EVERLIV Newsletter: Новые медицинские рекомендации",
          html,
        });

        console.log(`Newsletter sent to ${subscription.email}:`, emailResponse);
        successCount++;
      } catch (error) {
        console.error(`Failed to send newsletter to ${subscription.email}:`, error);
        errorCount++;
      }
    }

    console.log(`Newsletter отправлен: ${successCount} успешно, ${errorCount} ошибок`);
    
    return new Response(
      JSON.stringify({ 
        message: `Newsletter отправлен ${successCount} подписчикам`,
        success: successCount,
        errors: errorCount
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error("Ошибка отправки newsletter:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);
