
import { supabase } from "@/integrations/supabase/client";
import { sendMedicalNewsletterEmail } from "./email-service";

export interface NewsletterSubscription {
  id: string;
  user_id: string;
  email: string;
  is_active: boolean;
  frequency: 'weekly' | 'monthly';
  categories: string[];
  created_at: string;
  updated_at: string;
}

export interface NewsletterArticle {
  title: string;
  summary: string;
  url: string;
}

export interface NewsletterTip {
  icon: string;
  title: string;
  description: string;
}

// Подписка на newsletter
export const subscribeToNewsletter = async (
  userId: string,
  email: string,
  frequency: 'weekly' | 'monthly' = 'weekly',
  categories: string[] = ['general']
) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        user_id: userId,
        email,
        frequency,
        categories,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Ошибка подписки на newsletter:', error);
    throw error;
  }
};

// Отписка от newsletter
export const unsubscribeFromNewsletter = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Ошибка отписки от newsletter:', error);
    throw error;
  }
};

// Получение статуса подписки
export const getNewsletterSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Ошибка получения подписки на newsletter:', error);
    throw error;
  }
};

// Обновление настроек подписки
export const updateNewsletterSubscription = async (
  userId: string,
  updates: Partial<Pick<NewsletterSubscription, 'frequency' | 'categories'>>
) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_active', true)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Ошибка обновления подписки на newsletter:', error);
    throw error;
  }
};

// Отправка newsletter всем подписчикам
export const sendWeeklyNewsletter = async () => {
  try {
    console.log('Начинаем отправку еженедельного newsletter...');
    
    // Получаем всех активных подписчиков с еженедельной частотой
    const { data: subscriptions, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('is_active', true)
      .eq('frequency', 'weekly');

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      console.log('Нет активных подписчиков для еженедельной рассылки');
      return;
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
        url: `${window.location.origin}/blog/longevity-research`
      },
      {
        title: "Персонализированная медицина: будущее уже здесь",
        summary: "Как генетическое тестирование и ИИ меняют подходы к лечению и профилактике заболеваний.",
        url: `${window.location.origin}/blog/personalized-medicine`
      },
      {
        title: "Оптимизация сна для улучшения здоровья",
        summary: "Практические рекомендации по улучшению качества сна на основе последних научных данных.",
        url: `${window.location.origin}/blog/sleep-optimization`
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
    const emailPromises = subscriptions.map(async (subscription) => {
      const profile = profiles?.find(p => p.id === subscription.user_id);
      const userName = profile?.nickname || subscription.email.split('@')[0];

      try {
        await sendMedicalNewsletterEmail(
          subscription.email,
          userName,
          articles,
          tips
        );
        console.log(`Newsletter sent to ${subscription.email}`);
      } catch (error) {
        console.error(`Failed to send newsletter to ${subscription.email}:`, error);
      }
    });

    await Promise.allSettled(emailPromises);
    console.log(`Newsletter отправлен ${subscriptions.length} подписчикам`);
    
  } catch (error) {
    console.error('Ошибка отправки newsletter:', error);
    throw error;
  }
};
