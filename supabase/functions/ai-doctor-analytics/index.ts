
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, healthData, userId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Формируем контекст на основе данных здоровья
    const healthContext = formatHealthContext(healthData);
    
    const systemPrompt = `Вы - ИИ-доктор EVERLIV, специализирующийся на анализе данных здоровья и персональных консультациях.

Контекст пациента:
${healthContext}

Ваши принципы:
- Давайте персональные ответы на основе данных пациента
- Объясняйте медицинские термины простым языком
- Всегда рекомендуйте консультацию с врачом при серьезных отклонениях
- Будьте поддерживающим и информативным
- Фокусируйтесь на профилактике и улучшении здоровья

Отвечайте на русском языке, кратко и по существу.`;

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
          { role: 'user', content: question }
        ],
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
    console.error('Error in ai-doctor-analytics:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function formatHealthContext(healthData: any) {
  if (!healthData) return 'Данные о здоровье не предоставлены.';
  
  let context = '';
  
  // Общий статус
  if (healthData.overview) {
    context += `Общий балл здоровья: ${healthData.overview.healthScore}/100\n`;
    context += `Уровень риска: ${healthData.overview.riskLevel}\n\n`;
  }
  
  // Биомаркеры
  if (healthData.biomarkers?.length > 0) {
    context += 'Биомаркеры:\n';
    for (const marker of healthData.biomarkers) {
      context += `- ${marker.name}: ${marker.value} ${marker.unit} (статус: ${marker.status})\n`;
    }
    context += '\n';
  }
  
  // Факторы риска
  if (healthData.riskFactors?.length > 0) {
    context += 'Выявленные факторы риска:\n';
    for (const risk of healthData.riskFactors) {
      context += `- ${risk.factor} (уровень: ${risk.level})\n`;
    }
    context += '\n';
  }
  
  // Текущие рекомендации
  if (healthData.recommendations?.length > 0) {
    context += 'Текущие рекомендации:\n';
    for (const rec of healthData.recommendations) {
      context += `- ${rec.title} (приоритет: ${rec.priority})\n`;
    }
  }
  
  return context;
}
