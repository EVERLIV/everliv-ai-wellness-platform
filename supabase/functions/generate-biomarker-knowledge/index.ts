import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { biomarkerName, category } = await req.json();

    const prompt = `Создай детальную медицинскую информацию о биомаркере "${biomarkerName}" для российской базы знаний. 

Требования:
1. Используй данные Минздрава РФ и российские клинические рекомендации
2. Нормы должны соответствовать российским стандартам
3. Информация должна быть медицински точной и актуальной
4. Формат ответа - JSON со следующей структурой:

{
  "id": "уникальный_id",
  "name": "${biomarkerName}",
  "alternativeNames": ["альтернативные названия"],
  "category": "${category}",
  "normalRanges": {
    "men": "норма для мужчин с единицами",
    "women": "норма для женщин с единицами", 
    "children": "норма для детей с единицами",
    "general": "общая норма если применимо"
  },
  "unit": "единицы измерения",
  "description": "подробное описание что это такое",
  "function": "основная функция в организме",
  "whatItMeasures": "что именно измеряет этот тест",
  "clinicalSignificance": {
    "high": {
      "causes": ["причины повышения"],
      "symptoms": ["симптомы при повышении"],
      "recommendations": ["рекомендации при повышении"]
    },
    "low": {
      "causes": ["причины понижения"],
      "symptoms": ["симптомы при понижении"], 
      "recommendations": ["рекомендации при понижении"]
    }
  },
  "relatedTests": ["связанные анализы"],
  "preparation": ["требования подготовки к анализу"],
  "frequency": "рекомендуемая частота сдачи",
  "riskFactors": ["факторы риска отклонений"],
  "ageGenderFactors": {
    "age": "особенности по возрасту",
    "gender": "особенности по полу",
    "pregnancy": "особенности при беременности если применимо"
  },
  "source": "minzdrav",
  "lastUpdated": "2024-12-01",
  "tags": ["релевантные теги"]
}

Верни ТОЛЬКО JSON без дополнительного текста.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    // Парсим JSON из ответа
    let biomarkerData;
    try {
      biomarkerData = JSON.parse(content);
    } catch (parseError) {
      // Если ответ не JSON, пытаемся извлечь JSON из текста
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        biomarkerData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Не удалось извлечь JSON из ответа ИИ');
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      biomarker: biomarkerData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-biomarker-knowledge function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});