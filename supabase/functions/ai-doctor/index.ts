
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
    const { message, medicalContext, conversationHistory } = await req.json();
    
    // Prepare system prompt with medical guidelines
    const systemPrompt = `You are an AI health assistant that provides general wellness information. 
    Important rules to follow:
    1. Never diagnose specific medical conditions.
    2. Do not prescribe specific treatments or medications.
    3. Provide evidence-based general health information only.
    4. Recommend consulting a healthcare professional for specific medical concerns.
    5. Be respectful and professional at all times.
    6. Provide references to scientific studies when available.
    7. Focus on general wellness, prevention, and lifestyle improvements.
    
    ${medicalContext ? `User medical context: ${medicalContext}` : ''}`;
    
    // Prepare conversation for the API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Include last 10 messages only to avoid token limits
      { role: 'user', content: message }
    ];
    
    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.data.choices[0].message?.content || 
      "Извините, я не смог сформулировать ответ. Пожалуйста, попробуйте задать вопрос иначе.";

    // Log interaction for analysis (without storing personal health details)
    console.log(`AI Doctor interaction - User message length: ${message.length}, Response length: ${aiResponse.length}`);
    
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in AI Doctor function:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
