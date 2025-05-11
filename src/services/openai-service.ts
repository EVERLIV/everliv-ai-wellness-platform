
// OpenAI integration for blood analysis

interface OpenAIBloodAnalysisParams {
  text?: string;
  imageUrl?: string;
}

/**
 * Analyzes blood test results using OpenAI
 * Currently mocked - will be replaced with actual API calls
 */
export const analyzeBloodTestWithOpenAI = async (params: OpenAIBloodAnalysisParams) => {
  console.log("Analyzing blood test with OpenAI", params);
  
  // This is where we would call the OpenAI API
  // For now, we're just returning mock data
  
  // Mock a delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock results
  return {
    markers: [
      { name: "Гемоглобин", value: "142 г/л", normalRange: "130-160 г/л", status: "normal" as const, recommendation: "В пределах нормы" },
      { name: "Эритроциты", value: "4.7 млн/мкл", normalRange: "4.5-5.5 млн/мкл", status: "normal" as const, recommendation: "В пределах нормы" },
      { name: "Лейкоциты", value: "10.2 тыс/мкл", normalRange: "4.0-9.0 тыс/мкл", status: "high" as const, recommendation: "Повышен. Может указывать на наличие инфекции или воспаления в организме." },
      { name: "Тромбоциты", value: "220 тыс/мкл", normalRange: "150-400 тыс/мкл", status: "normal" as const, recommendation: "В пределах нормы" },
      { name: "Холестерин общий", value: "6.2 ммоль/л", normalRange: "до 5.2 ммоль/л", status: "high" as const, recommendation: "Повышен. Рекомендуется корректировка диеты с уменьшением потребления животных жиров." },
    ],
    supplements: [
      { name: "Омега-3", reason: "Для улучшения липидного профиля и снижения холестерина", dosage: "1000 мг ежедневно во время еды" },
      { name: "Витамин С", reason: "Для поддержки иммунной системы при повышенных лейкоцитах", dosage: "500 мг 2 раза в день" },
      { name: "Коэнзим Q10", reason: "Для поддержки сердечно-сосудистой системы", dosage: "100 мг ежедневно" },
    ],
    generalRecommendation: "На основе анализа крови рекомендуется обратить внимание на повышенный уровень холестерина и лейкоцитов. Следует включить в рацион больше свежих овощей, фруктов, омега-3 жирных кислот, и уменьшить потребление животных жиров. При сохранении повышенных лейкоцитов в течение более 2 недель рекомендуется консультация терапевта."
  };
};

/**
 * Creates a prompt for OpenAI based on blood test data
 */
export const createBloodTestPrompt = (text: string) => {
  return `Analyze the following blood test results and provide detailed recommendations.
Include normal ranges, current status, and specific supplement recommendations if applicable.
Also include a general recommendation section.

Blood Test Results:
${text}`;
};
