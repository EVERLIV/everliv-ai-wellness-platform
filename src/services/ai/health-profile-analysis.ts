
import { SecureOpenAIService } from "./secure-openai-service";

export interface HealthProfileAnalysis {
  healthScore: number;
  riskLevel: string;
  riskDescription: string;
  recommendations: string[];
  strengths: string[];
  concerns: string[];
  scoreExplanation: string;
}

export const analyzeHealthProfile = async (healthProfile: any): Promise<HealthProfileAnalysis> => {
  try {
    const prompt = `Проанализируйте профиль здоровья и предоставьте оценку СТРОГО на русском языке.

ВАЖНО: 
- Уровень риска должен быть ТОЛЬКО: "низкий", "средний" или "высокий" (на русском!)
- Балл здоровья рассчитывается по следующей логике:
  * 80-100: отличное здоровье, активный образ жизни, нет хронических заболеваний
  * 60-79: хорошее здоровье, есть области для улучшения
  * 40-59: среднее здоровье, требуется внимание к нескольким аспектам
  * 20-39: ниже среднего, множественные факторы риска
  * 0-19: критическое состояние, требует медицинского вмешательства

Учитывайте: возраст, ИМТ, физическую активность, питание, сон, стресс, вредные привычки, хронические заболевания.
        
Верните JSON в следующем формате:
{
  "healthScore": number (0-100),
  "riskLevel": "низкий" | "средний" | "высокий",
  "riskDescription": "подробное описание уровня риска на русском языке",
  "recommendations": ["рекомендация1", "рекомендация2", "рекомендация3"],
  "strengths": ["сильная сторона1", "сильная сторона2"],
  "concerns": ["проблема1", "проблема2"],
  "scoreExplanation": "объяснение того, как был рассчитан балл здоровья"
}

Проанализируйте профиль здоровья: ${JSON.stringify(healthProfile)}`;
    
    const response = await SecureOpenAIService.makeRequest('ai-medical-analysis', {
      prompt,
      temperature: 0.3
    });
    
    try {
      const result = JSON.parse(response.content);
      
      // Проверяем, что уровень риска на русском языке
      if (!['низкий', 'средний', 'высокий'].includes(result.riskLevel)) {
        // Если ИИ вернул на английском, переводим
        const riskMapping: Record<string, string> = {
          'low': 'низкий',
          'medium': 'средний',
          'high': 'высокий'
        };
        result.riskLevel = riskMapping[result.riskLevel] || 'средний';
      }
      
      return result;
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return {
        healthScore: 50,
        riskLevel: "средний",
        riskDescription: "Недостаточно данных для точной оценки",
        recommendations: ["Заполните профиль здоровья полностью"],
        strengths: [],
        concerns: [],
        scoreExplanation: "Базовая оценка из-за недостатка данных"
      };
    }
  } catch (error) {
    console.error("Error analyzing health profile:", error);
    throw error;
  }
};
