
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
    const { message, medicalContext, conversationHistory, userAnalyses, systemPrompt } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing personal AI doctor request');
    console.log('Medical context length:', medicalContext?.length || 0);
    console.log('User analyses count:', userAnalyses?.length || 0);

    // Build enhanced system prompt with user context
    let enhancedSystemPrompt = systemPrompt || `AI Doctor - Медицинский Анализ и Консультации

🩺 Роль и Экспертиза
You are an AI Medical Analysis Expert specializing in laboratory diagnostics, blood work interpretation, and comprehensive health assessment.

ВАЖНО: У вас есть доступ к полному медицинскому профилю пациента, включая:
- Базовую информацию (возраст, пол, вес, рост)
- Профиль здоровья (образ жизни, питание, семейный анамнез)
- Историю медицинских анализов
- Текущие симптомы и жалобы
- Принимаемые препараты и хронические заболевания

🎯 Принципы персонализированной работы:
- ВСЕГДА обращайтесь к пациенту по имени, если оно известно
- Учитывайте всю доступную медицинскую информацию при анализе
- Ссылайтесь на предыдущие результаты анализов при их наличии
- Делайте конкретные рекомендации основанные на профиле пациента
- Показывайте, что вы помните историю общения`;

    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: enhancedSystemPrompt
      }
    ];

    // Add comprehensive medical context if available
    if (medicalContext && medicalContext.trim()) {
      messages.push({
        role: 'system',
        content: `МЕДИЦИНСКАЯ ИНФОРМАЦИЯ О ПАЦИЕНТЕ:\n\n${medicalContext}\n\nИспользуйте эту информацию для персонализированных рекомендаций. Обращайтесь к пациенту по имени и ссылайтесь на конкретные данные из профиля.`
      });
    }

    // Add specific analysis data if available
    if (userAnalyses && userAnalyses.length > 0) {
      const analysisContext = userAnalyses.map((analysis, index) => {
        const date = new Date(analysis.created_at).toLocaleDateString('ru-RU');
        return `Анализ ${index + 1} (${date}): ${analysis.analysis_type}\nРезультаты: ${JSON.stringify(analysis.results, null, 2)}`;
      }).join('\n\n');
      
      messages.push({
        role: 'system',
        content: `ПОСЛЕДНИЕ РЕЗУЛЬТАТЫ АНАЛИЗОВ:\n\n${analysisContext}\n\nИспользуйте эти данные для точного медицинского анализа и рекомендаций.`
      });
    }

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10); // Last 10 messages for context
      messages.push(...recentHistory);
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Successfully processed AI doctor request');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-doctor-personal function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
