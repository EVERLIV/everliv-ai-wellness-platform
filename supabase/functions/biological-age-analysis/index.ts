import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BiologicalAgeAnalysisData {
  chronological_age: number;
  gender: string;
  height: number;
  weight: number;
  lifestyle_factors: {
    exercise_frequency: number;
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

// Функция для преобразования числового значения частоты упражнений в текст
const getExerciseFrequencyText = (frequency: number): string => {
  switch (frequency) {
    case 0: return 'Не занимаюсь';
    case 1: return '1 раз в неделю';
    case 2: return '2-3 раза в неделю';
    case 3: return '4-5 раз в неделю';
    case 4: return 'Ежедневно';
    default: return `${frequency} раз в неделю`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY не настроен в секретах Edge Function');
    }

    const data: BiologicalAgeAnalysisData = await req.json();
    
    const exerciseText = getExerciseFrequencyText(data.lifestyle_factors.exercise_frequency);
    
    const prompt = `
Проанализируй биомаркеры и определи биологический возраст:

Базовая информация:
- Хронологический возраст: ${data.chronological_age} лет
- Пол: ${data.gender}
- Рост: ${data.height} см
- Вес: ${data.weight} кг
- Частота физических упражнений: ${exerciseText}
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

    console.log('Отправляем запрос к OpenAI для анализа биологического возраста...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Пустой ответ от OpenAI');
    }

    console.log('Получен ответ от OpenAI:', content.substring(0, 200) + '...');

    try {
      const parsedResult = JSON.parse(content);
      
      // Валидация результата
      if (typeof parsedResult.biologicalAge !== 'number' || parsedResult.biologicalAge < 0) {
        throw new Error('Некорректный биологический возраст в ответе');
      }
      
      return new Response(JSON.stringify(parsedResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError);
      console.log('Ответ OpenAI:', content);
      
      // Fallback результат
      const fallbackResult = {
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
      
      return new Response(JSON.stringify(fallbackResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Ошибка в biological-age-analysis function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Внутренняя ошибка сервера'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});