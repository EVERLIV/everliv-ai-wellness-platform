
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BloodAnalysisRequest {
  text?: string;
  imageBase64?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API ключ не настроен');
    }

    const { text, imageBase64 }: BloodAnalysisRequest = await req.json();

    if (!text && !imageBase64) {
      throw new Error('Необходим текст или изображение для анализа');
    }

    let messages = [];
    
    const systemPrompt = `Вы - высококвалифицированный медицинский лаборант и ИИ-помощник, специализирующийся на анализе результатов лабораторных исследований крови.

ВАЖНАЯ МЕДИЦИНСКАЯ ИНФОРМАЦИЯ:
- Вы обладаете глубокими знаниями в области клинической лабораторной диагностики
- Вы знаете нормальные референсные значения для всех основных биомаркеров крови
- Вы можете определить потенциальные причины отклонений и дать рекомендации
- Вы понимаете взаимосвязи между различными показателями крови

РЕФЕРЕНСНЫЕ ЗНАЧЕНИЯ (примеры основных показателей):
- Гемоглобин: мужчины 130-170 г/л, женщины 120-150 г/л
- Эритроциты: мужчины 4.0-5.5×10¹²/л, женщины 3.5-5.0×10¹²/л
- Лейкоциты: 4.0-9.0×10⁹/л
- Тромбоциты: 150-400×10⁹/л
- Глюкоза: 3.3-5.5 ммоль/л (натощак)
- Общий белок: 65-85 г/л
- АЛТ: до 35 Ед/л (женщины), до 45 Ед/л (мужчины)
- АСТ: до 35 Ед/л (женщины), до 45 Ед/л (мужчины)
- Креатинин: 53-97 мкмоль/л (женщины), 62-115 мкмоль/л (мужчины)

Отвечайте ТОЛЬКО в формате JSON объекта следующей структуры:
{
  "markers": [
    {
      "name": "Название показателя",
      "value": "Обнаруженное значение с единицами измерения",
      "normalRange": "Нормальный диапазон с единицами измерения",
      "status": "normal|high|low",
      "recommendation": "Конкретная подробная рекомендация для данного показателя"
    }
  ],
  "supplements": [
    {
      "name": "Название добавки или препарата",
      "reason": "Медицинское обоснование назначения",
      "dosage": "Рекомендуемая дозировка и режим приема"
    }
  ],
  "generalRecommendation": "Общая медицинская рекомендация на основе всех показателей"
}

ВАЖНЫЕ МЕДИЦИНСКИЕ УКАЗАНИЯ:
- Будьте максимально точны в определении референсных значений
- Определяйте как проблемные показатели, так и положительные индикаторы
- Предоставляйте конкретные, медически обоснованные рекомендации
- При серьезных отклонениях обязательно рекомендуйте консультацию врача

Не включайте никакой текст вне этой JSON структуры.`;

    if (text) {
      // For text input
      messages = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Проанализируйте следующие результаты анализа крови как опытный медицинский лаборант:

РЕЗУЛЬТАТЫ АНАЛИЗА:
${text}

Ответьте строго в требуемом JSON формате с подробными медицинскими рекомендациями.`
        }
      ];
    } else if (imageBase64) {
      // For image input
      messages = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Проанализируй этот анализ крови на русском языке. Выдели все показатели, их значения и нормальные диапазоны. Если значение выходит за пределы нормы, дай конкретные рекомендации. Предложи дополнительные анализы или добавки при необходимости. Ответ должен быть структурированным JSON объектом согласно системной инструкции." 
            },
            { 
              type: "image_url", 
              image_url: { url: imageBase64 } 
            }
          ]
        }
      ];
    }

    console.log("Sending request to OpenAI...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("Received response from OpenAI");
    
    // Parse and validate the response
    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      // Validate structure
      if (!parsedResponse.markers || !Array.isArray(parsedResponse.markers)) {
        throw new Error("Invalid response structure: missing markers array");
      }
      
      // Ensure each marker has required fields
      parsedResponse.markers = parsedResponse.markers.map(marker => ({
        name: marker.name || "Неизвестный показатель",
        value: marker.value || "Не указано",
        normalRange: marker.normalRange || "Не указан",
        status: marker.status || "normal",
        recommendation: marker.recommendation || "Рекомендации не предоставлены"
      }));
      
      // Ensure supplements array exists
      if (!parsedResponse.supplements) {
        parsedResponse.supplements = [];
      }
      
      // Ensure general recommendation exists
      if (!parsedResponse.generalRecommendation) {
        parsedResponse.generalRecommendation = "Рекомендуется консультация с врачом для детального обсуждения результатов.";
      }
      
      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      
      // Return fallback response
      const fallbackResponse = {
        markers: [{
          name: "Общий анализ",
          value: "Данные обработаны частично",
          normalRange: "Не удалось определить",
          status: "normal",
          recommendation: "Рекомендуется повторить анализ или ввести данные вручную для более точного результата."
        }],
        supplements: [],
        generalRecommendation: "Произошла ошибка при анализе данных. Пожалуйста, попробуйте еще раз с более четким изображением или введите данные вручную."
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in analyze-blood-test function:', error);
    
    let errorMessage = "Произошла ошибка при анализе";
    if (error.message?.includes('API key')) {
      errorMessage = "Ошибка API ключа OpenAI. Пожалуйста, проверьте настройки.";
    } else if (error.message?.includes('quota')) {
      errorMessage = "Превышен лимит запросов к OpenAI. Попробуйте позже.";
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
