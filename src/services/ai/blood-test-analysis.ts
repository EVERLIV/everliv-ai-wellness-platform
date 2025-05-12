
import { initializeOpenAI } from "./openai-client";

interface OpenAIBloodAnalysisParams {
  text?: string;
  imageBase64?: string;
}

/**
 * Analyzes blood test results using OpenAI
 */
export const analyzeBloodTestWithOpenAI = async (params: OpenAIBloodAnalysisParams) => {
  console.log("Analyzing blood test with OpenAI", params);
  
  try {
    const openai = initializeOpenAI();
    const { text, imageBase64 } = params;
    
    let messages = [];
    
    if (text) {
      // For text input
      messages = [
        {
          role: "system",
          content: createBloodTestSystemPrompt()
        },
        {
          role: "user",
          content: createBloodTestPrompt(text)
        }
      ];
    } else if (imageBase64) {
      // For image input - format correctly for the content array
      messages = [
        {
          role: "system",
          content: createBloodTestSystemPrompt()
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
    } else {
      throw new Error("Either text or image is required");
    }
    
    console.log("Sending request to OpenAI with message structure:", 
      JSON.stringify(messages.map(m => {
        if (typeof m.content === 'string') {
          return { role: m.role, contentType: 'string' };
        } else {
          return { 
            role: m.role, 
            contentTypes: m.content.map(c => c.type)
          };
        }
      }), null, 2)
    );
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    const aiResponse = response.choices[0].message.content || "";
    console.log("Received response from OpenAI:", aiResponse.substring(0, 200) + "...");
    
    // Parse the AI response to match our expected format
    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", error);
      console.log("Full AI response:", aiResponse);
      
      // Attempt to extract structured data even if full parsing fails
      return createFallbackResponse(aiResponse);
    }
  } catch (error) {
    console.error("Error analyzing blood test:", error);
    throw error;
  }
};

/**
 * Creates a fallback response when JSON parsing fails
 */
const createFallbackResponse = (responseText: string) => {
  // Default fallback response
  let fallbackResponse = {
    markers: [],
    supplements: [],
    generalRecommendation: "Произошла ошибка при анализе данных. Пожалуйста, попробуйте еще раз с более четким изображением или введите данные вручную."
  };

  try {
    // Try to extract some meaningful data even if JSON parsing failed
    
    // Look for marker patterns
    const markerMatches = responseText.match(/["']?name["']?\s*:\s*["']([^"']+)["']/g);
    if (markerMatches && markerMatches.length > 0) {
      const extractedMarkers = [];
      markerMatches.forEach(match => {
        const nameMatch = match.match(/["']?name["']?\s*:\s*["']([^"']+)["']/);
        if (nameMatch && nameMatch[1]) {
          extractedMarkers.push({
            name: nameMatch[1],
            value: "Не удалось распознать",
            normalRange: "Не удалось распознать",
            status: "normal",
            recommendation: "Рекомендуем повторить анализ или ввести данные вручную"
          });
        }
      });
      
      if (extractedMarkers.length > 0) {
        fallbackResponse.markers = extractedMarkers;
      }
    }
    
    // Look for general recommendation
    const generalRecMatch = responseText.match(/["']?generalRecommendation["']?\s*:\s*["']([^"']+)["']/);
    if (generalRecMatch && generalRecMatch[1]) {
      fallbackResponse.generalRecommendation = generalRecMatch[1];
    }
    
    return fallbackResponse;
  } catch (error) {
    console.error("Error creating fallback response:", error);
    return fallbackResponse;
  }
};

/**
 * Creates a system prompt for blood test analysis
 */
export const createBloodTestSystemPrompt = () => {
  return `Вы - высококвалифицированный медицинский ИИ-помощник, специализирующийся на анализе результатов анализов крови.
  Ваша задача - анализировать результаты анализов крови, выявлять отклонения и предоставлять персонализированные рекомендации.
  
  Отвечайте ТОЛЬКО в формате JSON объекта следующей структуры:
  {
    "markers": [
      {
        "name": "Название показателя",
        "value": "Обнаруженное значение",
        "normalRange": "Нормальный диапазон",
        "status": "normal|high|low",
        "recommendation": "Конкретная рекомендация для данного показателя"
      }
    ],
    "supplements": [
      {
        "name": "Название добавки",
        "reason": "Причина рекомендации",
        "dosage": "Рекомендуемая дозировка"
      }
    ],
    "generalRecommendation": "Общая рекомендация на основе всех показателей"
  }
  
  Важные указания:
  - Будьте тщательны и научно точны в своем анализе
  - Определяйте как проблемные показатели, так и положительные индикаторы
  - Предоставляйте конкретные, выполнимые рекомендации для каждого отклоняющегося показателя
  - Предлагайте соответствующие добавки или изменения образа жизни на основе конкретных результатов
  - Включайте комплексную общую рекомендацию
  - Учитывайте потенциальные взаимодействия между различными показателями
  
  Не включайте никакой текст вне этой JSON структуры.`;
};

/**
 * Creates a prompt for OpenAI based on blood test data
 */
export const createBloodTestPrompt = (text: string) => {
  return `Проанализируйте следующие результаты анализа крови подробно и предоставьте персонализированные рекомендации:
  
  ${text}
  
  Для каждого отклоняющегося показателя:
  1. Определите конкретную проблему
  2. Объясните её влияние на здоровье
  3. Предложите конкретные диетические, образ жизни или добавочные вмешательства
  4. Укажите уровень срочности, если уместно
  
  Также определите любые положительные показатели и предоставьте поддержку.
  
  Не забудьте отвечать ТОЛЬКО в требуемом JSON формате.`;
};
