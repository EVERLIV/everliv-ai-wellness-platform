
import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';
import { supabase } from '@/integrations/supabase/client';
// Simple fallback calculations
const normalizeRiskLevel = (riskLevel: string): string => {
  if (!riskLevel || riskLevel === 'unknown') return 'средний';
  const level = riskLevel.toLowerCase().trim();
  if (level.includes('низк') || level === 'low') return 'низкий';
  if (level.includes('высок') || level === 'high') return 'высокий';
  return 'средний';
};

const calculateDefaultRiskLevel = (healthProfile: any): string => {
  let riskFactors = 0;
  if (healthProfile.smokingStatus === 'regular') riskFactors += 2;
  if (healthProfile.physicalActivity === 'sedentary') riskFactors += 1;
  if (healthProfile.stressLevel > 7) riskFactors += 1;
  if (riskFactors >= 3) return 'высокий';
  if (riskFactors >= 1) return 'средний';
  return 'низкий';
};

const calculateDefaultHealthScore = (healthProfile: any): number => {
  let score = 80;
  if (healthProfile.smokingStatus === 'regular') score -= 15;
  if (healthProfile.physicalActivity === 'sedentary') score -= 10;
  if (healthProfile.stressLevel > 7) score -= 8;
  return Math.max(30, Math.min(100, score));
};
import { generateRecentActivities, checkRecentActivity } from './analytics/activityGenerator';

export const generateAnalyticsData = async (
  analyses: AnalysisRecord[], 
  chats: ChatRecord[],
  hasHealthProfile: boolean = false,
  healthProfileData?: any
): Promise<CachedAnalytics | null> => {
  
  if (!hasHealthProfile || !healthProfileData) {
    return null;
  }

  const totalAnalyses = analyses.length;
  const totalConsultations = chats.length;

  console.log('Generating analytics with real data:', {
    totalAnalyses,
    totalConsultations,
    hasHealthProfile
  });

  // Анализируем профиль здоровья через edge-функцию
  let healthAnalysis;
  try {
    const { data, error } = await supabase.functions.invoke('generate-health-analytics', {
      body: {
        healthProfile: healthProfileData,
        analyses: analyses,
        chats: chats
      }
    });

    console.log('Edge function response:', { data, error });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data received from edge function');
      throw new Error('Нет ответа от сервера');
    }

    // Обрабатываем ответ от edge-функции
    healthAnalysis = processEdgeFunctionResponse(data);
    
  } catch (error) {
    console.error('Error analyzing health profile:', error);
    // Возвращаем базовые данные в случае ошибки
    healthAnalysis = generateFallbackHealthAnalysis(healthProfileData);
  }

  // Проверяем недавнюю активность и генерируем список активности
  const hasRecentActivity = checkRecentActivity(analyses);
  const recentActivities = generateRecentActivities(analyses, chats);

  return {
    healthScore: healthAnalysis.healthScore,
    riskLevel: healthAnalysis.riskLevel,
    riskDescription: healthAnalysis.riskDescription,
    recommendations: healthAnalysis.recommendations || [],
    strengths: healthAnalysis.strengths || [],
    concerns: healthAnalysis.concerns || [],
    scoreExplanation: healthAnalysis.scoreExplanation,
    totalAnalyses,
    totalConsultations,
    lastAnalysisDate: analyses[0]?.created_at,
    hasRecentActivity,
    trendsAnalysis: {
      improving: Math.max(1, healthAnalysis.strengths?.length || 1),
      worsening: Math.max(0, healthAnalysis.concerns?.length || 0),
      stable: Math.max(1, 3 - (healthAnalysis.strengths?.length || 0) - (healthAnalysis.concerns?.length || 0))
    },
    recentActivities,
    lastUpdated: new Date().toISOString()
  };
};

const processEdgeFunctionResponse = (data: any) => {
  // Проверяем структуру ответа
  if (data.analysis) {
    const analysis = data.analysis;
    // Принудительно нормализуем уровень риска
    analysis.riskLevel = normalizeRiskLevel(analysis.riskLevel);
    
    // Дополнительная проверка обязательных полей
    if (typeof analysis.healthScore !== 'number') {
      console.error('Invalid healthScore in response:', analysis);
      throw new Error('Некорректный балл здоровья');
    }
    
    return analysis;
  } else if (data.healthData && data.healthData.overview) {
    // Если получили healthData, извлекаем нужную информацию
    const overview = data.healthData.overview;
    return {
      healthScore: overview.healthScore || 50,
      riskLevel: normalizeRiskLevel(overview.riskLevel || 'medium'),
      riskDescription: `Анализ показывает ${overview.riskLevel === 'low' ? 'низкий' : overview.riskLevel === 'medium' ? 'средний' : 'высокий'} уровень риска`,
      recommendations: data.healthData.lifestyleRecommendations?.slice(0, 3)?.map((rec: any) => 
        rec.recommendations?.[0]?.advice || rec.category
      ) || [
        'Поддерживайте регулярную физическую активность',
        'Соблюдайте сбалансированное питание',
        'Обеспечьте качественный сон'
      ],
      strengths: [
        'Ваши анализы в норме',
        'Активно следите за здоровьем',
        'Регулярно проходите обследования'
      ],
      concerns: data.healthData.riskFactors?.slice(0, 2) || [],
      scoreExplanation: `Оценка ${overview.healthScore}/100 основана на анализе вашего профиля здоровья и данных обследований`
    };
  } else {
    console.error('Invalid response structure:', data);
    throw new Error('Некорректная структура ответа от сервера');
  }
};

const generateFallbackHealthAnalysis = (healthProfileData: any) => {
  const defaultRiskLevel = calculateDefaultRiskLevel(healthProfileData);
  return {
    healthScore: calculateDefaultHealthScore(healthProfileData),
    riskLevel: defaultRiskLevel,
    riskDescription: `Базовая оценка здоровья на основе заполненного профиля. Уровень риска: ${defaultRiskLevel}.`,
    recommendations: [
      'Регулярно проходите медицинские обследования',
      'Поддерживайте активный образ жизни',
      'Следите за качеством питания и сна',
      'Управляйте уровнем стресса'
    ],
    strengths: [
      'Вы проактивно заботитесь о своем здоровье',
      'Ведете мониторинг показателей здоровья'
    ],
    concerns: [
      'Рекомендуется загрузить результаты анализов для более точной оценки'
    ],
    scoreExplanation: 'Базовая оценка рассчитана на основе данных профиля здоровья. Загрузите анализы для получения детального анализа.'
  };
};
