
import { SecureOpenAIService } from "./secure-openai-service";

/**
 * Analyzes biological age based on biomarkers
 */
export const analyzeBiologicalAgeWithOpenAI = async (biomarkerData: object) => {
  try {
    const prompt = createBiologicalAgePrompt(biomarkerData);
    
    const response = await SecureOpenAIService.makeRequest('ai-medical-analysis', {
      prompt,
      temperature: 0.3
    });
    
    try {
      return JSON.parse(response.content);
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
  return `${createBiologicalAgeSystemPrompt()}

Анализируйте следующие биомаркерные данные, чтобы оценить биологический возраст и предложить комплексные рекомендации по долговечности:
  
  ${JSON.stringify(biomarkerData)}
  
  В вашем анализе:
  1. Вычислите оценку биологического возраста на основе этих биомаркеров
  2. Сравните с возрастом постепенности
  3. Идентифицируйте ключевые факторы, ускоряющие или замедляющие старение
  4. Предложите конкретные, персонализированные вмешательства для оптимизации долговечности
  5. Приоритизируйте рекомендации по степени влияния
  
  Не забудьте отвечать ТОЛЬКО в требуемом JSON формате.`;
};
