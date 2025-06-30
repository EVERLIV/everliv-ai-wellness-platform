
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { foods, preferences = {} } = await req.json()
    
    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      throw new Error('Необходимо указать список продуктов для рецептов')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key не настроен')
    }

    // Создаем промпт для генерации рецептов
    const foodsList = foods.map(food => `${food.name} (${food.portion})`).join(', ')
    
    const prompt = `Создай 3 полезных рецепта на русском языке, используя следующие продукты: ${foodsList}.

Требования:
- Рецепты должны быть здоровыми и питательными
- Каждый рецепт должен включать минимум 2-3 продукта из списка
- Добавь необходимые дополнительные ингредиенты
- Время приготовления: от 15 до 45 минут
- Сложность: легкая или средняя

Верни результат ТОЛЬКО в виде чистого JSON без дополнительного форматирования:
{
  "recipes": [
    {
      "title": "Название рецепта",
      "description": "Краткое описание блюда",
      "ingredients": [
        {
          "name": "Название ингредиента",
          "amount": "Количество",
          "unit": "Единица измерения"
        }
      ],
      "instructions": [
        "Шаг 1 приготовления",
        "Шаг 2 приготовления"
      ],
      "cooking_time": 30,
      "difficulty": "easy",
      "category": "main",
      "nutrition_info": {
        "calories": 350,
        "protein": 25,
        "carbs": 40,
        "fat": 12
      },
      "source_foods": ["продукт1", "продукт2"]
    }
  ]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Ты опытный повар и диетолог. Создавай полезные и вкусные рецепты на основе указанных продуктов. Отвечай ТОЛЬКО в формате JSON без дополнительного текста или форматирования.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`Ошибка OpenAI API: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('Не удалось получить рецепты от OpenAI')
    }

    // Очищаем ответ от markdown форматирования
    let cleanContent = content.trim()
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/, '').replace(/\n?```$/, '')
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/, '').replace(/\n?```$/, '')
    }

    // Парсим JSON ответ
    let recipes
    try {
      const parsedContent = JSON.parse(cleanContent)
      recipes = parsedContent.recipes || []
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError)
      console.error('Содержимое ответа:', cleanContent)
      throw new Error('Ошибка обработки ответа от OpenAI')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipes 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error generating recipes:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
