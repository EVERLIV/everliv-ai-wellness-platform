import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthInsight {
  id: string;
  category: 'predictive' | 'practical' | 'personalized';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  scientificBasis: string;
  actionItems: string[];
  timeframe: string;
  riskFactors?: string[];
  benefits?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Health Insights Generation Started ===');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('OPENAI_API_KEY available:', !!openAIApiKey);
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found in environment');
      throw new Error('OPENAI_API_KEY not found');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('🔍 Fetching AI health profile for user:', userId);

    // Получаем данные AI профиля пользователя
    const { data: healthProfile, error } = await supabase
      .from('user_health_ai_profile')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching health profile:', error);
      throw new Error('Failed to fetch health profile');
    }

    if (!healthProfile) {
      console.log('⚠️ No health profile found, generating basic recommendations');
      
      const basicInsights: HealthInsight[] = [
        {
          id: 'basic-1',
          category: 'practical',
          title: 'Создание профиля здоровья',
          description: 'Для получения персональных рекомендаций необходимо заполнить профиль здоровья и загрузить результаты медицинских анализов.',
          priority: 'high',
          confidence: 100,
          scientificBasis: 'Персонализированная медицина требует комплексных данных о пациенте для точной оценки рисков и рекомендаций',
          actionItems: [
            'Заполните базовую информацию (возраст, пол, рост, вес)',
            'Загрузите результаты последних анализов крови',
            'Укажите хронические заболевания и принимаемые лекарства',
            'Опишите образ жизни и физическую активность'
          ],
          timeframe: '15-30 минут'
        },
        {
          id: 'basic-2',
          category: 'personalized',
          title: 'Регулярный мониторинг здоровья',
          description: 'Создайте привычку регулярно отслеживать ключевые показатели здоровья для раннего выявления изменений.',
          priority: 'medium',
          confidence: 95,
          scientificBasis: 'Проактивный мониторинг здоровья позволяет выявлять проблемы на ранней стадии, когда они наиболее эффективно поддаются лечению',
          actionItems: [
            'Ведите дневник питания и физической активности',
            'Регулярно измеряйте артериальное давление',
            'Отслеживайте качество сна',
            'Проходите профилактические обследования'
          ],
          timeframe: 'Ежедневно'
        },
        {
          id: 'basic-3',
          category: 'predictive',
          title: 'Профилактика заболеваний',
          description: 'Начните профилактические мероприятия для снижения рисков развития хронических заболеваний.',
          priority: 'medium',
          confidence: 90,
          scientificBasis: 'Профилактика является наиболее эффективным подходом к поддержанию здоровья',
          actionItems: [
            'Поддерживайте здоровый вес',
            'Занимайтесь физической активностью 150 минут в неделю',
            'Сбалансированно питайтесь',
            'Избегайте вредных привычек'
          ],
          timeframe: 'Постоянно'
        }
      ];

      return new Response(JSON.stringify({ 
        success: true, 
        insights: basicInsights,
        profileData: {
          age: null,
          bmi: null,
          lastAnalysis: null
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Проверяем, есть ли достаточно данных для анализа
    const hasMinimalData = healthProfile.age || healthProfile.bmi || healthProfile.analyses_count > 0 || 
                          (healthProfile.biomarkers && healthProfile.biomarkers.length > 0);

    if (!hasMinimalData) {
      console.log('⚠️ Insufficient data in health profile, generating starter recommendations');
      
      const starterInsights: HealthInsight[] = [
        {
          id: 'starter-1',
          category: 'practical',
          title: 'Первые шаги к здоровью',
          description: 'Ваш профиль здоровья пуст. Начните с заполнения базовой информации для получения персонализированных рекомендаций.',
          priority: 'high',
          confidence: 100,
          scientificBasis: 'Базовая информация о возрасте, весе и росте необходима для расчета ключевых показателей здоровья',
          actionItems: [
            'Перейдите в раздел "Профиль" и заполните основную информацию',
            'Укажите ваш возраст, рост и текущий вес',
            'Выберите ваши цели в области здоровья',
            'Загрузите последние результаты анализов, если они есть'
          ],
          timeframe: '10-15 минут'
        },
        {
          id: 'starter-2',
          category: 'personalized',
          title: 'Начало отслеживания метрик',
          description: 'Начните вести ежедневный учет основных показателей здоровья для создания базовой картины.',
          priority: 'medium',
          confidence: 95,
          scientificBasis: 'Регулярное отслеживание создает данные для анализа тенденций и выявления паттернов',
          actionItems: [
            'Записывайте ежедневную физическую активность',
            'Отмечайте качество и продолжительность сна',
            'Ведите дневник питания',
            'Оценивайте уровень стресса и настроения'
          ],
          timeframe: '5 минут ежедневно'
        },
        {
          id: 'starter-3',
          category: 'predictive',
          title: 'Планирование медицинского обследования',
          description: 'Запланируйте комплексное обследование для получения полной картины состояния здоровья.',
          priority: 'medium',
          confidence: 90,
          scientificBasis: 'Базовые медицинские анализы позволяют выявить скрытые проблемы и факторы риска',
          actionItems: [
            'Запишитесь на консультацию к терапевту',
            'Сдайте общий и биохимический анализ крови',
            'Проверьте артериальное давление и пульс',
            'Пройдите базовое обследование по возрасту'
          ],
          timeframe: '1-2 недели'
        }
      ];

      return new Response(JSON.stringify({ 
        success: true, 
        insights: starterInsights,
        profileData: {
          age: healthProfile.age,
          bmi: healthProfile.bmi,
          lastAnalysis: healthProfile.last_analysis_date
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 Health profile data:', {
      hasProfile: !!healthProfile,
      age: healthProfile.age,
      bmi: healthProfile.bmi,
      analysesCount: healthProfile.analyses_count,
      metricsCount: healthProfile.health_metrics_count_30d
    });

    const systemPrompt = `
Ты - эксперт по персонализированной медицине и аналитике здоровья. Анализируй комплексные медицинские данные пользователя и генерируй инсайты по трем направлениям:

1. ПРОГНОЗНАЯ АНАЛИТИКА - предсказания рисков, тенденций, будущих проблем
2. ПРАКТИЧЕСКИЕ РЕКОМЕНДАЦИИ - конкретные действия для улучшения здоровья
3. ПЕРСОНАЛИЗИРОВАННЫЕ РЕКОМЕНДАЦИИ - индивидуальные советы на основе уникального профиля

ВАЖНЫЕ ПРИНЦИПЫ:
- Используй доказательную медицину
- Учитывай возраст, пол, BMI, биомаркеры, образ жизни
- Указывай уровень достоверности (confidence 0-100)
- Добавляй научное обоснование
- Предлагай конкретные действия с временными рамками

Формат ответа: СТРОГО JSON массив объектов HealthInsight:
{
  "id": "unique_id",
  "category": "predictive|practical|personalized", 
  "title": "Краткий заголовок",
  "description": "Подробное описание",
  "priority": "high|medium|low",
  "confidence": 85,
  "scientificBasis": "Научное обоснование",
  "actionItems": ["Конкретное действие 1", "Действие 2"],
  "timeframe": "2-4 недели",
  "riskFactors": ["Фактор риска"] (опционально),
  "benefits": ["Польза"] (опционально)
}
`;

    const userPrompt = `
Проанализируй медицинские данные пользователя и создай инсайты по трем категориям:

ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
Возраст: ${healthProfile.age} лет
Пол: ${healthProfile.gender}
BMI: ${healthProfile.bmi}
Рост: ${healthProfile.height} см
Вес: ${healthProfile.avg_weight_30d} кг

БИОМАРКЕРЫ: ${JSON.stringify(healthProfile.biomarkers)}

ОБРАЗ ЖИЗНИ (30 дней):
- Сон: ${healthProfile.avg_sleep_30d} ч/сутки
- Шаги: ${healthProfile.avg_steps_30d}
- Упражнения: ${healthProfile.avg_exercise_30d} мин/день
- Стресс: ${healthProfile.avg_stress_30d}/10
- Настроение: ${healthProfile.avg_mood_30d}/10
- Вода: ${healthProfile.avg_water_30d} л/день

ПИТАНИЕ:
- Калории: ${healthProfile.avg_calories_30d} ккал/день
- Белки: ${healthProfile.avg_protein_30d}г
- Углеводы: ${healthProfile.avg_carbs_30d}г
- Жиры: ${healthProfile.avg_fat_30d}г

МЕДИЦИНСКАЯ ИСТОРИЯ:
- Количество анализов: ${healthProfile.analyses_count}
- Последний анализ: ${healthProfile.last_analysis_date}
- Хронические заболевания: ${healthProfile.medical_conditions?.join(', ') || 'Нет'}
- Аллергии: ${healthProfile.allergies?.join(', ') || 'Нет'}
- Лекарства: ${healthProfile.medications?.join(', ') || 'Нет'}

ЦЕЛИ: ${healthProfile.profile_goals?.join(', ') || 'Не указаны'}

Создай 6-9 инсайтов (по 2-3 в каждой категории), учитывая все данные.
`;

    console.log('🤖 Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('📝 OpenAI response received');

    // Парсим JSON ответ
    let insights: HealthInsight[];
    try {
      insights = JSON.parse(content);
      if (!Array.isArray(insights)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response:', content);
      
      // Fallback инсайты если парсинг не удался
      insights = [
        {
          id: 'fallback-1',
          category: 'practical',
          title: 'Анализ временно недоступен',
          description: 'Система анализа данных временно недоступна. Попробуйте позже.',
          priority: 'medium',
          confidence: 50,
          scientificBasis: 'Техническая ошибка системы анализа',
          actionItems: ['Повторите запрос через несколько минут'],
          timeframe: 'Немедленно'
        }
      ];
    }

    // Валидация и очистка данных
    const validInsights = insights.filter(insight => 
      insight && 
      insight.category && 
      ['predictive', 'practical', 'personalized'].includes(insight.category) &&
      insight.title && 
      insight.description
    ).map(insight => ({
      ...insight,
      id: insight.id || `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      confidence: Math.min(100, Math.max(0, insight.confidence || 70)),
      priority: insight.priority || 'medium',
      actionItems: insight.actionItems || [],
      timeframe: insight.timeframe || 'Не указано'
    }));

    console.log('✅ Generated insights:', {
      total: validInsights.length,
      predictive: validInsights.filter(i => i.category === 'predictive').length,
      practical: validInsights.filter(i => i.category === 'practical').length,
      personalized: validInsights.filter(i => i.category === 'personalized').length
    });

    return new Response(JSON.stringify({ 
      success: true, 
      insights: validInsights,
      profileData: {
        age: healthProfile.age,
        bmi: healthProfile.bmi,
        lastAnalysis: healthProfile.last_analysis_date
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-openai-health-insights:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});