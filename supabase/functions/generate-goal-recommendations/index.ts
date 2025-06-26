
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  exerciseFrequency?: string;
  chronicConditions?: string[];
  medications?: string[];
  stressLevel?: number;
  sleepHours?: number;
}

const translateGoal = (goal: string): string => {
  const translations: Record<string, string> = {
    'cognitive': 'улучшение когнитивных функций',
    'cardiovascular': 'здоровье сердечно-сосудистой системы',
    'weight_loss': 'снижение веса',
    'muscle_gain': 'набор мышечной массы',
    'energy_boost': 'повышение энергии',
    'sleep_improvement': 'улучшение сна',
    'stress_reduction': 'снижение стресса',
    'immunity_boost': 'укрепление иммунитета',
    'longevity': 'увеличение продолжительности жизни',
    'hormonal_balance': 'гормональный баланс',
    'digestive_health': 'здоровье пищеварения',
    'skin_health': 'здоровье кожи'
  };
  return translations[goal] || goal;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { healthGoals, userProfile }: { healthGoals: string[], userProfile: UserProfile } = await req.json();

    console.log('Received request:', { healthGoals, userProfile });

    if (!healthGoals || healthGoals.length === 0) {
      console.log('No health goals provided');
      return new Response(
        JSON.stringify({ error: 'Health goals are required' }),
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

    const translatedGoals = healthGoals.map(translateGoal);
    const profileContext = `
Возраст: ${userProfile.age || 'не указан'}
Пол: ${userProfile.gender || 'не указан'}
Вес: ${userProfile.weight || 'не указан'} кг
Рост: ${userProfile.height || 'не указан'} см
Уровень активности: ${userProfile.exerciseFrequency || 'не указан'}
Хронические заболевания: ${userProfile.chronicConditions?.join(', ') || 'нет'}
Лекарства: ${userProfile.medications?.join(', ') || 'нет'}
Уровень стресса (1-10): ${userProfile.stressLevel || 'не указан'}
Часы сна: ${userProfile.sleepHours || 'не указано'}
`;

    const prompt = `
Ты - экспертный медицинский консультант с доступом к актуальным научным исследованиям из открытых медицинских библиотек (PubMed, Cochrane Library, Google Scholar). Твоя задача - формировать персональные рекомендации по здоровью на основе современных доказательных подходов.

ЦЕЛИ ПОЛЬЗОВАТЕЛЯ:
${translatedGoals.join(', ')}

ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ:
${profileContext}

ОБЛАСТИ ДЛЯ РЕКОМЕНДАЦИЙ:
1. Питание и нутрициология (макро/микронутриенты, функциональное питание)
2. Современные подходы (интервальное голодание, кето, средиземноморская диета)
3. Криотерапия и температурные воздействия
4. Физическая активность (HIIT, силовые, кардио)
5. Сон и циркадные ритмы
6. Управление стрессом и ментальное здоровье

ТРЕБОВАНИЯ К РЕКОМЕНДАЦИЯМ:
- Научная обоснованность с ссылками на исследования
- ОБЯЗАТЕЛЬНО указывай противопоказания
- Персонализация под цели и ограничения
- Практичность с пошаговыми инструкциями
- Безопасность превыше всего

Создай 2-3 приоритетные рекомендации в формате JSON массива объектов со следующими полями:
- id: уникальный идентификатор (строка)
- title: краткий заголовок (максимум 50 символов)
- description: описание (максимум 120 символов)
- timeframe: временные рамки (например, "2-4 недели")
- category: тип ('exercise', 'nutrition', 'sleep', 'stress', 'supplements')
- priority: важность ('high', 'medium', 'low')
- scientificBasis: краткое описание научного обоснования с годом исследований
- specificActions: массив конкретных действий (3-5 пунктов)

ВАЖНО: 
- Ответь ТОЛЬКО валидным JSON массивом, без markdown разметки
- Учитывай возраст, пол и хронические заболевания для безопасности
- Включай современные биохакинг подходы где применимо
- Всегда добавляй предупреждение о консультации с врачом в scientificBasis
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
            content: 'Ты экспертный медицинский консультант, специализирующийся на доказательной медицине и персонализированных рекомендациях. Отвечай только валидным JSON без markdown разметки.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI API response received:', aiResponse);

    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response - no content');
    }

    let content = aiResponse.choices[0].message.content.trim();
    console.log('Raw AI content:', content);
    
    // Удаляем markdown разметку если есть
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    console.log('Cleaned content:', content);

    let recommendations;
    try {
      recommendations = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    console.log('Parsed recommendations:', recommendations);

    if (!Array.isArray(recommendations)) {
      console.error('AI response is not an array:', recommendations);
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
    console.error('Error in generate-goal-recommendations function:', error);
    
    // Возвращаем fallback рекомендации при ошибке
    const fallbackRecommendations = [
      {
        id: 'fallback-1',
        title: 'Интервальное голодание 16:8',
        description: 'Современный подход к питанию для улучшения метаболизма и снижения веса',
        timeframe: '2-4 недели адаптации',
        category: 'nutrition',
        priority: 'high',
        scientificBasis: 'Исследования 2023г показывают эффективность ИГ для метаболизма. Консультация врача обязательна',
        specificActions: [
          'Окно питания: 12:00-20:00, голодание: 20:00-12:00',
          'Начните с 14:10, постепенно переходя к 16:8',
          'Пейте воду, чай, кофе без сахара в период голодания',
          'Контролируйте самочувствие, при недомогании - прекратите'
        ]
      },
      {
        id: 'fallback-2',
        title: 'Холодовая терапия',
        description: 'Контрастный душ для активации метаболизма и укрепления иммунитета',
        timeframe: '1-2 недели',
        category: 'stress',
        priority: 'medium',
        scientificBasis: 'Исследования 2024г: холод активирует бурый жир, повышает метаболизм на 15%. Противопоказан при ССЗ',
        specificActions: [
          'Начните с 30 сек холодной воды в конце душа',
          'Постепенно увеличивайте до 2-3 минут',
          'Температура 10-15°C, дышите глубоко и спокойно',
          'При проблемах с сердцем - консультация кардиолога'
        ]
      }
    ];

    return new Response(
      JSON.stringify({ recommendations: fallbackRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
