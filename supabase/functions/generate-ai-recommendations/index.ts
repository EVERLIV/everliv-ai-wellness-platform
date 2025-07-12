import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Получаем данные пользователя
    console.log('Fetching user data for user:', user.id);
    
    // Получаем профиль пользователя из таблицы profiles
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }
    console.log('Profile data:', profile);

    // Получаем профиль здоровья из health_profiles
    const { data: healthProfile, error: healthProfileError } = await supabaseClient
      .from('health_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (healthProfileError) {
      console.error('Health profile fetch error:', healthProfileError);
    }
    console.log('Health profile data:', healthProfile);

    // Получаем медицинские анализы
    const { data: analyses, error: analysesError } = await supabaseClient
      .from('medical_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (analysesError) {
      console.error('Analyses fetch error:', analysesError);
    }
    console.log('Medical analyses:', analyses?.length || 0, 'items');

    // Получаем биомаркеры для всех анализов пользователя
    let biomarkers = [];
    if (analyses && analyses.length > 0) {
      const analysisIds = analyses.map(a => a.id);
      const { data: biomarkersData, error: biomarkersError } = await supabaseClient
        .from('biomarkers')
        .select('*')
        .in('analysis_id', analysisIds)
        .order('created_at', { ascending: false });

      if (biomarkersError) {
        console.error('Biomarkers fetch error:', biomarkersError);
      } else {
        biomarkers = biomarkersData || [];
      }
    }
    console.log('Biomarkers data:', biomarkers.length, 'items');

    // Получаем записи о питании
    const { data: foodEntries, error: foodError } = await supabaseClient
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('entry_date', { ascending: false });

    if (foodError) {
      console.error('Food entries fetch error:', foodError);
    }
    console.log('Food entries:', foodEntries?.length || 0, 'items');

    // Получаем метрики здоровья
    const { data: healthMetrics, error: metricsError } = await supabaseClient
      .from('daily_health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (metricsError) {
      console.error('Health metrics fetch error:', metricsError);
    }
    console.log('Health metrics data:', healthMetrics?.length || 0, 'items');

    // Формируем данные для анализа
    const analysisData = {
      profile: {
        // Данные из profiles
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        age: profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null,
        gender: profile?.gender,
        height: profile?.height,
        weight: profile?.weight,
        medical_conditions: profile?.medical_conditions || [],
        medications: profile?.medications || [],
        goals: profile?.goals || [],
        // Данные из health_profiles
        health_profile_data: healthProfile?.profile_data || null
      },
      biomarkers: biomarkers.map((b: any) => ({
        name: b.name,
        value: b.value,
        reference_range: b.reference_range,
        status: b.status,
        created_at: b.created_at
      })),
      analyses_summary: analyses?.map((a: any) => ({
        type: a.analysis_type,
        date: a.created_at,
        summary: a.summary,
        risk_level: a.results?.riskLevel
      })) || [],
      nutrition: {
        total_entries: foodEntries?.length || 0,
        recent_calories: foodEntries?.length ? foodEntries.reduce((sum: number, f: any) => sum + (f.calories || 0), 0) / foodEntries.length : 0,
        recent_protein: foodEntries?.length ? foodEntries.reduce((sum: number, f: any) => sum + (f.protein || 0), 0) / foodEntries.length : 0,
        recent_carbs: foodEntries?.length ? foodEntries.reduce((sum: number, f: any) => sum + (f.carbs || 0), 0) / foodEntries.length : 0,
        recent_fat: foodEntries?.length ? foodEntries.reduce((sum: number, f: any) => sum + (f.fat || 0), 0) / foodEntries.length : 0
      },
      health_metrics: {
        total_entries: healthMetrics?.length || 0,
        avg_weight: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.weight || 0), 0) / healthMetrics.length : 0,
        avg_steps: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.steps || 0), 0) / healthMetrics.length : 0,
        avg_sleep: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.sleep_hours || 0), 0) / healthMetrics.length : 0,
        avg_exercise: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.exercise_minutes || 0), 0) / healthMetrics.length : 0,
        avg_water: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.water_intake || 0), 0) / healthMetrics.length : 0,
        avg_stress: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.stress_level || 0), 0) / healthMetrics.length : 0,
        avg_mood: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.mood_level || 0), 0) / healthMetrics.length : 0,
        avg_nutrition: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.nutrition_quality || 0), 0) / healthMetrics.length : 0
      }
    };

    console.log('Analysis data summary:', {
      hasProfile: !!analysisData.profile,
      hasHealthProfile: !!analysisData.profile.health_profile_data,
      biomarkersCount: analysisData.biomarkers.length,
      analysesCount: analysisData.analyses_summary.length,
      nutritionEntries: analysisData.nutrition.total_entries,
      healthMetricsEntries: analysisData.health_metrics.total_entries,
      profileAge: analysisData.profile.age,
      avgSteps: analysisData.health_metrics.avg_steps,
      avgSleep: analysisData.health_metrics.avg_sleep
    });

    // Проверяем наличие достаточных данных для полного анализа
    const hasMinimalData = analysisData.profile.age || 
                          analysisData.biomarkers.length > 0 || 
                          analysisData.health_metrics.total_entries > 0;

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
          hasProfile: !!analysisData.profile,
          biomarkersCount: analysisData.biomarkers.length,
          healthMetricsEntries: analysisData.health_metrics.total_entries
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not found');
    }

    const prompt = `Вы - продвинутая ИИ-система для анализа биомаркеров и расчета рисков заболеваний, объединяющая знания:
- Longevity Medicine (медицина долголетия)
- Precision Medicine (персонализированная медицина) 
- Functional Medicine (функциональная медицина)
- Preventive Cardiology (превентивная кардиология)
- Endocrinology (эндокринология)
- Biogerontology (биогеронтология)

ДАННЫЕ ПАЦИЕНТА:
${JSON.stringify(analysisData, null, 2)}

ЗАДАЧА: Создать персонализированные рекомендации в 3 категориях по 3-4 пункта каждая:

1. ПРОГНОЗНАЯ АНАЛИТИКА
- Анализ трендов биомаркеров и прогноз изменений
- Предсказание рисков на основе текущих показателей
- Временные рамки достижения целей

2. ПРАКТИЧЕСКИЕ РЕКОМЕНДАЦИИ  
- Конкретные действия для улучшения показателей
- Протоколы добавок и дозировки
- Изменения образа жизни с измеримыми целями

3. ПЕРСОНАЛИЗИРОВАННЫЕ РЕКОМЕНДАЦИИ
- Индивидуальные советы на основе профиля
- Учет возраста, пола, текущих состояний
- Приоритизация по важности для данного пациента

ПРИНЦИПЫ:
- Используйте ОПТИМАЛЬНЫЕ диапазоны (не лабораторные нормы)
- Холистический подход с учетом взаимосвязей
- Научно обоснованные рекомендации
- Понятный язык без медицинского жаргона

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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicKey}`,
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    console.log('Anthropic API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error details:', errorText);
      
      // Возвращаем fallback рекомендации при ошибке API
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
        note: "Использованы базовые рекомендации из-за временной недоступности ИИ"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const anthropicData = await response.json();
    const content = anthropicData.content[0].text;
    
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
      saved_count: recommendationsToSave.length 
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