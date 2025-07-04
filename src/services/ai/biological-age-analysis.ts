
import { supabase } from '@/integrations/supabase/client';

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

export async function analyzeBiologicalAgeWithOpenAI(data: BiologicalAgeAnalysisData): Promise<BiologicalAgeResult> {
  try {
    console.log('Отправляем запрос к Edge Function для анализа биологического возраста...');

    const { data: result, error } = await supabase.functions.invoke('biological-age-analysis', {
      body: data
    });

    if (error) {
      console.error('Ошибка Edge Function:', error);
      throw new Error(error.message || 'Ошибка при обращении к сервису анализа');
    }

    if (!result) {
      throw new Error('Пустой ответ от сервиса анализа');
    }

    // Валидация результата
    if (typeof result.biologicalAge !== 'number' || result.biologicalAge < 0) {
      throw new Error('Некорректный биологический возраст в ответе');
    }

    console.log('Получен результат анализа биологического возраста');
    return result as BiologicalAgeResult;

  } catch (error) {
    console.error('Ошибка при анализе биологического возраста:', error);
    
    // Более детальная информация об ошибке
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('OPENAI_API_KEY')) {
        throw new Error('Ошибка конфигурации ИИ. Обратитесь к администратору.');
      } else if (error.message.includes('quota') || error.message.includes('лимит')) {
        throw new Error('Превышен лимит запросов к ИИ. Попробуйте позже.');
      } else if (error.message.includes('network') || error.message.includes('подключени')) {
        throw new Error('Проблема с подключением к интернету. Проверьте соединение.');
      }
    }
    
    throw new Error('Не удалось получить анализ от ИИ. Попробуйте еще раз через несколько минут.');
  }
}
