
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
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });
    
    const aiResponse = response.choices[0].message.content || "";
    console.log("Received response from OpenAI:", aiResponse.substring(0, 200) + "...");
    
    // Parse the AI response to match our expected format
    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      // Validate and ensure the response has the correct structure
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
      
      return parsedResponse;
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", error);
      console.log("Full AI response:", aiResponse);
      
      // Attempt to extract structured data even if full parsing fails
      return createFallbackResponse(aiResponse);
    }
  } catch (error) {
    console.error("Error analyzing blood test:", error);
    
    // Return a meaningful error for common issues
    if (error.message?.includes('API key')) {
      throw new Error("Ошибка API ключа OpenAI. Пожалуйста, проверьте настройки.");
    } else if (error.message?.includes('quota')) {
      throw new Error("Превышен лимит запросов к OpenAI. Попробуйте позже.");
    } else if (error.message?.includes('image')) {
      throw new Error("Ошибка обработки изображения. Попробуйте загрузить другое фото или введите данные вручную.");
    }
    
    throw error;
  }
};

/**
 * Creates a fallback response when JSON parsing fails
 */
const createFallbackResponse = (responseText: string) => {
  return {
    markers: [{
      name: "Общий анализ",
      value: "Данные обработаны частично",
      normalRange: "Не удалось определить",
      status: "normal",
      recommendation: "Рекомендуется повторить анализ или ввести данные вручную для более точного результата."
    }],
    supplements: [],
    generalRecommendation: "Произошла ошибка при анализе данных. Пожалуйста, попробуйте еще раз с более четким изображением или введите данные вручную. Обязательно проконсультируйтесь с врачом для интерпретации результатов."
  };
};

/**
 * Creates a system prompt for blood test analysis
 */
export const createBloodTestSystemPrompt = () => {
  return `Вы - высококвалифицированный медицинский лаборант и ИИ-помощник, специализирующийся на анализе результатов лабораторных исследований крови.

ВАЖНАЯ МЕДИЦИНСКАЯ ИНФОРМАЦИЯ:
- Вы обладаете глубокими знаниями в области клинической лабораторной диагностики
- Вы знаете нормальные референсные значения для всех основных биомаркеров крови
- Вы можете определить потенциальные причины отклонений и дать рекомендации
- Вы понимаете взаимосвязи между различными показателями крови

ВАШИ ЗНАНИЯ ВКЛЮЧАЮТ:
- Общий анализ крови (гемоглобин, эритроциты, лейкоциты, тромбоциты, СОЭ и др.)
- Биохимический анализ крови (глюкоза, белки, ферменты, липиды, электролиты)
- Гормональные панели (щитовидная железа, половые гормоны, кортизол и др.)
- Витамины и микроэлементы (D, B12, фолиевая кислота, железо и др.)
- Маркеры воспаления (С-реактивный белок, прокальцитонин)
- Онкомаркеры и специфические белки

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
- ТТГ: 0.4-4.0 мЕд/л
- Витамин D: 30-100 нг/мл (оптимально >30)

ВАША ЗАДАЧА:
Анализировать результаты анализов крови, выявлять отклонения и предоставлять персонализированные рекомендации.
  
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
- Учитывайте возрастные и половые различия в нормах
- Определяйте как проблемные показатели, так и положительные индикаторы
- Предоставляйте конкретные, медически обоснованные рекомендации
- Рекомендуйте конкретные добавки/препараты с дозировками при отклонениях
- Учитывайте взаимодействия между различными показателями
- При серьезных отклонениях обязательно рекомендуйте консультацию врача
- Включайте информацию о возможных причинах отклонений
  
БЕЗОПАСНОСТЬ:
- Всегда напоминайте о необходимости консультации с врачом
- Не ставьте окончательные диагнозы
- Указывайте на необходимость дополнительных обследований при серьезных отклонениях
  
Не включайте никакой текст вне этой JSON структуры.`;
};

/**
 * Creates a prompt for OpenAI based on blood test data
 */
export const createBloodTestPrompt = (text: string) => {
  return `Проанализируйте следующие результаты анализа крови как опытный медицинский лаборант:
  
РЕЗУЛЬТАТЫ АНАЛИЗА:
${text}
  
ЗАДАЧИ АНАЛИЗА:
1. Определите все биомаркеры и их значения
2. Сравните с нормальными референсными значениями (учитывая пол и возраст если указаны)
3. Классифицируйте каждый показатель как normal/high/low
4. Для каждого отклонения:
   - Объясните возможные причины
   - Дайте конкретные рекомендации по коррекции
   - Предложите добавки/изменения питания/образа жизни
   - Укажите на необходимость дополнительных обследований если нужно
5. Проанализируйте взаимосвязи между показателями
6. Дайте общую оценку состояния здоровья
7. Рекомендуйте план действий

МЕДИЦИНСКИЕ СООБРАЖЕНИЯ:
- Учитывайте клиническую значимость отклонений
- Приоритизируйте наиболее важные находки
- Рекомендуйте срочную консультацию врача при серьезных отклонениях
- Предложите профилактические меры для поддержания здоровья

Ответьте строго в требуемом JSON формате с подробными медицинскими рекомендациями.`;
};
