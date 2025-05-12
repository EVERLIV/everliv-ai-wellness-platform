
import { initializeOpenAI } from "./openai-client";

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
