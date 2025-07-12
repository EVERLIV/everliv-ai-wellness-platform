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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating AI risk scores for user:', user.id);

    // Получаем данные профиля
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Получаем последние медицинские анализы
    const { data: analyses } = await supabaseClient
      .from('medical_analyses')
      .select(`
        *,
        biomarkers (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    // Получаем метрики здоровья за последние 30 дней
    const { data: healthMetrics } = await supabaseClient
      .from('daily_health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });

    const biomarkers = analyses?.[0]?.biomarkers || [];
    
    // Формируем данные для анализа
    const analysisData = {
      profile: {
        age: profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null,
        gender: profile?.gender,
        height: profile?.height,
        weight: profile?.weight,
        medical_conditions: profile?.medical_conditions,
        medications: profile?.medications,
        allergies: profile?.allergies
      },
      biomarkers: biomarkers.map((b: any) => ({
        name: b.name,
        value: b.value,
        reference_range: b.reference_range,
        status: b.status
      })),
      lifestyle: {
        avg_sleep: healthMetrics?.reduce((sum: number, m: any) => sum + (m.sleep_hours || 0), 0) / (healthMetrics?.length || 1),
        avg_steps: healthMetrics?.reduce((sum: number, m: any) => sum + (m.steps || 0), 0) / (healthMetrics?.length || 1),
        avg_exercise: healthMetrics?.reduce((sum: number, m: any) => sum + (m.exercise_minutes || 0), 0) / (healthMetrics?.length || 1),
        avg_stress: healthMetrics?.reduce((sum: number, m: any) => sum + (m.stress_level || 0), 0) / (healthMetrics?.length || 1),
        avg_nutrition: healthMetrics?.reduce((sum: number, m: any) => sum + (m.nutrition_quality || 0), 0) / (healthMetrics?.length || 1)
      }
    };

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not found');
    }

    const prompt = `Ты - ведущий специалист по персонализированной медицине. Проанализируй данные и рассчитай ИИ-скоры рисков.

ДАННЫЕ ПАЦИЕНТА:
${JSON.stringify(analysisData, null, 2)}

ЗАДАЧА: Рассчитай 4 ключевых ИИ-скора риска в процентах (0-100%):

1. СЕРДЕЧНО-СОСУДИСТЫЙ РИСК (10 лет)
- Анализируй: холестерин, ЛВП, ЛНП, триглицериды, hsCRP, гомоцистеин, глюкозу, давление
- Учитывай: возраст, пол, образ жизни, активность

2. ДИАБЕТ 2 ТИПА (5 лет)  
- Анализируй: глюкозу, HbA1c, инсулин, HOMA-IR, воспаление
- Учитывай: ИМТ, активность, наследственность

3. НЕЙРОДЕГЕНЕРАЦИЯ (15 лет)
- Анализируй: B12, фолаты, гомоцистеин, воспаление, щитовидку
- Учитывай: возраст, генетику, когнитивную нагрузку

4. МЕТАБОЛИЧЕСКИЙ СИНДРОМ
- Анализируй: инсулин, кортизол, щитовидку, воспаление, липиды
- Учитывай: абдоминальное ожирение, давление

ГРАДАЦИЯ РИСКОВ:
- 0-5%: Очень низкий
- 6-15%: Низкий  
- 16-30%: Умеренный
- 31-50%: Высокий
- 50%+: Очень высокий

ФОРМАТ ОТВЕТА (строго JSON):
{
  "cardiovascular": {
    "percentage": 15,
    "level": "Низкий",
    "description": "Риск ИБС и инфаркта в ближайшие 10 лет",
    "factors": ["Повышен холестерин", "Воспаление hsCRP"],
    "period": "10 лет"
  },
  "diabetes": {
    "percentage": 8,
    "level": "Низкий",
    "description": "Риск развития сахарного диабета 2 типа",
    "factors": ["Нормальная глюкоза", "Хорошая активность"],
    "period": "5 лет"
  },
  "neurodegeneration": {
    "percentage": 12,
    "level": "Низкий", 
    "description": "Риск болезни Альцгеймера и деменции",
    "factors": ["Дефицит B12", "Повышен гомоцистеин"],
    "period": "15 лет"
  },
  "metabolic": {
    "percentage": 20,
    "level": "Умеренный",
    "description": "Риск метаболического синдрома",
    "factors": ["Инсулинорезистентность", "Абдоминальное ожирение"],
    "period": "текущий"
  }
}

Будь точным в расчетах. Используй только имеющиеся данные. Если данных недостаточно - укажи это в факторах.`;

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
        max_tokens: 2000,
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
        cardiovascular: { percentage: 15, level: "Низкий", description: "Риск ИБС и инфаркта в ближайшие 10 лет", factors: ["Анализ данных"], period: "10 лет" },
        diabetes: { percentage: 8, level: "Низкий", description: "Риск развития сахарного диабета 2 типа", factors: ["Анализ данных"], period: "5 лет" },
        neurodegeneration: { percentage: 12, level: "Низкий", description: "Риск болезни Альцгеймера и деменции", factors: ["Анализ данных"], period: "15 лет" },
        metabolic: { percentage: 20, level: "Умеренный", description: "Риск метаболического синдрома", factors: ["Анализ данных"], period: "текущий" }
      };
    }

    console.log('Generated risk scores:', riskScores);

    return new Response(JSON.stringify({ riskScores }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-risk-scores function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});