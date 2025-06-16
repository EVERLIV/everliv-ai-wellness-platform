
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { query, search_type, match_threshold, match_count, user_id } = await req.json();

    console.log(`Performing semantic search for: ${query}`);

    // Генерируем embedding для поискового запроса
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
        encoding_format: 'float'
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`OpenAI API error: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    let results;

    if (search_type === 'medical_articles') {
      // Используем SQL функцию для поиска статей
      const { data, error } = await supabase.rpc('search_medical_articles_by_embedding', {
        query_embedding: queryEmbedding,
        match_threshold: match_threshold || 0.7,
        match_count: match_count || 10
      });

      if (error) throw error;
      results = data;
    } else if (search_type === 'protocol_recommendations' && user_id) {
      // Сначала сохраняем пользовательский поисковый запрос как предпочтение
      await supabase
        .from('user_preferences_embeddings')
        .upsert({
          user_id: user_id,
          preference_type: 'search_query',
          embedding: queryEmbedding,
          metadata: { query: query, timestamp: new Date().toISOString() }
        });

      // Затем получаем рекомендации
      const { data, error } = await supabase.rpc('recommend_protocols_for_user', {
        user_id_param: user_id,
        match_threshold: match_threshold || 0.6,
        match_count: match_count || 5
      });

      if (error) throw error;
      results = data;
    } else {
      throw new Error(`Invalid search type: ${search_type}`);
    }

    console.log(`Found ${results?.length || 0} results`);

    return new Response(JSON.stringify({ 
      success: true,
      results: results || [],
      query: query,
      search_type: search_type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in semantic search:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
