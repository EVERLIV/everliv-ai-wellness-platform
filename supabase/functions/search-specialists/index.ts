
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
    const { query, specialists } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Searching specialists for query:', query);

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
            content: `Ты помощник для поиска медицинских специалистов. Проанализируй запрос пользователя и найди 3-5 наиболее подходящих специалистов из предоставленного списка.

Для каждого специалиста создай краткую выжимку (2-3 предложения) о том, почему он подходит для запроса пользователя.

Оцени релевантность каждого специалиста по шкале от 0 до 100.

Верни результат в формате JSON:
{
  "results": [
    {
      "specialist": {полный объект специалиста},
      "relevanceScore": число от 0 до 100,
      "summary": "краткое описание почему подходит"
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Запрос пользователя: "${query}"

Список специалистов:
${JSON.stringify(specialists, null, 2)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResult = data.choices[0].message.content;

    console.log('AI search result:', aiResult);

    let parsedResult;
    try {
      parsedResult = JSON.parse(aiResult);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Invalid AI response format');
    }

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-specialists function:', error);
    return new Response(JSON.stringify({ error: error.message, results: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
