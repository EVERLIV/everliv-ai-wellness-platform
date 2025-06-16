
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
    const { text, type, metadata } = await req.json();

    console.log(`Generating embedding for type: ${type}`);

    // Генерируем embedding через OpenAI
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`OpenAI API error: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    console.log(`Generated embedding with ${embedding.length} dimensions`);

    // Сохраняем embedding в зависимости от типа
    let result;
    
    if (type === 'medical_article') {
      const { data, error } = await supabase
        .from('medical_article_embeddings')
        .upsert({
          article_id: metadata.article_id,
          embedding: embedding
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else if (type === 'protocol') {
      const { data, error } = await supabase
        .from('protocol_embeddings')
        .upsert({
          protocol_id: metadata.protocol_id,
          embedding: embedding,
          protocol_features: metadata.features || {}
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else if (type === 'user_preference') {
      const { data, error } = await supabase
        .from('user_preferences_embeddings')
        .upsert({
          user_id: metadata.user_id,
          preference_type: metadata.preference_type,
          embedding: embedding,
          metadata: metadata.additional_data || {}
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      throw new Error(`Unknown embedding type: ${type}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      embedding_id: result.id,
      dimensions: embedding.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating embedding:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
