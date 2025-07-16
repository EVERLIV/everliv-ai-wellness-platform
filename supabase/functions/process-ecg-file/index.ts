import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diagnosis, hasEcgFile, fileType } = await req.json();

    if (!diagnosis) {
      return new Response(
        JSON.stringify({ error: 'Diagnosis is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Инициализируем Supabase клиент
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Получаем пользователя
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`Обработка диагноза для пользователя: ${user.id}`);
    console.log(`Диагноз: ${diagnosis}`);
    console.log(`Файл ЭКГ: ${hasEcgFile ? 'да' : 'нет'}, тип: ${fileType || 'не указан'}`);

    // Получаем данные профиля пользователя
    const { data: userProfile } = await supabase
      .from('user_health_ai_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Получаем последние биомаркеры
    const { data: biomarkers } = await supabase
      .from('biomarker_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Получаем дневные метрики здоровья за последние 30 дней
    const { data: healthMetrics } = await supabase
      .from('daily_health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    // Формируем контекст для ИИ
    const context = {
      userProfile: userProfile || {},
      recentBiomarkers: biomarkers || [],
      healthMetrics: healthMetrics || [],
      fileInfo: hasEcgFile ? { hasFile: true, type: fileType } : { hasFile: false }
    };

    // Генерируем рекомендации с помощью ИИ
    const recommendations = await generateRecommendations(diagnosis, context);

    return new Response(JSON.stringify({ 
      success: true, 
      recommendations,
      message: 'Рекомендации сгенерированы успешно'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Ошибка в process-ecg-file:', error);
    return new Response(JSON.stringify({ 
      error: 'Ошибка при обработке запроса', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateRecommendations(diagnosis: string, context: any): Promise<any[]> {
  if (!anthropicApiKey) {
    // Возвращаем mock рекомендации если нет API ключа
    return [
      {
        title: 'Контроль артериального давления',
        description: 'Ежедневный мониторинг АД. Ведите дневник показателей.',
        category: 'Мониторинг',
        priority: 'high'
      },
      {
        title: 'Коррекция питания',
        description: 'Ограничение соли, увеличение овощей и фруктов в рационе.',
        category: 'Питание',
        priority: 'high'
      },
      {
        title: 'Физическая активность',
        description: 'Регулярные прогулки 30 минут в день, избегать интенсивных нагрузок.',
        category: 'Активность',
        priority: 'medium'
      }
    ];
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Ты медицинский консультант. На основе диагноза и данных пациента создай персонализированные рекомендации.

ДИАГНОЗ: "${diagnosis}"

ДАННЫЕ ПАЦИЕНТА:
${JSON.stringify(context, null, 2)}

Создай 4-6 конкретных, практических рекомендаций в JSON формате:

[
  {
    "title": "Краткое название рекомендации",
    "description": "Подробное описание что нужно делать",
    "category": "Мониторинг|Питание|Активность|Лечение|Образ жизни",
    "priority": "high|medium|low"
  }
]

ТРЕБОВАНИЯ:
- Учитывай биомаркеры и состояние здоровья пациента
- Давай конкретные, выполнимые советы
- Укажи правильные приоритеты
- Рекомендации должны быть безопасными
- Не назначай конкретные препараты, только общие группы`
        }]
      })
    });

    if (!response.ok) {
      console.error('Ошибка Anthropic API:', response.status);
      throw new Error('API error');
    }

    const data = await response.json();
    const content = data.content[0]?.text;
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Ошибка парсинга JSON:', parseError);
      }
    }
  } catch (error) {
    console.error('Ошибка при вызове ИИ:', error);
  }

  // Fallback рекомендации
  return [
    {
      title: 'Регулярный контроль состояния',
      description: 'Следите за симптомами и ведите дневник самочувствия.',
      category: 'Мониторинг',
      priority: 'high'
    },
    {
      title: 'Здоровое питание',
      description: 'Сбалансированный рацион с учетом заболевания.',
      category: 'Питание',
      priority: 'medium'
    },
    {
      title: 'Умеренная активность',
      description: 'Физические упражнения согласно рекомендациям врача.',
      category: 'Активность',
      priority: 'medium'
    }
  ];
}