
import OpenAI from 'openai';

interface BiologicalAgeAnalysisData {
  chronological_age: number;
  gender: string;
  height: number;
  weight: number;
  lifestyle_factors: {
    exercise_frequency: string;
    stress_level: number;
    sleep_hours: number;
    smoking_status: string;
    alcohol_consumption: string;
  };
  biomarkers: Array<{
    name: string;
    value: number;
    unit: string;
    normal_range: {
      min: number;
      max: number;
      optimal?: number;
    };
    category: string;
  }>;
  chronic_conditions: string[];
  medications: string[];
}

interface BiologicalAgeResult {
  biologicalAge: number;
  deviation: number;
  confidenceLevel: number;
  detailedAnalysis: string;
  recommendations: Array<{
    category: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  missingAnalyses: string[];
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeBiologicalAgeWithOpenAI(data: BiologicalAgeAnalysisData): Promise<BiologicalAgeResult> {
  const prompt = `
Проанализируй биомаркеры и определи биологический возраст:

Базовая информация:
- Хронологический возраст: ${data.chronological_age} лет
- Пол: ${data.gender}
- Рост: ${data.height} см
- Вес: ${data.weight} кг
- Частота физических упражнений: ${data.lifestyle_factors.exercise_frequency}
- Уровень стресса (1-10): ${data.lifestyle_factors.stress_level}
- Часы сна: ${data.lifestyle_factors.sleep_hours}
- Статус курения: ${data.lifestyle_factors.smoking_status}
- Потребление алкоголя: ${data.lifestyle_factors.alcohol_consumption}
- Хронические заболевания: ${data.chronic_conditions.join(', ') || 'Нет'}
- Принимаемые препараты: ${data.medications.join(', ') || 'Нет'}

Биомаркеры:
${data.biomarkers.map(b => `
- ${b.name}: ${b.value} ${b.unit} (норма: ${b.normal_range.min}-${b.normal_range.max}${b.normal_range.optimal ? `, оптимально: ${b.normal_range.optimal}` : ''})
`).join('')}

Задача:
1. Определи биологический возраст на основе предоставленных данных
2. Объясни, какие факторы влияют на результат
3. Дай рекомендации по улучшению показателей
4. Укажи, какие дополнительные анализы могут повысить точность оценки

Отвечай СТРОГО в формате JSON:
{
  "biologicalAge": число,
  "deviation": число (разница с хронологическим возрастом, может быть отрицательной),
  "confidenceLevel": число от 1 до 100,
  "detailedAnalysis": "подробное объяснение на русском языке",
  "recommendations": [
    {
      "category": "категория рекомендации",
      "recommendation": "текст рекомендации",
      "priority": "high/medium/low"
    }
  ],
  "missingAnalyses": ["список анализов, которые помогут повысить точность"]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Ты эксперт по биологическому возрасту и биомаркерам. Анализируй данные медицинских анализов и определяй биологический возраст человека. Отвечай только в формате JSON без дополнительного текста.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Пустой ответ от OpenAI');
    }

    try {
      const result = JSON.parse(content) as BiologicalAgeResult;
      return result;
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError);
      console.log('Ответ OpenAI:', content);
      
      // Fallback результат
      return {
        biologicalAge: data.chronological_age,
        deviation: 0,
        confidenceLevel: 50,
        detailedAnalysis: 'Не удалось получить детальный анализ от ИИ. Попробуйте еще раз.',
        recommendations: [
          {
            category: 'Общие',
            recommendation: 'Регулярно проходите медицинские обследования',
            priority: 'medium'
          }
        ],
        missingAnalyses: []
      };
    }
  } catch (error) {
    console.error('Ошибка при обращении к OpenAI:', error);
    throw new Error('Не удалось получить анализ от ИИ. Проверьте подключение к интернету.');
  }
}
