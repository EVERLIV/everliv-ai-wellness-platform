
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
  activityLevel?: string;
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

    if (!healthGoals || healthGoals.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Health goals are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const translatedGoals = healthGoals.map(translateGoal);
    const profileContext = `
Возраст: ${userProfile.age || 'не указан'}
Пол: ${userProfile.gender || 'не указан'}
Вес: ${userProfile.weight || 'не указан'} кг
Рост: ${userProfile.height || 'не указан'} см
Уровень активности: ${userProfile.activityLevel || 'не указан'}
Хронические заболевания: ${userProfile.chronicConditions?.join(', ') || 'нет'}
Лекарства: ${userProfile.medications?.join(', ') || 'нет'}
Уровень стресса (1-10): ${userProfile.stressLevel || 'не указан'}
Часы сна: ${userProfile.sleepHours || 'не указано'}
`;

    const prompt = `
Ты - эксперт по медицине и здоровью с глубокими знаниями современных исследований. 
Создай 2-3 персонализированные медицинские рекомендации на основе целей пользователя и его профиля.

ЦЕЛИ ПОЛЬЗОВАТЕЛЯ:
${translatedGoals.join(', ')}

ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ:
${profileContext}

ТРЕБОВАНИЯ:
1. Рекомендации должны быть основаны на современных научных исследованиях
2. Учитывай профиль пользователя (возраст, пол, состояние здоровья)
3. Каждая рекомендация должна быть конкретной и выполнимой
4. Укажи временные рамки и ожидаемые результаты
5. Используй доказательную медицину

Ответь в формате JSON массива объектов со следующими полями:
- id: уникальный идентификатор
- title: краткий заголовок (максимум 50 символов)
- description: описание (максимум 100 символов)
- timeframe: временные рамки (например, "2-4 недели")
- category: тип ('exercise', 'nutrition', 'sleep', 'stress', 'supplements')
- priority: важность ('high', 'medium', 'low')
- scientificBasis: краткое описание научного обоснования
- specificActions: массив конкретных действий (3-5 пунктов)

ВАЖНО: Ответь ТОЛЬКО валидным JSON массивом, без дополнительного текста.
`;

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
            content: 'Ты медицинский эксперт, специализирующийся на доказательной медицине и персонализированных рекомендациях. Отвечай только валидным JSON.'
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
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response:', aiResponse);

    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response');
    }

    const recommendations = JSON.parse(aiResponse.choices[0].message.content);
    console.log('Generated recommendations:', recommendations);

    if (!Array.isArray(recommendations)) {
      throw new Error('AI response is not an array');
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-goal-recommendations function:', error);
    
    // Возвращаем fallback рекомендации в случае ошибки
    const fallbackRecommendations = [
      {
        id: 'fallback-1',
        title: 'Увеличить физическую активность',
        description: 'Добавьте 30 минут умеренной активности 5 раз в неделю',
        timeframe: '2-4 недели',
        category: 'exercise',
        priority: 'high',
        scientificBasis: 'ВОЗ рекомендует минимум 150 минут умеренной активности в неделю',
        specificActions: [
          'Ходьба быстрым шагом 30 минут',
          'Плавание 2-3 раза в неделю',
          'Силовые упражнения 2 раза в неделю'
        ]
      },
      {
        id: 'fallback-2',
        title: 'Оптимизировать питание',
        description: 'Сбалансированное питание с акцентом на цельные продукты',
        timeframe: '1-2 недели',
        category: 'nutrition',
        priority: 'medium',
        scientificBasis: 'Средиземноморская диета снижает риск сердечно-сосудистых заболеваний',
        specificActions: [
          'Увеличить потребление овощей и фруктов',
          'Включить омега-3 жирные кислоты',
          'Ограничить обработанные продукты'
        ]
      }
    ];

    return new Response(
      JSON.stringify({ recommendations: fallbackRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
