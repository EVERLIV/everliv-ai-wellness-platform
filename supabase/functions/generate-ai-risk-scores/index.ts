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
      goals: aiProfile.user_goals || []
    } : null;

    console.log('Analysis data summary:', {
      hasProfile: !!analysisData,
      demographics: analysisData?.demographics,
      biomarkersCount: analysisData?.biomarkers.total_count,
      lifestyleTrackingDays: analysisData?.lifestyle_metrics.tracking_period_days,
      nutritionTrackingDays: analysisData?.nutrition.tracking_days_30d
    });

    // Проверяем наличие данных для анализа - даже минимальные данные позволяют провести базовый анализ
    const hasAnyData = analysisData && (
      analysisData.demographics.age || 
      analysisData.demographics.gender ||
      analysisData.medical_profile.health_profile_data ||
      analysisData.biomarkers.total_count > 0 || 
      analysisData.lifestyle_metrics.tracking_period_days > 0 ||
      analysisData.nutrition.tracking_days_30d > 0
    );

    // Если данных совсем нет, генерируем базовые общие риски
    if (!hasAnyData) {
      console.log('No user data found, generating basic risk assessment');
      
      const basicRiskScores = {
        general_health: {
          name: "Общее состояние здоровья",
          percentage: 15,
          level: "Низкий",
          description: "Недостаточно данных для детального анализа. Рекомендуется заполнить профиль здоровья",
          factors: ["Отсутствие данных о здоровье", "Требуется медицинское обследование"],
          period: "текущий",
          mechanism: "Заполните профиль для получения персонализированного анализа рисков"
        },
        lifestyle: {
          name: "Факторы образа жизни",
          percentage: 10,
          level: "Низкий",
          description: "Общие рекомендации по здоровому образу жизни",
          factors: ["Регулярная активность", "Сбалансированное питание", "Качественный сон"],
          period: "постоянно",
          mechanism: "Профилактика основных заболеваний через здоровый образ жизни"
        }
      };

      return new Response(JSON.stringify({ 
        riskScores: basicRiskScores,
        note: "Базовая оценка рисков. Заполните профиль для детального анализа."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not found');
    }

    const prompt = `Вы - экспертная система медицинской диагностики, специализирующаяся на анализе рисков заболеваний. Используйте знания:
- Превентивной медицины и ранней диагностики
- Эпидемиологии и факторов риска
- Клинической биохимии и интерпретации биомаркеров
- Персонализированной медицины

ДАННЫЕ ПАЦИЕНТА:
${JSON.stringify(analysisData, null, 2)}

ЗАДАЧА: Определить 4 наиболее вероятных медицинских риска с учетом:
1. Анализа ВСЕХ биомаркеров и их взаимосвязей
2. Демографических факторов (возраст, пол)
3. Данных об образе жизни и питании
4. Существующих медицинских состояний
5. Семейной истории (если есть данные)

МЕДИЦИНСКИЕ СОСТОЯНИЯ ДЛЯ АНАЛИЗА:

Сердечно-сосудистые:
- Атеросклероз и ИБС (холестерин, воспаление, возраст)
- Гипертония (АД, стресс, ИМТ, Na/K баланс)
- Аритмии (электролиты, щитовидная железа)

Метаболические:
- Сахарный диабет 2 типа (глюкоза, инсулин, гликированный гемоглобин)
- Метаболический синдром (ИМТ, липиды, давление)
- Дислипидемия (холестерин, триглицериды)

Эндокринные:
- Гипотиреоз/гипертиреоз (ТТГ, T3, T4)
- Инсулинорезистентность (HOMA-IR, инсулин)
- Дефицит витамина D (25(OH)D, кальций)

Другие:
- Неалкогольная жировая болезнь печени (АЛТ, АСТ, липиды)
- Остеопороз (витамин D, кальций, возраст, пол)
- Железодефицитная анемия (железо, ферритин, гемоглобин)
- Хроническое воспаление (СРБ, ФНО-альфа)

АЛГОРИТМ АНАЛИЗА:
1. Выявите отклонения в биомаркерах от оптимальных значений
2. Найдите паттерны и взаимосвязи между показателями
3. Учтите возрастно-половые риски и генетическую предрасположенность
4. Оцените влияние образа жизни на развитие заболеваний
5. Рассчитайте вероятность развития на основе доказательной медицины

ГРАДАЦИЯ РИСКОВ (строго следуйте этим диапазонам):
- 0-15%: Очень низкий риск
- 16-30%: Низкий риск  
- 31-50%: Умеренный риск
- 51-75%: Высокий риск
- 76-100%: Критический риск

ПРИНЦИПЫ РАСЧЕТА:
- Используйте доказательную базу исследований
- Учитывайте множественные факторы риска
- Будьте консервативны в оценках
- Указывайте реальные временные рамки

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
            max_tokens: 3000,
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
          
          throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
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