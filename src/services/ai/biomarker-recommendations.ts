
import { supabase } from "@/integrations/supabase/client";

interface BiomarkerRecommendationParams {
  biomarkerName: string;
  currentValue: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'optimal' | 'good' | 'attention' | 'risk';
  userId: string;
  previousValue?: string;
  trend?: 'improving' | 'worsening' | 'stable';
}

interface DetailedBiomarkerRecommendation {
  immediateActions: string[];
  lifestyleChanges: string[];
  supplementsToConsider: string[];
  testsToMonitor: string[];
  warningSignsToWatch: string[];
  dietaryRecommendations: string[];
  exerciseRecommendations: string[];
  expectedImprovement: string;
  timeframe: string;
}

export const generateDetailedBiomarkerRecommendation = async (
  params: BiomarkerRecommendationParams
): Promise<DetailedBiomarkerRecommendation | null> => {
  console.log("Generating detailed biomarker recommendation:", params);
  
  // Генерируем рекомендации для всех статусов, кроме оптимального
  if (params.status === 'optimal') {
    return null;
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-biomarker-recommendations', {
      body: {
        biomarkerName: params.biomarkerName,
        currentValue: params.currentValue,
        normalRange: params.normalRange,
        status: params.status,
        userId: params.userId,
        previousValue: params.previousValue,
        trend: params.trend,
        requestDetailed: true
      }
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`Ошибка генерации рекомендаций: ${error.message || 'Неизвестная ошибка'}`);
    }

    if (!data) {
      throw new Error("Не получен ответ от службы генерации рекомендаций");
    }

    if (data.error) {
      throw new Error(`Ошибка ИИ: ${data.error}`);
    }

    console.log("Successfully generated detailed biomarker recommendation:", data);
    return data as DetailedBiomarkerRecommendation;
  } catch (error) {
    console.error("Error generating detailed biomarker recommendation:", error);
    // Возвращаем базовые рекомендации как fallback
    return generateFallbackRecommendations(params);
  }
};

const generateFallbackRecommendations = (params: BiomarkerRecommendationParams): DetailedBiomarkerRecommendation => {
  const recommendations: Record<string, Partial<DetailedBiomarkerRecommendation>> = {
    'Глюкоза': {
      immediateActions: ['Измерьте уровень глюкозы натощак', 'Ограничьте быстрые углеводы'],
      lifestyleChanges: ['Регулярные физические упражнения', 'Контроль веса', 'Режим питания'],
      supplementsToConsider: ['Хром', 'Магний', 'Альфа-липоевая кислота'],
      testsToMonitor: ['HbA1c', 'Инсулин', 'C-пептид'],
      warningSignsToWatch: ['Постоянная жажда', 'Частое мочеиспускание', 'Усталость']
    },
    'Холестерин': {
      immediateActions: ['Сократите насыщенные жиры', 'Увеличьте физическую активность'],
      lifestyleChanges: ['Средиземноморская диета', 'Аэробные тренировки', 'Отказ от курения'],
      supplementsToConsider: ['Омега-3', 'Статины (по назначению врача)', 'Коэнзим Q10'],
      testsToMonitor: ['ЛПНП', 'ЛПВП', 'Триглицериды', 'Аполипопротеин B'],
      warningSignsToWatch: ['Боль в груди', 'Одышка', 'Боль в ногах при ходьбе']
    },
    'Гемоглобин': {
      immediateActions: ['Проверьте уровень железа', 'Увеличьте потребление железосодержащих продуктов'],
      lifestyleChanges: ['Сбалансированное питание', 'Исключение чая/кофе во время еды'],
      supplementsToConsider: ['Железо', 'Витамин C', 'Фолиевая кислота', 'Витамин B12'],
      testsToMonitor: ['Железо', 'Ферритин', 'Трансферрин', 'Витамин B12'],
      warningSignsToWatch: ['Слабость', 'Бледность', 'Головокружение', 'Учащенное сердцебиение']
    }
  };

  const biomarkerKey = Object.keys(recommendations).find(key => 
    params.biomarkerName.toLowerCase().includes(key.toLowerCase())
  );

  const baseRecommendation = biomarkerKey ? recommendations[biomarkerKey] : {};

  return {
    immediateActions: baseRecommendation.immediateActions || ['Консультация с врачом для интерпретации результатов'],
    lifestyleChanges: baseRecommendation.lifestyleChanges || ['Здоровое питание', 'Регулярные физические упражнения'],
    supplementsToConsider: baseRecommendation.supplementsToConsider || ['Мультивитамины (по назначению врача)'],
    testsToMonitor: baseRecommendation.testsToMonitor || ['Повторный анализ через 1-3 месяца'],
    warningSignsToWatch: baseRecommendation.warningSignsToWatch || ['Ухудшение самочувствия'],
    dietaryRecommendations: ['Сбалансированное питание', 'Ограничение обработанных продуктов'],
    exerciseRecommendations: ['Умеренная физическая активность 150 минут в неделю'],
    expectedImprovement: 'Улучшение показателей в течение 4-8 недель при соблюдении рекомендаций',
    timeframe: '4-8 недель'
  };
};

export const generateBiomarkerRecommendation = async (
  params: BiomarkerRecommendationParams
): Promise<any | null> => {
  return generateDetailedBiomarkerRecommendation(params);
};
