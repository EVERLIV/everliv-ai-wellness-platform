
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
    const { biomarkerName, currentValue, normalRange, status } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `Ты - эксперт по лабораторной диагностике и превентивной медицине. 
Твоя задача - предоставить детальные, практические рекомендации для нормализации биомаркера.

ВАЖНО: 
- Рекомендации должны быть конкретными и выполнимыми
- Не ставь диагнозы и не назначай лечение
- Рекомендуй консультацию с врачом при серьезных отклонениях
- Фокусируйся на питании, образе жизни и профилактике
- Используй только научно обоснованные подходы`;

    const userPrompt = `Биомаркер: ${biomarkerName}
Текущее значение: ${currentValue}
Нормальный диапазон: ${normalRange}
Статус: ${status === 'high' ? 'выше нормы' : 'ниже нормы'}

Предоставь детальные рекомендации в формате JSON со следующими полями:
- dietaryRecommendations: массив конкретных рекомендаций по питанию (3-5 пунктов)
- lifestyleChanges: массив изменений образа жизни (3-4 пункта)
- supplementsToConsider: массив добавок для рассмотрения с врачом (2-3 пункта)
- whenToRetest: рекомендация когда пересдать анализ
- warningSignsToWatch: массив симптомов, на которые стоит обратить внимание (2-3 пункта)
- additionalTests: массив дополнительных анализов для рассмотрения (1-2 пункта)

Ответь только в формате JSON без дополнительного текста.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let recommendations;
    try {
      recommendations = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError, 'Content:', content);
      throw new Error('Не удалось обработать ответ ИИ');
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-biomarker-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
