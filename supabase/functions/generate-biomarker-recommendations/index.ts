import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BiomarkerRequest {
  name: string;
  value: number;
  unit: string;
  normalRange: {
    min: number;
    max: number;
    optimal?: number;
  };
  status: string;
  userAge?: number;
  userGender?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const biomarkerData: BiomarkerRequest = await req.json();
    
    console.log('Generating recommendations for biomarker:', biomarkerData.name);

    const prompt = `Ты эксперт по биохакингу и превентивной медицине. Проанализируй биомаркер и дай конкретные рекомендации.

ДАННЫЕ БИОМАРКЕРА:
- Название: ${biomarkerData.name}
- Текущее значение: ${biomarkerData.value} ${biomarkerData.unit}
- Нормальный диапазон: ${biomarkerData.normalRange.min} - ${biomarkerData.normalRange.max} ${biomarkerData.unit}
${biomarkerData.normalRange.optimal ? `- Оптимальное значение: ${biomarkerData.normalRange.optimal} ${biomarkerData.unit}` : ''}
- Статус: ${biomarkerData.status}
${biomarkerData.userAge ? `- Возраст пациента: ${biomarkerData.userAge} лет` : ''}
${biomarkerData.userGender ? `- Пол: ${biomarkerData.userGender}` : ''}

ЗАДАЧА: Дай краткие конкретные рекомендации (максимум 200 символов) по улучшению этого показателя:

ФОРМАТ ОТВЕТА - СТРОГО одной строкой без переносов:
Добавки: [конкретные названия с дозировками]. Упражнения: [тип и частота]. Питание: [конкретные продукты]

ТРЕБОВАНИЯ:
- Только проверенные научными исследованиями рекомендации
- Конкретные дозировки для добавок
- Четкие инструкции по упражнениям
- Специфические продукты питания
- Учитывай возраст и пол если указаны
- НЕ давай общих советов вроде "обратитесь к врачу"
- НЕ используй слова "рекомендуется", "желательно" - только конкретные действия

ПРИМЕРЫ ХОРОШЕГО ОТВЕТА:
- Добавки: Магний 400мг вечером, Омега-3 2г утром. Упражнения: Кардио 30мин 4р/неделя, йога. Питание: Авокадо, орехи, темный шоколад, исключить соль
- Добавки: Железо 18мг с витамином C, B12 1000мкг. Упражнения: Силовые 3р/неделя. Питание: Красное мясо, печень, гранат, шпинат`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'Ты эксперт по биохакингу и превентивной медицине. Даёшь только конкретные, основанные на науке рекомендации без общих фраз.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const recommendation = data.choices[0].message.content.trim();

    console.log('Generated recommendation:', recommendation);

    return new Response(
      JSON.stringify({ 
        recommendation,
        biomarker: biomarkerData.name,
        status: biomarkerData.status 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-biomarker-recommendations function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        recommendation: 'Обратитесь к врачу для персонализированных рекомендаций'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});