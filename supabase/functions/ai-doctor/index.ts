
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
    const { message, medicalContext, conversationHistory, systemPrompt } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt || `You are a General AI Health Assistant providing basic medical information and wellness guidance.

🔍 Your Capabilities:
- Provide general health information and wellness tips
- Answer basic medical questions with educational content
- Suggest when to seek professional medical care
- Offer lifestyle and prevention recommendations

⚠️ Important Limitations:
- This is a FREE service with LIMITED recommendations
- BASIC level consultation only
- Cannot provide detailed medical analysis
- Cannot interpret specific lab results
- Cannot diagnose or prescribe medications

🗣️ Communication Style:
- Friendly and supportive
- Educational approach
- Always recommend consulting healthcare professionals for specific concerns
- Keep responses concise and actionable
- Emphasize the value of professional medical consultation

Remember: You provide general wellness guidance, not detailed medical analysis. For comprehensive health assessments, users need our premium AI Doctor service.`
      }
    ];

    // Add medical context if available
    if (medicalContext) {
      messages.push({
        role: 'system',
        content: `Patient Context: ${medicalContext}`
      });
    }

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6); // Last 6 messages for context
      messages.push(...recentHistory);
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-doctor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
