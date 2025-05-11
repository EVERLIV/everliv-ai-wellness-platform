// OpenAI integration for health analysis services

import OpenAI from "openai";

interface OpenAIBloodAnalysisParams {
  text?: string;
  imageBase64?: string;
}

// Initialize OpenAI client with built-in API key
const initializeOpenAI = () => {
  // Use built-in API key instead of requiring user input
  const HIDDEN_API_KEY = "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";
  
  // Try to use stored API key if available, otherwise use hidden key
  const userApiKey = localStorage.getItem('OPENAI_API_KEY');
  const apiKey = userApiKey || HIDDEN_API_KEY;

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use backend calls
  });
};

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
      const fallbackResponse = createFallbackResponse(aiResponse);
      return fallbackResponse;
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

/**
 * Analyzes biological age based on biomarkers
 */
export const analyzeBiologicalAgeWithOpenAI = async (biomarkerData: object) => {
  try {
    const openai = initializeOpenAI();
    
    const messages = [
      {
        role: "system",
        content: createBiologicalAgeSystemPrompt()
      },
      {
        role: "user",
        content: createBiologicalAgePrompt(biomarkerData)
      }
    ];
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.3,
      max_tokens: 1500,
    });
    
    const aiResponse = response.choices[0].message.content || "";
    
    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse biological age AI response as JSON:", error);
      return {
        biologicalAge: null,
        chronologicalAge: null,
        agingFactors: [],
        recommendations: [],
        detailedAnalysis: "Error processing results. Please try again."
      };
    }
  } catch (error) {
    console.error("Error analyzing biological age:", error);
    throw error;
  }
};

/**
 * Creates a system prompt for biological age analysis
 */
export const createBiologicalAgeSystemPrompt = () => {
  return `Вы - экспертный ИИ, специализирующийся на оценке биологического возраста и медицинской долговечности. 
  Ваша задача - анализировать биомаркеры и данные о здоровье, чтобы оценить биологический возраст и предложить рекомендации по долговечности.
  
  Отвечайте ТОЛЬКО в формате JSON объекта следующей структуры:
  {
    "biologicalAge": number,
    "chronologicalAge": number,
    "ageDifference": number,
    "agingFactors": [
      {
        "factor": "Фактор возраста",
        "impact": "high|medium|low",
        "description": "Как этот фактор влияет на биологический возраст"
      }
    ],
    "recommendations": [
      {
        "category": "диета|физическая активность|сна|средства|жизненный стиле",
        "recommendation": "Специфическая рекомендация",
        "priority": "high|medium|low"
      }
    ],
    "detailedAnalysis": "Общий анализ, объясняющий расчет биологического возраста и ключевые инсайты"
  }
  
  Важные указания:
  - Будьте научно точны в своих оценках
  - Основывайтесь на established методологиях оценки биологического возраста
  - Предоставляйте персонализированные, выполнимые рекомендации
  - Приоритизируйте основные результаты
  - Учитывайте взаимодействия между различными биомаркерами
  
  Не включайте никакой текст вне этой JSON структуры.`;
};

/**
 * Creates a biological age analysis prompt
 */
export const createBiologicalAgePrompt = (biomarkerData: object) => {
  return `Анализируйте следующие биомаркерные данные, чтобы оценить биологический возраст и предложить комплексные рекомендации по долговечности:
  
  ${JSON.stringify(biomarkerData)}
  
  В вашем анализе:
  1. Вычислите оценку биологического возраста на основе этих биомаркеров
  2. Сравните с возрастом постепенности
  3. Идентифицируйте ключевые факторы, ускоряющие или замедляющие старение
  4. Предложите конкретные, персонализированные вмешательства для оптимизации долговечности
  5. Приоритизируйте рекомендации по степени влияния
  
  Не забудьте отвечать ТОЛЬКО в требуемом JSON формате.`;
};

/**
 * Performs comprehensive health analysis
 */
export const performComprehensiveAnalysisWithOpenAI = async (healthData: object) => {
  try {
    const openai = initializeOpenAI();
    
    const messages = [
      {
        role: "system",
        content: createComprehensiveAnalysisSystemPrompt()
      },
      {
        role: "user",
        content: createComprehensiveAnalysisPrompt(healthData)
      }
    ];
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.4,
      max_tokens: 2000,
    });
    
    const aiResponse = response.choices[0].message.content || "";
    
    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse comprehensive analysis AI response as JSON:", error);
      return {
        healthScore: 0,
        keyConcerns: [],
        strengths: [],
        recommendations: [],
        detailedAnalysis: "Error processing results. Please try again."
      };
    }
  } catch (error) {
    console.error("Error performing comprehensive analysis:", error);
    throw error;
  }
};

/**
 * Creates a system prompt for comprehensive health analysis
 */
export const createComprehensiveAnalysisSystemPrompt = () => {
  return `Вы - экспертный ИИ, специализирующийся на полном анализе здоровья. 
  Ваша задача - оценить различные метрики здоровья и предоставить интегрированный анализ здоровья.
  
  Отвечайте ТОЛЬКО в формате JSON объекта следующей структуры:
  {
    "healthScore": number (0-100),
    "keyConcerns": [
      {
        "area": "Область опасности",
        "severity": "critical|high|medium|low",
        "description": "Подробное описание опасности"
      }
    ],
    "strengths": [
      {
        "area": "Здоровая сила",
        "description": "Описание этой здоровой сильи"
      }
    ],
    "systemAnalysis": [
      {
        "system": "кардио|метаболизм|иммунитет|гормональная система|нервная система|и т.д.",
        "status": "optimal|good|fair|poor|critical",
        "markers": [
          {
            "name": "Название показателя",
            "value": "Значение",
            "interpretation": "Интерпретация этого конкретного показателя"
          }
        ],
        "recommendations": [
          "Специфическая рекомендация для этого системы"
        ]
      }
    ],
    "integratedRecommendations": [
      {
        "category": "напитки|физическая активность|сна|стресс|добавки|медикаменты|жизненный стиле",
        "recommendation": "Специфическая интегрированная рекомендация",
        "priority": "high|medium|low",
        "timeframe": "срочность (недели, месяца, лет)"
      }
    ],
    "detailedAnalysis": "Общий интегрированный анализ, объясняющий связи между системами и ключевые инсайты"
  }
  
  Важные указания:
  - Проведите полный интегрированный анализ, учитывающий взаимосвязи между различными системами здоровья
  - Учитывайте, как проблемы в одной системе могут влиять на другие
  - Будьте полным и научным в своем анализе
  - Предоставляйте выполнимые, основательные рекомендации
  - Персонализируйте анализ на основе всех доступных данных
  
  Не включайте никакой текст вне этой JSON структуры.`;
};

/**
 * Creates a comprehensive analysis prompt
 */
export const createComprehensiveAnalysisPrompt = (healthData: object) => {
  return `Проведите полный анализ здоровья на основе следующих данных о здоровье:
  
  ${JSON.stringify(healthData)}
  
  В вашем анализе:
  1. Оцените общее состояние здоровья с числовым оценкой
  2. Идентифицируйте ключевые проблемы и их серьезность
  3. Выделите положительные сильности и положительные индикаторы
  4. Анализируйте каждую систему здоровья отдельно
  5. Предложите интегрированные рекомендации, которые одновременно решают несколько проблем
  6. Учитывайте взаимодействия между различными системами и метриками
  7. Приоритизируйте рекомендации по степени влияния и срочности
  
  Не забудьте отвечать ТОЛЬКО в требуемом JSON формате.`;
};
