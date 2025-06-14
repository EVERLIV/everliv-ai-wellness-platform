
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
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        results: [] 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!query || !specialists || specialists.length === 0) {
      console.log('Invalid input:', { query, specialistsCount: specialists?.length });
      return new Response(JSON.stringify({ 
        error: 'Invalid input data',
        results: [] 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Searching specialists for query:', query);
    console.log('Available specialists:', specialists.length);

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
            content: `Ты помощник для поиска медицинских специалистов в Москве. 

Проанализируй запрос пользователя и найди 3-5 наиболее подходящих специалистов из предоставленного списка.

Для каждого подходящего специалиста создай:
1. Оценку релевантности от 0 до 100
2. Краткое объяснение (2-3 предложения) почему этот специалист подходит

Учитывай:
- Специализацию врача
- Симптомы или проблемы пользователя
- Опыт и квалификацию
- Отзывы и рейтинг

Верни результат ТОЛЬКО в формате JSON:
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

Доступные специалисты:
${JSON.stringify(specialists.slice(0, 20), null, 2)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
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
      console.error('AI response was:', aiResult);
      
      // Fallback: return basic search results
      const fallbackResults = specialists
        .filter(s => 
          s.name?.toLowerCase().includes(query.toLowerCase()) ||
          s.specialization?.name?.toLowerCase().includes(query.toLowerCase()) ||
          s.bio?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3)
        .map(specialist => ({
          specialist,
          relevanceScore: 75,
          summary: `Специалист подходит по запросу "${query}"`
        }));

      return new Response(JSON.stringify({ results: fallbackResults }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure results is an array
    if (!parsedResult.results || !Array.isArray(parsedResult.results)) {
      parsedResult = { results: [] };
    }

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-specialists function:', error);
    return new Response(JSON.stringify({ 
      error: error.message, 
      results: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
