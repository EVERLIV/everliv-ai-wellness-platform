import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Функция для расчета полноты данных
function calculateCompletenessScore(aiProfile: any): number {
  let score = 0;
  let maxScore = 0;

  // Базовые демографические данные (20 баллов)
  maxScore += 20;
  if (aiProfile.age) score += 5;
  if (aiProfile.gender) score += 5;
  if (aiProfile.height && aiProfile.weight) score += 10;

  // Профиль здоровья (30 баллов)
  maxScore += 30;
  if (aiProfile.health_profile_data) score += 30;

  // Биомаркеры (25 баллов)
  maxScore += 25;
  const biomarkersCount = aiProfile.biomarkers?.length || 0;
  if (biomarkersCount > 0) score += Math.min(25, biomarkersCount * 2);

  // Метрики образа жизни (15 баллов)
  maxScore += 15;
  if (aiProfile.health_metrics_count_30d > 0) score += Math.min(15, aiProfile.health_metrics_count_30d);

  // Питание (10 баллов)
  maxScore += 10;
  if (aiProfile.nutrition_tracking_days_30d > 0) score += Math.min(10, aiProfile.nutrition_tracking_days_30d);

  return Math.round((score / maxScore) * 100);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting generate-ai-recommendations function');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No Authorization header found');
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating AI recommendations for user:', user.id);

    // Получаем агрегированные данные из нового VIEW
    console.log('Fetching aggregated user data from view for user:', user.id);
    
    const { data: aiProfile, error: profileError } = await supabaseClient
      .from('user_health_ai_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('AI profile fetch error:', profileError);
    }
    console.log('AI profile data loaded:', !!aiProfile);

    // Формируем структурированные данные для ИИ
    const analysisData = aiProfile ? {
      demographics: {
        age: aiProfile.age,
        gender: aiProfile.gender,
        height: aiProfile.height,
        weight: aiProfile.weight,
        bmi: aiProfile.bmi,
        name: `${aiProfile.first_name || ''} ${aiProfile.last_name || ''}`.trim()
      },
      medical_profile: {
        conditions: aiProfile.medical_conditions || [],
        allergies: aiProfile.allergies || [],
        medications: aiProfile.medications || [],
        profile_goals: aiProfile.profile_goals || [],
        health_profile_data: aiProfile.health_profile_data
      },
      biomarkers: {
        total_count: aiProfile.biomarkers?.length || 0,
        latest_data: aiProfile.biomarkers || [],
        analyses_count: aiProfile.analyses_count || 0,
        last_test_date: aiProfile.last_analysis_date
      },
      lifestyle_metrics: {
        tracking_period_days: aiProfile.health_metrics_count_30d || 0,
        averages_30d: {
          weight: aiProfile.avg_weight_30d,
          steps: aiProfile.avg_steps_30d,
          sleep_hours: aiProfile.avg_sleep_30d,
          exercise_minutes: aiProfile.avg_exercise_30d,
          stress_level: aiProfile.avg_stress_30d,
          mood_level: aiProfile.avg_mood_30d,
          water_intake: aiProfile.avg_water_30d,
          nutrition_quality: aiProfile.avg_nutrition_30d
        }
      },
      nutrition: {
        tracking_days_30d: aiProfile.nutrition_tracking_days_30d || 0,
        averages_30d: {
          calories: aiProfile.avg_calories_30d,
          protein: aiProfile.avg_protein_30d,
          carbs: aiProfile.avg_carbs_30d,
          fat: aiProfile.avg_fat_30d
        }
      },
      goals: aiProfile.user_goals || [],
      data_completeness: {
        has_basic_profile: !!(aiProfile.age && aiProfile.gender),
        has_health_profile: !!aiProfile.health_profile_data,
        has_biomarkers: (aiProfile.biomarkers?.length || 0) > 0,
        has_lifestyle_data: (aiProfile.health_metrics_count_30d || 0) > 0,
        has_nutrition_data: (aiProfile.nutrition_tracking_days_30d || 0) > 0,
        completeness_score: calculateCompletenessScore(aiProfile)
      }
    } : null;

    console.log('Analysis data summary:', {
      hasProfile: !!analysisData,
      demographics: analysisData?.demographics,
      biomarkersCount: analysisData?.biomarkers.total_count,
      lifestyleTrackingDays: analysisData?.lifestyle_metrics.tracking_period_days,
      nutritionTrackingDays: analysisData?.nutrition.tracking_days_30d,
      completenessScore: analysisData?.data_completeness.completeness_score
    });

    // Проверяем наличие данных для анализа
    const hasMinimalData = analysisData && (
      analysisData.demographics.age || 
      analysisData.demographics.gender ||
      analysisData.medical_profile.health_profile_data ||
      analysisData.biomarkers.total_count > 0 || 
      analysisData.lifestyle_metrics.tracking_period_days > 0 ||
      analysisData.nutrition.tracking_days_30d > 0
    );

    // Если данных мало, генерируем базовые рекомендации
    if (!hasMinimalData) {
      console.log('Insufficient data for full AI analysis, providing basic recommendations');
      
      // Возвращаем базовые рекомендации при отсутствии данных
      const basicRecommendations = {
        prognostic: [
          {
            title: "Создание базовой картины здоровья",
            content: "Для точного прогноза рекомендуется заполнить профиль здоровья и добавить данные о биомаркерах",
            priority: "high"
          },
          {
            title: "Мониторинг ключевых показателей",
            content: "Начните отслеживать основные метрики: вес, активность, сон и стресс для построения трендов",
            priority: "medium"
          },
          {
            title: "Профилактический подход",
            content: "Регулярные проверки здоровья помогут выявить риски на ранней стадии",
            priority: "medium"
          }
        ],
        actionable: [
          {
            title: "Заполните профиль здоровья",
            content: "Укажите возраст, пол, рост, вес и основные медицинские данные для персонализированных рекомендаций",
            priority: "high"
          },
          {
            title: "Добавьте результаты анализов",
            content: "Загрузите последние анализы крови для оценки биомаркеров и выявления дисбалансов",
            priority: "high"
          },
          {
            title: "Начните отслеживать активность",
            content: "Ежедневно записывайте количество шагов, качество сна и уровень стресса",
            priority: "medium"
          },
          {
            title: "Основы здорового образа жизни",
            content: "150 минут умеренной физической активности в неделю, 7-9 часов сна, сбалансированное питание",
            priority: "medium"
          }
        ],
        personalized: [
          {
            title: "Начальная оценка здоровья",
            content: "Пройдите базовое медицинское обследование включая общий анализ крови и биохимию",
            priority: "high"
          },
          {
            title: "Установка целей здоровья",
            content: "Определите 2-3 приоритетные цели для улучшения здоровья на ближайшие 3 месяца",
            priority: "medium"
          },
          {
            title: "Консультация специалиста",
            content: "Обратитесь к терапевту для составления индивидуального плана профилактики",
            priority: "medium"
          }
        ]
      };

      // Сохраняем базовые рекомендации
      const recommendationsToSave = [];
      
      for (const [type, recs] of Object.entries(basicRecommendations)) {
        for (const rec of recs) {
          recommendationsToSave.push({
            user_id: user.id,
            recommendation_type: type,
            title: rec.title,
            content: rec.content,
            priority: rec.priority,
            source_data: { note: 'Basic recommendations due to insufficient data' }
          });
        }
      }

      if (recommendationsToSave.length > 0) {
        const { error: saveError } = await supabaseClient
          .from('ai_recommendations')
          .insert(recommendationsToSave);

        if (saveError) {
          console.error('Error saving basic recommendations:', saveError);
        } else {
          console.log('Successfully saved basic recommendations');
        }
      }

      return new Response(JSON.stringify({ 
        recommendations: basicRecommendations,
        note: 'Базовые рекомендации. Заполните профиль для персонализированного анализа.',
        data_status: {
          hasProfile: !!analysisData,
          biomarkersCount: analysisData?.biomarkers.total_count || 0,
          lifestyleTrackingDays: analysisData?.lifestyle_metrics.tracking_period_days || 0,
          completenessScore: analysisData?.data_completeness.completeness_score || 0
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not found');
    }

    const prompt = `Вы - экспертная система персонализированной медицины, объединяющая знания ведущих специалистов:
- Functional Medicine (функциональная медицина)
- Preventive Medicine (превентивная медицина)
- Integrative Medicine (интегративная медицина)
- Longevity Medicine (медицина долголетия)
- Clinical Nutrition (клиническое питание)
- Exercise Physiology (физиология упражнений)
- Biomarker Analysis (анализ биомаркеров)

ДАННЫЕ ПАЦИЕНТА:
${JSON.stringify(analysisData, null, 2)}

ЗАДАЧА: Создать медицински обоснованные рекомендации в 3 категориях:

1. ПРОГНОЗНАЯ АНАЛИТИКА (Predictive Insights)
- Анализ трендов биомаркеров с указанием направления изменений
- Прогнозирование рисков развития заболеваний с временными рамками
- Оценка эффективности текущих вмешательств
- Предсказание ответа на терапевтические изменения

2. ДЕЙСТВЕННЫЕ РЕКОМЕНДАЦИИ (Actionable Interventions)
- Конкретные протоколы питания с микро- и макронутриентами
- Программы физических упражнений с интенсивностью и частотой
- Протоколы нутрицевтиков с дозировками и временем приема
- Изменения образа жизни с измеримыми KPI

3. ПЕРСОНАЛИЗИРОВАННЫЕ СТРАТЕГИИ (Personalized Strategies)
- Индивидуальные подходы с учетом генетики, возраста, пола
- Приоритизация вмешательств по ROI для здоровья
- Учет сопутствующих состояний и противопоказаний
- Долгосрочная стратегия оптимизации здоровья

ПРИНЦИПЫ ЭКСПЕРТНЫХ РЕКОМЕНДАЦИЙ:
- Используйте ОПТИМАЛЬНЫЕ диапазоны для долголетия (не лабораторные "нормы")
- Системный подход с учетом взаимодействий биомаркеров
- Доказательная база: мета-анализы, RCT, когортные исследования
- Персонализация на основе биохимического профиля
- Практическая применимость в реальной жизни
- Безопасность и отсутствие побочных эффектов

ФОРМАТ ОТВЕТА (строго JSON):
{
  "prognostic": [
    {
      "title": "Заголовок прогноза",
      "content": "Детальное описание прогноза",
      "priority": "high|medium|low"
    }
  ],
  "actionable": [
    {
      "title": "Конкретное действие",
      "content": "Детальная инструкция",
      "priority": "high|medium|low"
    }
  ],
  "personalized": [
    {
      "title": "Персональная рекомендация",
      "content": "Индивидуальный совет",
      "priority": "high|medium|low"
    }
  ]
}

ВАЖНО:
- НЕ ставьте диагнозы
- НЕ рекомендуйте рецептурные препараты
- Указывайте "рекомендуется обсудить с врачом" при высоких рисках
- Фокус на профилактику и оптимизацию здоровья`;

    // Retry mechanism with exponential backoff
    let content;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Calling Anthropic API (attempt ${attempt})`);
        
        // Use faster model on retries
        const model = attempt === 1 ? 'claude-3-5-sonnet-20241022' : 'claude-3-5-haiku-20241022';
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anthropicKey}`,
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            max_tokens: 4000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });

        console.log(`Anthropic API response status (attempt ${attempt}):`, response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Anthropic API error (attempt ${attempt}):`, response.status, errorText);
          
          // If overloaded (529) or rate limited (429), retry with exponential backoff
          if ((response.status === 529 || response.status === 429) && attempt < 3) {
            const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s
            console.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          // Fallback recommendations for API errors
          const fallbackRecommendations = {
            prognostic: [
              {
                title: "Базовый мониторинг здоровья",
                content: "Продолжайте регулярные обследования для отслеживания изменений показателей",
                priority: "medium"
              }
            ],
            actionable: [
              {
                title: "Поддержание активности",
                content: "Регулярные физические упражнения 150 минут в неделю умеренной интенсивности",
                priority: "high"
              }
            ],
            personalized: [
              {
                title: "Персональная консультация",
                content: "Рекомендуется обратиться к врачу для детального анализа показателей",
                priority: "medium"
              }
            ]
          };
          
          return new Response(JSON.stringify({ 
            recommendations: fallbackRecommendations,
            note: "Использованы базовые рекомендации из-за временной недоступности ИИ-сервиса"
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const anthropicData = await response.json();
        content = anthropicData.content[0].text;
        console.log(`AI response received successfully on attempt ${attempt}`);
        break;
        
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt === 3) {
          throw error;
        }
        
        // Exponential backoff for retries
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    console.log('Claude response:', content);
    
    let recommendations;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in Claude response');
      }
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      throw new Error('Failed to parse AI recommendations');
    }

    // Сохраняем рекомендации в базу данных
    const recommendationsToSave = [];
    
    // Прогнозная аналитика
    if (recommendations.prognostic) {
      for (const rec of recommendations.prognostic) {
        recommendationsToSave.push({
          user_id: user.id,
          recommendation_type: 'prognostic',
          title: rec.title,
          content: rec.content,
          priority: rec.priority,
          source_data: analysisData
        });
      }
    }

    // Actionable рекомендации
    if (recommendations.actionable) {
      for (const rec of recommendations.actionable) {
        recommendationsToSave.push({
          user_id: user.id,
          recommendation_type: 'actionable',
          title: rec.title,
          content: rec.content,
          priority: rec.priority,
          source_data: analysisData
        });
      }
    }

    // Персонализированные рекомендации
    if (recommendations.personalized) {
      for (const rec of recommendations.personalized) {
        recommendationsToSave.push({
          user_id: user.id,
          recommendation_type: 'personalized',
          title: rec.title,
          content: rec.content,
          priority: rec.priority,
          source_data: analysisData
        });
      }
    }

    // Удаляем старые рекомендации (старше 7 дней)
    await supabaseClient
      .from('ai_recommendations')
      .delete()
      .eq('user_id', user.id)
      .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Сохраняем новые рекомендации
    if (recommendationsToSave.length > 0) {
      const { error: saveError } = await supabaseClient
        .from('ai_recommendations')
        .insert(recommendationsToSave);

      if (saveError) {
        console.error('Error saving recommendations:', saveError);
        throw new Error('Failed to save recommendations');
      }
    }

    console.log('Generated and saved recommendations:', recommendations);

    return new Response(JSON.stringify({ 
      recommendations,
      saved_count: recommendationsToSave.length,
      data_completeness_score: analysisData.data_completeness.completeness_score
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});