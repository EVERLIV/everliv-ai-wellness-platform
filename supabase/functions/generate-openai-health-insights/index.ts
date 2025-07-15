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

    let requestBody;
    try {
      requestBody = await req.json();
      console.log('📥 Request body:', requestBody);
    } catch (parseError) {
      console.error('❌ Error parsing request body:', parseError);
      throw new Error('Invalid JSON in request body');
    }
    
    const { userId } = requestBody;

    if (!userId) {
      console.error('❌ User ID is missing from request');
      throw new Error('User ID is required');
    }

    console.log('👤 Processing request for user:', userId);

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

      // Сохраняем базовые рекомендации в базу данных
      console.log('💾 Saving basic insights to ai_recommendations table...');
      
      for (const insight of basicInsights) {
        try {
          const { error: insertError } = await supabase
            .from('ai_recommendations')
            .insert({
              user_id: userId,
              title: insight.title,
              content: insight.description,
              recommendation_type: insight.category,
              priority: insight.priority,
              source_data: {
                confidence: insight.confidence,
                scientificBasis: insight.scientificBasis,
                actionItems: insight.actionItems,
                timeframe: insight.timeframe
              }
            });

          if (insertError) {
            console.error('Error saving basic insight:', insertError);
          }
        } catch (saveError) {
          console.error('Error saving basic insight to DB:', saveError);
        }
      }

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

    // Проверяем, есть ли хоть какие-то данные для анализа
    const hasMinimalData = healthProfile.age || healthProfile.bmi || healthProfile.analyses_count > 0 || 
                          (healthProfile.biomarkers && healthProfile.biomarkers.length > 0) ||
                          healthProfile.height || healthProfile.weight || 
                          healthProfile.health_metrics_count_30d > 0 ||
                          (healthProfile.profile_goals && healthProfile.profile_goals.length > 0) ||
                          (healthProfile.user_goals && healthProfile.user_goals.length > 0) ||
                          healthProfile.first_name || healthProfile.gender;

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

      // Сохраняем starter рекомендации в базу данных
      console.log('💾 Saving starter insights to ai_recommendations table...');
      
      for (const insight of starterInsights) {
        try {
          const { error: insertError } = await supabase
            .from('ai_recommendations')
            .insert({
              user_id: userId,
              title: insight.title,
              content: insight.description,
              recommendation_type: insight.category,
              priority: insight.priority,
              source_data: {
                confidence: insight.confidence,
                scientificBasis: insight.scientificBasis,
                actionItems: insight.actionItems,
                timeframe: insight.timeframe
              }
            });

          if (insertError) {
            console.error('Error saving starter insight:', insertError);
          }
        } catch (saveError) {
          console.error('Error saving starter insight to DB:', saveError);
        }
      }

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

    // Формируем промпт на основе имеющихся данных
    const availableData = [];
    
    if (healthProfile.age) availableData.push(`Возраст: ${healthProfile.age} лет`);
    if (healthProfile.gender) availableData.push(`Пол: ${healthProfile.gender}`);
    if (healthProfile.bmi) availableData.push(`BMI: ${healthProfile.bmi}`);
    if (healthProfile.height) availableData.push(`Рост: ${healthProfile.height} см`);
    if (healthProfile.weight || healthProfile.avg_weight_30d) {
      availableData.push(`Вес: ${healthProfile.weight || healthProfile.avg_weight_30d} кг`);
    }
    
    const lifestyleData = [];
    if (healthProfile.avg_sleep_30d) lifestyleData.push(`Сон: ${healthProfile.avg_sleep_30d} ч/сутки`);
    if (healthProfile.avg_steps_30d) lifestyleData.push(`Шаги: ${healthProfile.avg_steps_30d}`);
    if (healthProfile.avg_exercise_30d) lifestyleData.push(`Упражнения: ${healthProfile.avg_exercise_30d} мин/день`);
    if (healthProfile.avg_stress_30d) lifestyleData.push(`Стресс: ${healthProfile.avg_stress_30d}/10`);
    if (healthProfile.avg_mood_30d) lifestyleData.push(`Настроение: ${healthProfile.avg_mood_30d}/10`);
    if (healthProfile.avg_water_30d) lifestyleData.push(`Вода: ${healthProfile.avg_water_30d} л/день`);
    
    const nutritionData = [];
    if (healthProfile.avg_calories_30d) nutritionData.push(`Калории: ${healthProfile.avg_calories_30d} ккал/день`);
    if (healthProfile.avg_protein_30d) nutritionData.push(`Белки: ${healthProfile.avg_protein_30d}г`);
    if (healthProfile.avg_carbs_30d) nutritionData.push(`Углеводы: ${healthProfile.avg_carbs_30d}г`);
    if (healthProfile.avg_fat_30d) nutritionData.push(`Жиры: ${healthProfile.avg_fat_30d}г`);

    const userPrompt = `
Проанализируй медицинские данные пользователя и создай инсайты по трем категориям.

ВАЖНО: Даже при ограниченных данных создавай полезные персонализированные рекомендации.

ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
${availableData.length > 0 ? availableData.join('\n') : 'Базовые данные не указаны - рекомендовать заполнение'}

БИОМАРКЕРЫ: ${healthProfile.biomarkers && healthProfile.biomarkers.length > 0 ? JSON.stringify(healthProfile.biomarkers) : 'Не загружены - рекомендовать сдать анализы'}

ОБРАЗ ЖИЗНИ (30 дней):
${lifestyleData.length > 0 ? lifestyleData.join('\n') : 'Данные не отслеживаются - рекомендовать начать мониторинг'}

ПИТАНИЕ:
${nutritionData.length > 0 ? nutritionData.join('\n') : 'Питание не отслеживается - рекомендовать ведение дневника'}

МЕДИЦИНСКАЯ ИСТОРИЯ:
- Количество анализов: ${healthProfile.analyses_count || 0}
- Последний анализ: ${healthProfile.last_analysis_date || 'Не указан'}
- Хронические заболевания: ${healthProfile.medical_conditions?.join(', ') || 'Не указаны'}
- Аллергии: ${healthProfile.allergies?.join(', ') || 'Не указаны'}  
- Лекарства: ${healthProfile.medications?.join(', ') || 'Не принимает'}

ЦЕЛИ: ${healthProfile.profile_goals?.join(', ') || healthProfile.user_goals?.map(g => g.title).join(', ') || 'Не поставлены - помочь определить'}

Создай 4-6 персонализированных инсайтов, используя имеющиеся данные и учитывая пробелы как возможности для улучшения.
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

    // Сохраняем рекомендации в базу данных
    console.log('💾 Saving insights to ai_recommendations table...');
    
    for (const insight of validInsights) {
      try {
        const { error: insertError } = await supabase
          .from('ai_recommendations')
          .insert({
            user_id: userId,
            title: insight.title,
            content: insight.description,
            recommendation_type: insight.category,
            priority: insight.priority,
            source_data: {
              confidence: insight.confidence,
              scientificBasis: insight.scientificBasis,
              actionItems: insight.actionItems,
              timeframe: insight.timeframe,
              riskFactors: insight.riskFactors,
              benefits: insight.benefits
            }
          });

        if (insertError) {
          console.error('Error saving insight:', insertError);
        }
      } catch (saveError) {
        console.error('Error saving insight to DB:', saveError);
      }
    }

    console.log('💾 Insights saved to database');

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
    
    // Возвращаем fallback инсайты вместо ошибки
    const errorInsights = [
      {
        id: 'error-1',
        category: 'practical',
        title: 'Ошибка анализа',
        description: 'Произошла временная ошибка при анализе данных. Попробуйте позже или обратитесь в поддержку.',
        priority: 'medium',
        confidence: 50,
        scientificBasis: 'Техническая ошибка системы',
        actionItems: ['Повторите попытку через несколько минут', 'Проверьте интернет-соединение'],
        timeframe: 'Немедленно'
      }
    ];

    return new Response(JSON.stringify({ 
      success: true,
      insights: errorInsights,
      profileData: {
        age: null,
        bmi: null,
        lastAnalysis: null
      },
      error: error.message
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});