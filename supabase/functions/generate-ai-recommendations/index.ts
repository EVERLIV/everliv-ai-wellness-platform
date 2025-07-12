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
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const { data: analyses } = await supabaseClient
      .from('medical_analyses')
      .select(`*, biomarkers (*)`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: healthMetrics } = await supabaseClient
      .from('daily_health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    const analysisData = {
      profile: {
        age: profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null,
        gender: profile?.gender,
        height: profile?.height,
        weight: profile?.weight,
        medical_conditions: profile?.medical_conditions || [],
        medications: profile?.medications || [],
        goals: profile?.goals || []
      },
      biomarkers: analyses?.flatMap(a => a.biomarkers || []).map((b: any) => ({
        name: b.name,
        value: b.value,
        reference_range: b.reference_range,
        status: b.status
      })) || [],
      health_metrics: {
        avg_weight: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.weight || 0), 0) / healthMetrics.length : 0,
        avg_steps: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.steps || 0), 0) / healthMetrics.length : 0,
        avg_sleep: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.sleep_hours || 0), 0) / healthMetrics.length : 0,
        avg_exercise: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.exercise_minutes || 0), 0) / healthMetrics.length : 0,
        avg_water: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.water_intake || 0), 0) / healthMetrics.length : 0,
        avg_stress: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.stress_level || 0), 0) / healthMetrics.length : 0
      }
    };

    console.log('Analysis data prepared:', {
      hasProfile: !!analysisData.profile,
      biomarkersCount: analysisData.biomarkers.length,
      hasHealthMetrics: !!analysisData.health_metrics,
      avgWeight: analysisData.health_metrics.avg_weight,
      avgSteps: analysisData.health_metrics.avg_steps
    });

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