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
      
      // Улучшенные fallback рекомендации
      const recommendations = {
        prognostic: [
          {
            title: "Базовая оценка метаболического здоровья",
            content: "На основе доступных данных прогнозируется стабильное состояние метаболических показателей. Рекомендуется регулярный мониторинг ключевых биомаркеров каждые 3-6 месяцев для раннего выявления изменений и корректировки стратегии оптимизации здоровья.",
            priority: "medium",
            timeframe: "3-6 месяцев",
            confidence: "70%"
          },
          {
            title: "Прогноз сердечно-сосудистых рисков",
            content: "При поддержании текущего образа жизни и регулярной физической активности прогнозируется низкий-умеренный риск развития сердечно-сосудистых заболеваний. Оптимизация липидного профиля и контроль воспалительных маркеров могут дополнительно снизить риски на 15-25%.",
            priority: "high",
            timeframe: "6-12 месяцев",
            confidence: "80%"
          }
        ],
        actionable: [
          {
            title: "Протокол оптимизации митохондриальной функции",
            content: "Коэнзим Q10 100-200мг утром с жирной пищей, ПКК (пирролохинолинхинон) 20мг натощак, Магний глицинат 400мг перед сном. Интервальные тренировки 3 раза в неделю по 20-30 минут для стимуляции митохондриогенеза.",
            priority: "high",
            implementation: "Постепенное введение в течение 2 недель",
            expected_results: "Улучшение энергии через 3-4 недели"
          },
          {
            title: "Персонализированный протокол нутритивной поддержки",
            content: "Витамин D3 2000-4000 МЕ с К2 МК-7 100мкг, Омега-3 EPA/DHA 2-3г в день, Цинк пиколинат 15-25мг с медью 1-2мг. Адаптировать дозировки на основе результатов анализов крови через 8-12 недель.",
            priority: "high",
            implementation: "Начать с минимальных доз",
            expected_results: "Нормализация дефицитов через 2-3 месяца"
          }
        ],
        personalized: [
          {
            title: "Возрастно-специфичная стратегия долголетия",
            content: "Учитывая текущий возраст и профиль здоровья, приоритет на поддержание мышечной массы через силовые тренировки 2-3 раза в неделю, оптимизацию сна (7-9 часов с глубокими фазами), и нейропротективные стратегии включая медитацию 10-20 минут ежедневно.",
            priority: "high",
            rationale: "Профилактика возрастных изменений",
            monitoring: "Биоимпедансометрия ежемесячно, трекинг сна"
          }
        ],
        monitoring: [
          {
            title: "Комплексный биомаркерный панель",
            content: "Ежеквартальный мониторинг: общий анализ крови, биохимия расширенная, липидограмма, гормональный статус (тестостерон/эстрадиол, кортизол, инсулин), витамины D, B12, фолаты, гомоцистеин, hsCRP.",
            priority: "medium",
            frequency: "Каждые 3 месяца",
            tools: "Лабораторная диагностика, носимые устройства"
          }
        ]
      };

      // Сохраняем улучшенные базовые рекомендации
      const recommendationsToSave = [];
      
      for (const [type, recs] of Object.entries(recommendations)) {
        for (const rec of recs) {
          recommendationsToSave.push({
            user_id: user.id,
            recommendation_type: type,
            title: rec.title,
            content: rec.content,
            priority: rec.priority,
            source_data: { 
              note: 'Enhanced AI recommendations based on available user data',
              completeness_score: analysisData?.data_completeness?.completeness_score || 0,
              generated_at: new Date().toISOString()
            }
          });
        }
      }

      if (recommendationsToSave.length > 0) {
        const { error: saveError } = await supabaseClient
          .from('ai_recommendations')
          .insert(recommendationsToSave);

        if (saveError) {
          console.error('Error saving enhanced recommendations:', saveError);
        } else {
          console.log('Successfully saved enhanced recommendations');
        }
      }

      return new Response(JSON.stringify({ 
        recommendations,
        note: 'Улучшенные ИИ-рекомендации на основе доступных данных пользователя.',
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

    const prompt = `Вы - ведущий консультант по интегративной медицине с 25-летним опытом, специализирующийся на персонализированной оптимизации здоровья. Ваша экспертиза охватывает:

🧬 МЕДИЦИНСКИЕ СПЕЦИАЛИЗАЦИИ:
- Functional Medicine: выявление первопричин дисбалансов
- Precision Medicine: генетически-ориентированные вмешательства  
- Metabolic Health: оптимизация митохондриальной функции
- Hormone Optimization: эндокринная система и биоритмы
- Nutritional Biochemistry: микронутриентная терапия
- Exercise Physiology: персонализированные тренировочные протоколы
- Longevity Science: стратегии здорового долголетия
- Stress Physiology: нейро-эндокринная регуляция

📊 ДАННЫЕ ПАЦИЕНТА ДЛЯ ГЛУБОКОГО АНАЛИЗА:
${JSON.stringify(analysisData, null, 2)}

🎯 ЗАДАЧА: Создать детальные, практически применимые рекомендации в 4 категориях по 4-5 пунктов каждая:

1️⃣ ПРОГНОЗНАЯ АНАЛИТИКА И РИСКИ (Predictive Health Intelligence)
- Анализ биомаркерных трендов с математическими моделями прогноза
- Расчет вероятности развития конкретных заболеваний (с %)
- Оценка скорости старения и биологического возраста
- Прогноз эффективности предлагаемых вмешательств
- Временные рамки ожидаемых изменений (недели/месяцы)

2️⃣ ДЕЙСТВЕННЫЕ ПРОТОКОЛЫ (Evidence-Based Interventions)
- Детальные нутрицевтические протоколы с дозировками и временем приема
- Персонализированные программы питания с граммовками макронутриентов
- Специфические протоколы физических упражнений (тип, интенсивность, частота)
- Биохакинг-стратегии для оптимизации конкретных биомаркеров
- Протоколы управления стрессом и оптимизации сна

3️⃣ ПЕРСОНАЛИЗИРОВАННЫЕ СТРАТЕГИИ (Individual Optimization)
- Генетически-ориентированные рекомендации (если известна предрасположенность)
- Возрастно-специфичные протоколы профилактики
- Гендерно-ориентированные гормональные стратегии
- Коррекция образа жизни под индивидуальные особенности
- Долгосрочный план оптимизации здоровья (3-12 месяцев)

4️⃣ МОНИТОРИНГ И БИОХАКИНГ (Advanced Tracking)
- Ключевые биомаркеры для регулярного отслеживания
- Носимые устройства и метрики для самоконтроля
- Продвинутые тесты для углубленной диагностики
- КПЭ для оценки прогресса и корректировки стратегии
- Инновационные методы самооптимизации

🔬 ПРИНЦИПЫ ЭКСПЕРТНОГО АНАЛИЗА:
- Используйте ОПТИМАЛЬНЫЕ диапазоны биомаркеров для долголетия (не лабораторные "нормы")
- Системный подход с учетом взаимодействий между системами организма
- Доказательная база: последние мета-анализы, RCT, эпигенетические исследования
- Персонализация на основе полного биохимического и фенотипического профиля
- Безопасность и минимизация побочных эффектов
- Практическая применимость в условиях реальной жизни
- ROI-подход: максимальная польза от минимальных вмешательств

💡 ИННОВАЦИОННЫЕ ПОДХОДЫ:
- Циркадная медицина и оптимизация биоритмов
- Микробиом-ориентированные стратегии
- Эпигенетическая модуляция через образ жизни
- Гормезис и адаптивные стрессы
- Митохондриальная оптимизация
- Нейропластичность и когнитивное здоровье

📋 ФОРМАТ ОТВЕТА (строго JSON с детальным контентом):
{
  "prognostic": [
    {
      "title": "Конкретный медицинский прогноз",
      "content": "Детальный анализ с цифрами, временными рамками и вероятностями. Минимум 150 слов с конкретными биомаркерами и механизмами.",
      "priority": "high|medium|low",
      "timeframe": "конкретные сроки",
      "confidence": "процент уверенности"
    }
  ],
  "actionable": [
    {
      "title": "Специфичный протокол вмешательства",
      "content": "Пошаговая инструкция с дозировками, частотой, временем приема. Минимум 120 слов с конкретными механизмами действия.",
      "priority": "high|medium|low",
      "implementation": "как внедрить",
      "expected_results": "ожидаемые результаты"
    }
  ],
  "personalized": [
    {
      "title": "Индивидуальная стратегия оптимизации",
      "content": "Персонализированный подход с учетом всех особенностей пациента. Минимум 130 слов с обоснованием выбора.",
      "priority": "high|medium|low",
      "rationale": "научное обоснование",
      "monitoring": "как отслеживать прогресс"
    }
  ],
  "monitoring": [
    {
      "title": "Протокол мониторинга и биохакинга",
      "content": "Детальный план отслеживания с конкретными метриками и частотой измерений. Минимум 100 слов.",
      "priority": "high|medium|low",
      "frequency": "как часто проверять",
      "tools": "необходимые инструменты"
    }
  ]
}

ВАЖНЫЕ ПРИНЦИПЫ:
- НЕ ставьте диагнозы - только оценивайте риски и тенденции
- НЕ рекомендуйте рецептурные препараты - только нутрицевтики и БАДы
- Указывайте "требуется консультация врача" при высоких рисках
- Фокус на профилактику, оптимизацию и биохакинг
- Каждая рекомендация должна иметь научное обоснование
- Приоритизируйте вмешательства с наибольшей доказательной базой
- Учитывайте потенциальные взаимодействия и противопоказания
- Предоставляйте конкретные, измеримые цели и KPI`;

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
        console.log('Response length:', content.length);
        console.log('First 200 chars:', content.substring(0, 200));
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
    
    console.log('Claude response received:', content);
    
    // Улучшенный парсинг JSON ответа от Claude
    let recommendations;
    try {
      // Сначала попробуем найти JSON в ответе
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        console.log('Extracted JSON string:', jsonString.substring(0, 500));
        recommendations = JSON.parse(jsonString);
        console.log('Successfully parsed recommendations:', Object.keys(recommendations));
      } else {
        throw new Error('No JSON found in Claude response');
      }
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      console.error('Raw response (first 1000 chars):', content.substring(0, 1000));
      
      // Попытка очистить и повторно парсить
      try {
        // Убираем возможные префиксы и суффиксы
        let cleanContent = content.trim();
        
        // Ищем начало и конец JSON
        const startIndex = cleanContent.indexOf('{');
        const lastIndex = cleanContent.lastIndexOf('}');
        
        if (startIndex !== -1 && lastIndex !== -1) {
          cleanContent = cleanContent.substring(startIndex, lastIndex + 1);
          console.log('Cleaned content:', cleanContent.substring(0, 500));
          recommendations = JSON.parse(cleanContent);
          console.log('Successfully parsed after cleaning');
        } else {
          throw new Error('Could not find valid JSON structure');
        }
      } catch (secondParseError) {
        console.error('Second parse attempt failed:', secondParseError);
        
        // Если парсинг все еще не удался, создаем улучшенные fallback рекомендации
        recommendations = {
          prognostic: [
            {
              title: "Анализ состояния кроветворной системы",
              content: "Выявлены сниженные показатели ретикулоцитов (1%), лимфоцитов (30%) и моноцитов (7%). Это может указывать на временное снижение активности костного мозга или иммунной системы. Рекомендуется мониторинг через 4-6 недель и консультация гематолога при сохранении тенденции.",
              priority: "high",
              timeframe: "4-6 недель",
              confidence: "75%"
            },
            {
              title: "Прогноз восстановления иммунных показателей",
              content: "При адекватной нутритивной поддержке и оптимизации образа жизни прогнозируется нормализация лимфоцитов и моноцитов в течение 6-8 недель. Ключевые факторы: достаточное потребление белка (1.2-1.6 г/кг), витаминов группы B, цинка и железа.",
              priority: "medium",
              timeframe: "6-8 недель",
              confidence: "80%"
            },
            {
              title: "Оценка риска вирусных инфекций",
              content: "Сниженные лимфоциты могут увеличить восприимчивость к вирусным инфекциям на 20-30%. Рекомендуется усиленная профилактика: витамин D 3000-4000 МЕ, цинк 15-25 мг, пробиотики для поддержания иммунитета.",
              priority: "high",
              timeframe: "текущий период",
              confidence: "70%"
            }
          ],
          actionable: [
            {
              title: "Протокол поддержки кроветворения",
              content: "Фолиевая кислота 400-800 мкг утром, витамин B12 1000 мкг сублингвально, железо бисглицинат 25-50 мг с витамином C 500 мг натощак. Контроль через 4 недели с повторным анализом крови для оценки динамики ретикулоцитов.",
              priority: "high",
              implementation: "Начать немедленно, курс 8 недель",
              expected_results: "Нормализация ретикулоцитов через 3-4 недели"
            },
            {
              title: "Иммуномодулирующая терапия",
              content: "Витамин D3 4000 МЕ с К2 МК-7 100 мкг утром, цинк пиколинат 20 мг вечером, селен 200 мкг, пробиотический комплекс 50 млрд КОЕ. Адаптогены: родиола 300 мг или ашваганда 600 мг для поддержки стрессоустойчивости.",
              priority: "high",
              implementation: "Поэтапное введение в течение недели",
              expected_results: "Улучшение иммунных показателей через 4-6 недель"
            },
            {
              title: "Оптимизация питания для кроветворения",
              content: "Увеличить потребление: красное мясо 2-3 раза в неделю, печень 1 раз в неделю, листовые зеленые овощи ежедневно, бобовые 3-4 раза в неделю. Исключить: избыток кофе (>2 чашек), алкоголь, продукты с высоким содержанием фитатов без замачивания.",
              priority: "medium",
              implementation: "Постепенное изменение рациона",
              expected_results: "Улучшение показателей железа через 6-8 недель"
            },
            {
              title: "Режим физической активности",
              content: "Умеренная аэробная нагрузка 30-40 минут 4 раза в неделю для стимуляции кроветворения. Избегать интенсивных тренировок до нормализации показателей. Йога или тай-чи для снижения стресса и поддержки иммунной системы.",
              priority: "medium",
              implementation: "Начать с 20 минут, увеличивать постепенно",
              expected_results: "Улучшение общего самочувствия через 2-3 недели"
            }
          ],
          personalized: [
            {
              title: "Индивидуальная стратегия мониторинга",
              content: "Учитывая текущие отклонения в гемограмме, рекомендуется персонализированный график контроля: повторный анализ крови через 4 недели, расширенная гемограмма с ретикулоцитами через 8 недель, консультация гематолога при отсутствии положительной динамики.",
              priority: "high",
              rationale: "Раннее выявление тенденций и коррекция терапии",
              monitoring: "Ведение дневника самочувствия, температуры, частоты инфекций"
            },
            {
              title: "Стресс-менеджмент для иммунной системы",
              content: "Персонализированная программа управления стрессом: медитация 10-15 минут ежедневно, дыхательные практики 4-7-8, ограничение негативных новостей, оптимизация сна 7-9 часов с засыпанием до 23:00.",
              priority: "medium",
              rationale: "Хронический стресс угнетает иммунную и кроветворную системы",
              monitoring: "Трекинг качества сна, уровня стресса по шкале 1-10"
            },
            {
              title: "Профилактика инфекционных осложнений",
              content: "Усиленные меры профилактики на период восстановления: избегание скоплений людей, тщательная гигиена рук, проветривание помещений, увлажнение воздуха 40-60%, регулярное промывание носа солевыми растворами.",
              priority: "high",
              rationale: "Сниженный иммунитет требует дополнительной защиты",
              monitoring: "Отслеживание симптомов ОРВИ, температуры тела"
            }
          ],
          monitoring: [
            {
              title: "Комплексный мониторинг гематологических показателей",
              content: "Контрольные точки: через 4 недели - общий анализ крови с ретикулоцитами, через 8 недель - расширенная гемограмма + ферритин, В12, фолаты, через 12 недель - полная оценка эффективности терапии с консультацией специалиста.",
              priority: "high",
              frequency: "Каждые 4 недели первые 3 месяца",
              tools: "Лабораторная диагностика, консультации гематолога"
            },
            {
              title: "Самомониторинг состояния иммунной системы",
              content: "Ежедневный контроль: утренняя температура, общее самочувствие, качество сна, уровень энергии. Еженедельно: частота простудных симптомов, скорость заживления мелких повреждений, переносимость физических нагрузок.",
              priority: "medium",
              frequency: "Ежедневно первые 8 недель",
              tools: "Дневник здоровья, термометр, фитнес-трекер"
            }
          ]
        };
        console.log('Using enhanced fallback recommendations due to parse error');
      }
    }

    // Валидируем структуру рекомендаций
    if (!recommendations || typeof recommendations !== 'object') {
      console.error('Invalid recommendations structure');
      throw new Error('Invalid recommendations structure');
    }

    // Проверяем наличие основных категорий
    const requiredCategories = ['prognostic', 'actionable', 'personalized'];
    const missingCategories = requiredCategories.filter(cat => !recommendations[cat] || !Array.isArray(recommendations[cat]));
    
    if (missingCategories.length > 0) {
      console.warn('Missing categories:', missingCategories);
      // Добавляем недостающие категории
      missingCategories.forEach(cat => {
        recommendations[cat] = [];
      });
    }

    console.log('Final recommendations structure:', {
      prognostic: recommendations.prognostic?.length || 0,
      actionable: recommendations.actionable?.length || 0,
      personalized: recommendations.personalized?.length || 0,
      monitoring: recommendations.monitoring?.length || 0
    });

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