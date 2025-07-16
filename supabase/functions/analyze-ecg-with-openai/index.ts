import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { ecgImage, diagnosis } = await req.json();
    
    console.log('Analyzing ECG with OpenAI...');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Конвертируем base64 изображение для OpenAI
    const base64Image = ecgImage.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Проанализируйте данную ЭКГ и сравните с диагнозом врача: "${diagnosis}". 
                
                Пожалуйста, предоставьте:
                1. Подробный анализ ЭКГ (ритм, частота, интервалы, сегменты)
                2. Выявленные патологии или особенности
                3. Сравнение с диагнозом врача (совпадения и расхождения)
                4. Уровень согласованности с диагнозом (в процентах)
                5. Дополнительные рекомендации по диагностике
                
                Ответ должен быть на русском языке и структурирован в формате JSON со следующими полями:
                - ecgAnalysis (детальный анализ ЭКГ)
                - detectedAbnormalities (выявленные патологии)
                - diagnosisComparison (сравнение с диагнозом)
                - agreementLevel (уровень согласованности 0-100)
                - additionalRecommendations (дополнительные рекомендации)
                - confidence (уровень уверенности в анализе 0-100)`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const analysisText = openAIData.choices[0].message.content;
    
    // Попытаемся извлечь JSON из ответа
    let analysis;
    try {
      // Ищем JSON в ответе
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Если JSON не найден, создаем структурированный ответ
        analysis = {
          ecgAnalysis: analysisText,
          detectedAbnormalities: [],
          diagnosisComparison: "Требуется дополнительный анализ для сравнения",
          agreementLevel: 50,
          additionalRecommendations: [],
          confidence: 75
        };
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Создаем структурированный ответ из текста
      analysis = {
        ecgAnalysis: analysisText,
        detectedAbnormalities: [],
        diagnosisComparison: "Анализ выполнен, но требуется дополнительная интерпретация",
        agreementLevel: 50,
        additionalRecommendations: [],
        confidence: 75
      };
    }

    console.log('ECG analysis completed successfully');
    
    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      rawResponse: analysisText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error in analyze-ecg-with-openai:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});