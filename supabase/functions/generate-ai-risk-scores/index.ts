import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RiskScore {
  name: string;
  percentage: number;
  level: string;
  description: string;
  factors: string[];
  period: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting generate-ai-risk-scores function');
    
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

    console.log('Generating AI risk scores for user:', user.id);

    // Получаем данные профиля
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    console.log('Profile data:', profile, 'Profile error:', profileError);

    // Получаем последние медицинские анализы
    const { data: analyses, error: analysesError } = await supabaseClient
      .from('medical_analyses')
      .select(`
        *,
        biomarkers (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    console.log('Analyses data:', analyses, 'Analyses error:', analysesError);

    // Получаем метрики здоровья за последние 30 дней
    const { data: healthMetrics, error: metricsError } = await supabaseClient
      .from('daily_health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    console.log('Health metrics data:', healthMetrics, 'Metrics error:', metricsError);

    const biomarkers = analyses?.[0]?.biomarkers || [];
    console.log('Biomarkers found:', biomarkers.length);
    
    // Формируем данные для анализа
    const analysisData = {
      profile: {
        age: profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null,
        gender: profile?.gender,
        height: profile?.height,
        weight: profile?.weight,
        medical_conditions: profile?.medical_conditions || [],
        medications: profile?.medications || [],
        allergies: profile?.allergies || []
      },
      biomarkers: biomarkers.map((b: any) => ({
        name: b.name,
        value: b.value,
        reference_range: b.reference_range,
        status: b.status
      })),
      lifestyle: {
        avg_sleep: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.sleep_hours || 0), 0) / healthMetrics.length : 0,
        avg_steps: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.steps || 0), 0) / healthMetrics.length : 0,
        avg_exercise: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.exercise_minutes || 0), 0) / healthMetrics.length : 0,
        avg_stress: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.stress_level || 0), 0) / healthMetrics.length : 0,
        avg_nutrition: healthMetrics?.length ? healthMetrics.reduce((sum: number, m: any) => sum + (m.nutrition_quality || 0), 0) / healthMetrics.length : 0
      }
    };

    console.log('Analysis data prepared:', JSON.stringify(analysisData, null, 2));

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not found');
    }

    const prompt = `Ты - ведущий специалист по персонализированной медицине с доступом к базе данных миллионов медицинских записей. Проанализируй данные пациента и определи ТОП-4 наиболее вероятных заболевания/состояния для ЭТОГО КОНКРЕТНОГО пациента.

ДАННЫЕ ПАЦИЕНТА:
${JSON.stringify(analysisData, null, 2)}

ЗАДАЧА: 
1. Проанализируй ВСЕ данные: биомаркеры, возраст, пол, образ жизни, медицинские состояния
2. Определи КОНКРЕТНЫЕ заболевания/состояния с наибольшим риском для ЭТОГО пациента
3. НЕ используй общие категории - найди специфичные диагнозы
4. Рассчитай персональный риск в процентах и временной период

ПРИМЕРЫ возможных находок:
- Ишемическая болезнь сердца (на основе липидов + воспаления)
- Гипотиреоз (на основе ТТГ, T4, симптомов)
- Дефицит B12 с нейропатией (на основе B12, гомоцистеин, симптомы)
- Инсулинорезистентность (на основе глюкозы, инсулина, ИМТ)
- Хроническое воспаление (на основе hsCRP, интерлейкинов)
- НАЖБП (на основе АЛТ, АСТ, липидов, ИМТ)
- Остеопороз (на основе витамина D, кальция, возраста)
- Синдром поликистозных яичников (для женщин, на основе гормонов)
- Железодефицитная анемия (на основе железа, ферритина, гемоглобина)
- Метаболический синдром (комплекс показателей)

АНАЛИЗИРУЙ как эксперт:
- Какие биомаркеры указывают на конкретные патологии?
- Какие комбинации показателей создают синергетический риск?
- Какие возрастно-половые факторы усиливают риски?
- Какой образ жизни ускоряет развитие заболеваний?

ГРАДАЦИЯ РИСКОВ:
- 0-10%: Очень низкий риск
- 11-25%: Низкий риск  
- 26-45%: Умеренный риск
- 46-70%: Высокий риск
- 71%+: Очень высокий риск

ФОРМАТ ОТВЕТА (строго JSON с 4 наиболее вероятными заболеваниями):
{
  "disease1": {
    "name": "Конкретное название заболевания",
    "percentage": 35,
    "level": "Умеренный",
    "description": "Краткое описание заболевания и его последствий",
    "factors": ["Конкретный биомаркер вне нормы", "Специфичный фактор риска"],
    "period": "срок развития (например: 2-5 лет, 6 месяцев, текущий)",
    "mechanism": "Краткое объяснение механизма развития"
  },
  "disease2": {
    "name": "Второе заболевание",
    "percentage": 28,
    "level": "Умеренный",
    "description": "Описание второго заболевания",
    "factors": ["Факторы для второго заболевания"],
    "period": "период развития",
    "mechanism": "механизм развития"
  },
  "disease3": {
    "name": "Третье заболевание",
    "percentage": 22,
    "level": "Низкий",
    "description": "Описание третьего заболевания",
    "factors": ["Факторы риска"],
    "period": "период",
    "mechanism": "механизм"
  },
  "disease4": {
    "name": "Четвертое заболевание",
    "percentage": 18,
    "level": "Низкий", 
    "description": "Описание четвертого заболевания",
    "factors": ["Факторы"],
    "period": "период",
    "mechanism": "механизм"
  }
}

ВАЖНО: 
- Анализируй как настоящий врач с 20-летним опытом
- Учитывай взаимосвязи между показателями
- Будь точным в диагностике - не придумывай данных
- Если данных мало, укажи это и дай общие риски
- Фокусируйся на ACTIONABLE находках`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicKey}`,
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const anthropicData = await response.json();
    const content = anthropicData.content[0].text;
    
    console.log('Claude response:', content);
    
    // Парсим JSON ответ от Claude
    let riskScores;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        riskScores = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in Claude response');
      }
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      // Fallback данные
      riskScores = {
        disease1: { 
          name: "Анализ данных", 
          percentage: 15, 
          level: "Низкий", 
          description: "Требуется дополнительный анализ данных", 
          factors: ["Недостаточно данных для точного анализа"], 
          period: "текущий",
          mechanism: "Анализ будет улучшен с накоплением данных"
        },
        disease2: { 
          name: "Общий профилактический скрининг", 
          percentage: 10, 
          level: "Очень низкий", 
          description: "Профилактическое наблюдение", 
          factors: ["Регулярные обследования"], 
          period: "постоянно",
          mechanism: "Раннее выявление изменений"
        },
        disease3: { 
          name: "Возрастные изменения", 
          percentage: 8, 
          level: "Очень низкий", 
          description: "Естественные возрастные процессы", 
          factors: ["Возрастные факторы"], 
          period: "долгосрочно",
          mechanism: "Замедление процессов старения"
        },
        disease4: { 
          name: "Образ жизни", 
          percentage: 5, 
          level: "Очень низкий", 
          description: "Влияние образа жизни на здоровье", 
          factors: ["Диета и активность"], 
          period: "постоянно",
          mechanism: "Оптимизация здорового образа жизни"
        }
      };
    }

    console.log('Generated risk scores:', riskScores);

    // Проверяем, есть ли значимые риски (больше 10%)
    const significantRisks = Object.values(riskScores).filter((risk: any) => risk.percentage > 10);
    
    if (significantRisks.length === 0) {
      // Если нет значимых рисков, возвращаем позитивное сообщение
      return new Response(JSON.stringify({ 
        riskScores: {
          noRisks: {
            name: "Рисков не выявлено",
            percentage: 0,
            level: "Отлично",
            description: "Вы в отличной форме! Ваши показатели в норме",
            factors: ["Хорошие биомаркеры", "Здоровый образ жизни"],
            period: "текущий",
            mechanism: "Продолжайте поддерживать здоровый образ жизни"
          }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ riskScores }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-risk-scores function:', error);
    
    // Возвращаем структурированную ошибку
    return new Response(JSON.stringify({ 
      error: error.message,
      riskScores: {
        error: {
          name: "Ошибка анализа",
          percentage: 0,
          level: "Неизвестно",
          description: "Не удалось проанализировать данные",
          factors: ["Ошибка системы"],
          period: "неопределен",
          mechanism: "Попробуйте позже"
        }
      }
    }), {
      status: 200, // Возвращаем 200 даже при ошибке, чтобы не ломать UI
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});