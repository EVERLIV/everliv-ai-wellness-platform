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
    const { profile, goals, currentIntake } = await req.json();

    console.log('Generating nutrition recommendations for:', {
      hasProfile: !!profile,
      hasGoals: !!goals,
      currentIntake
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Создаем детальный промпт для анализа
    const systemPrompt = `Ты — ИИ-ассистент по здоровью и нутрициологии. Анализируй данные пользователя и предоставляй персонализированные, научно обоснованные рекомендации.

ВАЖНО: Все рекомендации должны быть безопасными и основанными на современных научных данных. При любых критических отклонениях рекомендуй обратиться к врачу.

Верни ответ строго в формате JSON:
{
  "foods": [
    {
      "name": "Название продукта",
      "reason": "Причина рекомендации",
      "calories": 150,
      "protein": 20,
      "carbs": 15,
      "fat": 5,
      "portion": "100г"
    }
  ],
  "labTests": [
    {
      "name": "Название анализа",
      "reason": "Причина назначения",
      "frequency": "раз в 3 месяца",
      "priority": "high|medium|low",
      "preparation": "Особенности подготовки"
    }
  ],
  "supplements": [
    {
      "name": "Название добавки",
      "dosage": "Дозировка",
      "benefit": "Польза",
      "timing": "Время приема",
      "interactions": "Взаимодействия"
    }
  ],
  "absorptionHelpers": [
    {
      "name": "Название помощника усвоения",
      "function": "Функция",
      "takeWith": "С чем принимать"
    }
  ],
  "lifestyle": [
    {
      "category": "Категория",
      "advice": "Совет",
      "goal": "Цель"
    }
  ],
  "mealPlan": [
    {
      "mealType": "Завтрак",
      "foods": ["Продукт 1", "Продукт 2"]
    }
  ]
}`;

    const userPrompt = `Проанализируй данные пользователя и создай персонализированные рекомендации:

ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ:
- Возраст: ${profile.age || 'не указан'}
- Пол: ${profile.gender || 'не указан'}
- Рост: ${profile.height || 'не указан'} см
- Вес: ${profile.weight || 'не указан'} кг
- Хронические заболевания: ${profile.medical_conditions?.join(', ') || 'нет'}
- Аллергии: ${profile.allergies?.join(', ') || 'нет'}
- Лекарства: ${profile.medications?.join(', ') || 'нет'}
- Цели: ${profile.goals?.join(', ') || 'не указаны'}

ЦЕЛИ ПИТАНИЯ:
${goals ? `
- Калории: ${goals.daily_calories} ккал/день
- Белки: ${goals.daily_protein} г/день
- Углеводы: ${goals.daily_carbs} г/день
- Жиры: ${goals.daily_fat} г/день
` : 'Не установлены'}

ТЕКУЩЕЕ ПОТРЕБЛЕНИЕ:
- Калории: ${currentIntake.calories} ккал
- Белки: ${currentIntake.protein} г
- Углеводы: ${currentIntake.carbs} г
- Жиры: ${currentIntake.fat} г

Создай персонализированные рекомендации, учитывая:
1. Недостающие нутриенты
2. Возрастные особенности
3. Противопоказания
4. Цели пользователя

Включи 3-5 продуктов, 2-3 анализа, 2-3 добавки (при необходимости), советы по образу жизни и план питания на день.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    let recommendations;
    try {
      recommendations = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.log('Raw content:', data.choices[0].message.content);
      
      // Fallback recommendations
      recommendations = {
        foods: [
          {
            name: "Авокадо",
            reason: "Богат полезными жирами и витаминами",
            calories: 160,
            protein: 2,
            carbs: 9,
            fat: 15,
            portion: "100г"
          }
        ],
        labTests: [
          {
            name: "Общий анализ крови",
            reason: "Контроль общего состояния здоровья",
            frequency: "раз в 6 месяцев",
            priority: "medium",
            preparation: "Натощак"
          }
        ],
        supplements: [],
        absorptionHelpers: [],
        lifestyle: [
          {
            category: "Физическая активность",
            advice: "Добавьте 30 минут умеренных упражнений в день",
            goal: "Улучшение общего самочувствия"
          }
        ],
        mealPlan: [
          {
            mealType: "Завтрак",
            foods: ["Овсянка", "Ягоды", "Орехи"]
          }
        ]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        recommendations
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-nutrition-recommendations:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});