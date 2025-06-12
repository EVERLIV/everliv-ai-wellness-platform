
import { initializeOpenAI } from "./openai-client";

export interface HealthProfileAnalysis {
  healthScore: number;
  riskLevel: string;
  riskDescription: string;
  recommendations: string[];
  strengths: string[];
  concerns: string[];
}

export const analyzeHealthProfile = async (healthProfile: any): Promise<HealthProfileAnalysis> => {
  try {
    const openai = initializeOpenAI();
    
    const messages = [
      {
        role: "system",
        content: `Вы - эксперт по здоровью. Проанализируйте профиль здоровья и предоставьте оценку на русском языке.
        
        Верните JSON в следующем формате:
        {
          "healthScore": number (0-100),
          "riskLevel": "низкий" | "средний" | "высокий",
          "riskDescription": "подробное описание уровня риска",
          "recommendations": ["рекомендация1", "рекомендация2"],
          "strengths": ["сильная сторона1", "сильная сторона2"],
          "concerns": ["проблема1", "проблема2"]
        }`
      },
      {
        role: "user",
        content: `Проанализируйте профиль здоровья: ${JSON.stringify(healthProfile)}`
      }
    ];
    
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
      console.error("Failed to parse AI response:", error);
      return {
        healthScore: 50,
        riskLevel: "средний",
        riskDescription: "Недостаточно данных для точной оценки",
        recommendations: ["Заполните профиль здоровья полностью"],
        strengths: [],
        concerns: []
      };
    }
  } catch (error) {
    console.error("Error analyzing health profile:", error);
    throw error;
  }
};
