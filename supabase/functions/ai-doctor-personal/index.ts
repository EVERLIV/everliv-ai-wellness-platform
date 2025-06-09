
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Setup OpenAI
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const configuration = new Configuration({ apiKey: openAIKey });
    const openai = new OpenAIApi(configuration);

    // Parse request body
    const { message, medicalContext, conversationHistory, userAnalyses } = await req.json();
    
    // Создаем расширенный системный промпт для персонального доктора
    const systemPrompt = `You are a personal AI health assistant with access to user's medical history and test results.
    
    Key capabilities and rules:
    1. You have memory of previous conversations with this user
    2. You have access to their medical test results and can reference them
    3. Provide personalized recommendations based on their specific health data
    4. Never diagnose specific medical conditions - only provide wellness insights
    5. Always recommend consulting healthcare professionals for serious concerns
    6. Be empathetic and remember details from previous conversations
    7. Cite specific test results when making recommendations
    8. Focus on preventive care and lifestyle improvements
    
    User's medical context and recent test results:
    ${medicalContext}
    
    Remember: You are their personal health companion with memory and access to their data.
    Respond in Russian language.`;
    
    // Подготавливаем сообщения для API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8), // Используем последние 8 сообщений для контекста
      { role: 'user', content: message }
    ];
    
    // Вызываем OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1200,
    });

    const aiResponse = completion.data.choices[0].message?.content || 
      "Извините, я не смог сформулировать ответ. Пожалуйста, попробуйте задать вопрос иначе.";

    // Логируем для анализа (без личных данных)
    console.log(`Personal AI Doctor - User has ${userAnalyses?.length || 0} analyses, Context length: ${medicalContext?.length || 0}`);
    
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in Personal AI Doctor function:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
