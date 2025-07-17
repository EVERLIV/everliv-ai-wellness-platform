import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Function started, checking OpenAI key:', !!openAIApiKey);
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { user_id, selected_date, excluded_hashes = [] } = await req.json();

    console.log('Generating analysis recommendations for user:', user_id, 'date:', selected_date);

    // Получаем данные о пользователе
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    // Получаем биомаркеры пользователя
    const { data: biomarkers } = await supabase
      .from('biomarker_history')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Получаем медицинские анализы
    const { data: analyses } = await supabase
      .from('medical_analyses')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Получаем данные о здоровье за последние 30 дней
    const { data: healthMetrics } = await supabase
      .from('daily_health_metrics')
      .select('*')
      .eq('user_id', user_id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    // Формируем контекст для OpenAI
    const userAge = profile?.date_of_birth 
      ? Math.floor((Date.now() - new Date(profile.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;

    const contextData = {
      profile: {
        age: userAge,
        gender: profile?.gender,
        weight: profile?.weight,
        height: profile?.height,
        medical_conditions: profile?.medical_conditions,
        medications: profile?.medications,
        goals: profile?.goals
      },
      recent_biomarkers: biomarkers?.slice(0, 10),
      recent_analyses: analyses?.slice(0, 5),
      health_trends: {
        avg_sleep: healthMetrics?.reduce((sum, m) => sum + (m.sleep_hours || 0), 0) / (healthMetrics?.length || 1),
        avg_stress: healthMetrics?.reduce((sum, m) => sum + (m.stress_level || 0), 0) / (healthMetrics?.length || 1),
        avg_mood: healthMetrics?.reduce((sum, m) => sum + (m.mood_level || 0), 0) / (healthMetrics?.length || 1),
        avg_exercise: healthMetrics?.reduce((sum, m) => sum + (m.exercise_minutes || 0), 0) / (healthMetrics?.length || 1)
      },
      selected_date: selected_date
    };

    const prompt = `
Ты медицинский ассистент ИИ. На основе данных пользователя рекомендуй медицинские анализы.

Данные пользователя:
${JSON.stringify(contextData, null, 2)}

Проанализируй:
1. Текущие биомаркеры и их тренды
2. Пропущенные или устаревшие анализы
3. Риски на основе образа жизни
4. Возрастные рекомендации
5. Сезонность (выбранная дата: ${selected_date})

Верни JSON в формате:
{
  "recommendations": [
    {
      "name": "Название анализа",
      "type": "blood/urine/other",
      "priority": "high/medium/low",
      "reason": "Причина рекомендации",
      "optimal_timing": "Когда лучше сдать",
      "preparation": "Подготовка к анализу",
      "frequency": "Как часто повторять",
      "cost_estimate": "Примерная стоимость в рублях",
      "biomarkers": ["список биомаркеров"]
    }
  ],
  "urgent_recommendations": [
    {
      "name": "Срочный анализ",
      "reason": "Причина срочности",
      "deadline": "До какой даты"
    }
  ],
  "seasonal_note": "Заметка о сезонных особенностях"
}

Рекомендации должны быть персонализированными и обоснованными.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Ты опытный медицинский консультант, специализирующийся на превентивной медицине и персонализированных рекомендациях по медицинским анализам.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
    });

    console.log('OpenAI request sent, waiting for response...');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Парсим JSON ответ от OpenAI
    let recommendations;
    try {
      recommendations = JSON.parse(aiResponse);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Fallback рекомендации
      recommendations = {
        recommendations: [
          {
            name: "Общий анализ крови",
            type: "blood",
            priority: "medium",
            reason: "Базовая оценка состояния здоровья",
            optimal_timing: "Утром натощак",
            preparation: "12 часов без еды",
            frequency: "Каждые 6 месяцев",
            cost_estimate: "500-800 рублей",
            biomarkers: ["гемоглобин", "эритроциты", "лейкоциты"]
          }
        ],
        urgent_recommendations: [],
        seasonal_note: "В это время года рекомендуется проверить витамин D"
      };
    }

    // Сохраняем рекомендации в базу данных
    const { error: insertError } = await supabase
      .from('ai_recommendations')
      .insert({
        user_id,
        recommendation_type: 'medical_analysis',
        title: 'Рекомендуемые анализы',
        content: JSON.stringify(recommendations),
        source_data: contextData,
        priority: 'medium'
      });

    if (insertError) {
      console.error('Error saving recommendations:', insertError);
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-analysis-recommendations:', error);
    
    // Возвращаем fallback рекомендации при любой ошибке
    const fallbackRecommendations = {
      recommendations: [
        {
          name: "Общий анализ крови",
          type: "blood",
          priority: "medium",
          reason: "Базовая оценка состояния здоровья",
          optimal_timing: "Утром натощак",
          preparation: "12 часов без еды",
          frequency: "Каждые 6 месяцев",
          cost_estimate: "500-800 рублей",
          biomarkers: ["гемоглобин", "эритроциты", "лейкоциты"]
        },
        {
          name: "Биохимический анализ крови",
          type: "blood",
          priority: "medium",
          reason: "Оценка работы внутренних органов",
          optimal_timing: "Утром натощак",
          preparation: "12 часов без еды, исключить алкоголь за 24 часа",
          frequency: "Каждые 6-12 месяцев",
          cost_estimate: "800-1200 рублей",
          biomarkers: ["глюкоза", "холестерин", "билирубин", "АЛТ", "АСТ"]
        }
      ],
      urgent_recommendations: [],
      seasonal_note: "В это время года рекомендуется проверить витамин D и общее состояние иммунитета"
    };
    
    return new Response(JSON.stringify(fallbackRecommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});