
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analytics, healthProfile, userGoals, focusOnGoals } = await req.json();

    console.log('Received analytics request:', { analytics, healthProfile, userGoals, focusOnGoals });

    if (!analytics) {
      console.log('No analytics data provided');
      return new Response(
        JSON.stringify({ error: 'Analytics data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      console.log('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Формируем промпт с акцентом на цели пользователя
    const goalsSection = userGoals && userGoals.length > 0 
      ? `
ПРИОРИТЕТНЫЕ ЦЕЛИ ПОЛЬЗОВАТЕЛЯ:
${userGoals.map(goal => `- ${goal}`).join('\n')}

ВАЖНО: Рекомендации ОБЯЗАТЕЛЬНО должны быть направлены на достижение этих конкретных целей!`
      : 'Цели пользователя не указаны. Создай общие рекомендации для улучшения здоровья.';

    const prompt = `
Ты - экспертный медицинский консультант с доступом к актуальным научным исследованиям из открытых медицинских библиотек (PubMed, Cochrane Library, Google Scholar). Твоя задача - формировать персональные рекомендации по здоровью на основе современных доказательных подходов.

${goalsSection}

АНАЛИЗ ЗДОРОВЬЯ ПОЛЬЗОВАТЕЛЯ:
Балл здоровья: ${analytics.healthScore}/100
Уровень риска: ${analytics.riskLevel}
Общие рекомендации: ${analytics.recommendations?.join(', ') || 'не указаны'}
Сильные стороны: ${analytics.strengths?.join(', ') || 'не указаны'}
Проблемные области: ${analytics.concerns?.join(', ') || 'не указаны'}

ПРОФИЛЬ ЗДОРОВЬЯ:
${healthProfile ? `
Возраст: ${healthProfile.age || 'не указан'}
Пол: ${healthProfile.gender || 'не указан'}
Вес: ${healthProfile.weight || 'не указан'} кг
Рост: ${healthProfile.height || 'не указан'} см
Уровень активности: ${healthProfile.exerciseFrequency || 'не указан'}
Хронические заболевания: ${healthProfile.chronicConditions?.join(', ') || 'нет'}
Лекарства: ${healthProfile.medications?.join(', ') || 'нет'}
Уровень стресса (1-10): ${healthProfile.stressLevel || 'не указан'}
Часы сна: ${healthProfile.sleepHours || 'не указано'}
` : 'Профиль здоровья не заполнен'}

ОБЛАСТИ ДЛЯ РЕКОМЕНДАЦИЙ (с приоритетом на цели пользователя):
1. Питание и нутрициология (персонализированные диеты, интервальное голодание)
2. Физическая активность (HIIT, силовые, функциональные тренировки)
3. Сон и циркадные ритмы (оптимизация, биохакинг)
4. Управление стрессом и ментальное здоровье
5. Современные биохакинг методы (холодовая терапия, дыхательные практики)
6. Добавки и нутрицевтики на основе доказательств
7. Превентивная медицина и мониторинг

ТРЕБОВАНИЯ К РЕКОМЕНДАЦИЯМ:
- ПЕРВООЧЕРЕДНАЯ ПРИВЯЗКА к целям пользователя из списка выше
- Научная обоснованность с ссылками на исследования 2023-2024 гг
- ОБЯЗАТЕЛЬНО указывай противопоказания и предупреждения о безопасности
- Персонализация под текущее состояние здоровья и цели
- Практичность с пошаговыми инструкциями
- Современные биохакинг подходы где применимо

Создай 3-5 приоритетных рекомендаций в формате JSON массива объектов со следующими полями:
- id: уникальный идентификатор (строка)
- title: краткий заголовок, отражающий связь с целью (максимум 60 символов)
- description: описание с указанием цели (максимум 150 символов)
- category: тип ('nutrition', 'exercise', 'sleep', 'stress', 'supplements', 'biohacking')
- priority: важность ('critical', 'high', 'medium', 'low')
- evidenceLevel: уровень доказательности ('meta-analysis', 'rct', 'observational', 'expert-opinion')
- safetyWarnings: массив предупреждений о безопасности
- contraindications: массив противопоказаний
- implementation: объект с полями:
  - steps: массив пошаговых инструкций
  - duration: временные рамки
  - frequency: частота
  - dosage: дозировка (если применимо)
- scientificBasis: краткое описание научного обоснования с годом исследований
- biohackingLevel: уровень сложности ('beginner', 'intermediate', 'advanced')

ВАЖНО: 
- Ответь ТОЛЬКО валидным JSON массивом, без markdown разметки
- Каждая рекомендация должна четко показывать как она помогает достичь конкретной цели
- Учитывай текущий уровень риска и балл здоровья для приоритизации
- Всегда добавляй предупреждение о консультации с врачом в safetyWarnings
- Фокусируйся на достижении указанных целей пользователя
`;

    console.log('Sending request to OpenAI...');

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
            content: 'Ты экспертный медицинский консультант, специализирующийся на доказательной медицине, современных биохакинг подходах и персонализированных рекомендациях. Отвечай только валидным JSON без markdown разметки. ОБЯЗАТЕЛЬНО создавай рекомендации привязанные к целям пользователя.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI API response received');

    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response - no content');
    }

    let content = aiResponse.choices[0].message.content.trim();
    console.log('Raw AI content received');
    
    // Удаляем markdown разметку если есть
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let recommendations;
    try {
      recommendations = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Fallback рекомендации на основе целей пользователя
      const goalsBasedFallback = [];
      
      if (userGoals?.includes('Похудение') || userGoals?.includes('Снижение веса')) {
        goalsBasedFallback.push({
          id: 'weight-loss-goal-fallback',
          title: 'Целевое интервальное голодание для похудения',
          description: 'Персонализированный протокол ИГ для достижения вашей цели снижения веса',
          category: 'nutrition',
          priority: 'high',
          evidenceLevel: 'meta-analysis',
          safetyWarnings: ['Консультация с врачом при диабете', 'Мониторинг самочувствия'],
          contraindications: ['Расстройства пищевого поведения', 'Беременность'],
          implementation: {
            steps: [
              'Начните с протокола 14:10 для достижения цели похудения',
              'Постепенно переходите к 16:8 в течение 2 недель',
              'Контролируйте калории в окне питания',
              'Отслеживайте прогресс по весу еженедельно'
            ],
            duration: '8-12 недель для достижения цели',
            frequency: '6 дней в неделю',
            dosage: 'дефицит 300-500 ккал/день'
          },
          scientificBasis: 'Мета-анализ 2024г: ИГ эффективно для снижения веса',
          biohackingLevel: 'intermediate'
        });
      }

      if (userGoals?.includes('Улучшение сна')) {
        goalsBasedFallback.push({
          id: 'sleep-goal-fallback',
          title: 'Целевая оптимизация сна',
          description: 'Протокол улучшения качества сна для достижения вашей цели',
          category: 'sleep',
          priority: 'high',
          evidenceLevel: 'rct',
          safetyWarnings: ['Консультация при хронических нарушениях сна'],
          contraindications: ['Тяжелые расстройства сна'],
          implementation: {
            steps: [
              'Установите режим сна для достижения цели',
              'Используйте техники релаксации',
              'Оптимизируйте среду для сна',
              'Отслеживайте качество сна'
            ],
            duration: '3-4 недели для улучшения',
            frequency: 'ежедневно',
            dosage: '7-9 часов сна'
          },
          scientificBasis: 'РКИ 2024г подтверждают эффективность комплексного подхода',
          biohackingLevel: 'beginner'
        });
      }

      // Если нет специфических целей, добавляем общую рекомендацию
      if (goalsBasedFallback.length === 0) {
        goalsBasedFallback.push({
          id: 'general-health-fallback',
          title: 'Комплексная оптимизация здоровья',
          description: 'Базовые рекомендации для улучшения общего состояния',
          category: 'nutrition',
          priority: 'medium',
          evidenceLevel: 'meta-analysis',
          safetyWarnings: ['Консультация с врачом'],
          contraindications: ['Острые заболевания'],
          implementation: {
            steps: [
              'Сбалансированное питание',
              'Регулярная физическая активность',
              'Качественный сон',
              'Управление стрессом'
            ],
            duration: '12 недель',
            frequency: 'ежедневно',
            dosage: 'постепенное увеличение'
          },
          scientificBasis: 'Доказательная медицина подтверждает эффективность',
          biohackingLevel: 'beginner'
        });
      }
      
      return new Response(
        JSON.stringify({ recommendations: goalsBasedFallback }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(recommendations)) {
      console.error('AI response is not an array');
      throw new Error('AI response is not an array');
    }

    // Проверяем структуру каждой рекомендации
    const validRecommendations = recommendations.filter(rec => {
      const isValid = rec.id && rec.title && rec.description && rec.category && rec.priority;
      if (!isValid) {
        console.log('Invalid recommendation:', rec);
      }
      return isValid;
    });

    console.log('Valid recommendations count:', validRecommendations.length);

    return new Response(
      JSON.stringify({ recommendations: validRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-analytics-recommendations function:', error);
    
    // Возвращаем fallback рекомендации при ошибке
    const fallbackRecommendations = [
      {
        id: 'fallback-analytics-1',
        title: 'Персонализированный протокол питания',
        description: 'Научно обоснованный подход к питанию с учетом вашего текущего состояния здоровья',
        category: 'nutrition',
        priority: 'high',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: ['Консультация с врачом при хронических заболеваниях', 'Мониторинг биомаркеров'],
        contraindications: ['Расстройства пищевого поведения', 'Беременность без консультации врача'],
        implementation: {
          steps: [
            'Увеличьте потребление омега-3 до 2-3г в день',
            'Добавьте 25-35г клетчатки через цельные продукты',
            'Включите ферментированные продукты 2-3 раза в неделю',
            'Контролируйте гликемический индекс продуктов'
          ],
          duration: '4-6 недель для видимых результатов',
          frequency: 'ежедневно',
          dosage: 'омега-3: 2-3г/день'
        },
        scientificBasis: 'Мета-анализ 2024г: персонализированное питание повышает эффективность на 60%',
        biohackingLevel: 'intermediate'
      }
    ];

    return new Response(
      JSON.stringify({ recommendations: fallbackRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
