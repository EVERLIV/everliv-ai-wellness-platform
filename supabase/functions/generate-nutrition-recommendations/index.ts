
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

    console.log('Generating nutrition recommendations for:', { profile, goals, currentIntake });

    const prompt = createNutritionRecommendationPrompt(profile, goals, currentIntake);

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
            content: `Вы - эксперт по персонализированному питанию и нутрициологии. 
            Анализируйте данные пользователя и создавайте персональные рекомендации по питанию, анализам и добавкам.
            
            Отвечайте ТОЛЬКО в формате JSON объекта следующей структуры:
            {
              "foods": [
                {
                  "name": "Название продукта",
                  "reason": "Почему рекомендуется",
                  "calories": число_калорий_на_100г,
                  "protein": число_белков_г,
                  "carbs": число_углеводов_г,
                  "fat": число_жиров_г,
                  "portion": "Рекомендуемая порция"
                }
              ],
              "labTests": [
                {
                  "name": "Название анализа",
                  "reason": "Зачем нужен",
                  "frequency": "Как часто сдавать",
                  "priority": "high|medium|low",
                  "preparation": "Подготовка к анализу"
                }
              ],
              "supplements": [
                {
                  "name": "Название добавки",
                  "dosage": "Дозировка",
                  "benefit": "Польза",
                  "timing": "Когда принимать",
                  "interactions": "Взаимодействие с другими веществами"
                }
              ],
              "absorptionHelpers": [
                {
                  "name": "Название витамина/добавки",
                  "function": "Как улучшает усвояемость",
                  "takeWith": "С чем принимать"
                }
              ],
              "lifestyle": [
                {
                  "category": "Категория (сон, стресс, активность)",
                  "advice": "Рекомендация",
                  "goal": "Цель"
                }
              ],
              "mealPlan": [
                {
                  "mealType": "Завтрак|Обед|Ужин|Перекус",
                  "foods": ["список продуктов для этого приема пищи"]
                }
              ]
            }
            
            Учитывайте:
            - Индивидуальные особенности (возраст, пол, медицинские состояния)
            - Текущие цели питания и дефициты
            - Аллергии и противопоказания
            - Российские продукты и доступность анализов`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiResponse = data.choices[0].message.content;
    console.log('AI Response:', aiResponse);

    let recommendations;
    try {
      recommendations = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      recommendations 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-nutrition-recommendations function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createNutritionRecommendationPrompt(profile: any, goals: any, currentIntake: any) {
  return `
Создайте персональные рекомендации по питанию для пользователя на основе следующих данных:

ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ:
- Возраст: ${profile.date_of_birth ? calculateAge(profile.date_of_birth) : 'не указан'}
- Пол: ${profile.gender || 'не указан'}
- Рост: ${profile.height ? profile.height + ' см' : 'не указан'}
- Вес: ${profile.weight ? profile.weight + ' кг' : 'не указан'}
- Медицинские состояния: ${profile.medical_conditions?.join(', ') || 'не указаны'}
- Аллергии: ${profile.allergies?.join(', ') || 'не указаны'}
- Принимаемые препараты: ${profile.medications?.join(', ') || 'не указаны'}
- Цели: ${profile.goals?.join(', ') || 'не указаны'}

ЦЕЛИ ПИТАНИЯ:
- Калории в день: ${goals.daily_calories}
- Белки: ${goals.daily_protein}г
- Углеводы: ${goals.daily_carbs}г
- Жиры: ${goals.daily_fat}г

ТЕКУЩЕЕ ПОТРЕБЛЕНИЕ СЕГОДНЯ:
- Калории: ${currentIntake.calories}
- Белки: ${currentIntake.protein.toFixed(1)}г
- Углеводы: ${currentIntake.carbs.toFixed(1)}г
- Жиры: ${currentIntake.fat.toFixed(1)}г

Проанализируйте данные и предоставьте:
1. 6-8 рекомендуемых продуктов с точными БЖУ
2. 4-6 важных анализов для этого профиля
3. 5-7 персональных витаминов и добавок
4. 3-4 витамина для улучшения усвояемости
5. 4-5 рекомендаций по образу жизни
6. Дневной план питания (4 приема пищи)

Учитывайте российский рынок продуктов и медицинских услуг.
  `;
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
