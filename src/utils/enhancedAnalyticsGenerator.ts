
import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedHealthAnalyzer, EnhancedHealthProfile } from '@/services/health-analytics/enhanced-health-analyzer';

export const generateEnhancedAnalytics = async (
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

  console.log('Generating enhanced analytics with:', {
    totalAnalyses,
    totalConsultations,
    hasHealthProfile
  });

  try {
    const analyzer = new EnhancedHealthAnalyzer();
    
    // Преобразуем данные профиля в формат для анализатора
    const enhancedProfile: EnhancedHealthProfile = {
      age: calculateAge(healthProfileData.dateOfBirth) || 30,
      gender: healthProfileData.gender || 'not_specified',
      height: parseFloat(healthProfileData.height) || 170,
      weight: parseFloat(healthProfileData.weight) || 70,
      smokingStatus: healthProfileData.smokingStatus || 'never',
      physicalActivity: healthProfileData.physicalActivity || 'moderate',
      alcoholConsumption: healthProfileData.alcoholConsumption || 'none',
      sleepHours: parseFloat(healthProfileData.sleepHours) || 8,
      stressLevel: parseFloat(healthProfileData.stressLevel) || 5,
      exerciseFrequency: parseFloat(healthProfileData.exerciseFrequency) || 3,
      waterIntake: parseFloat(healthProfileData.waterIntake) || 8,
      medicalConditions: healthProfileData.chronicDiseases || [],
      familyHistory: healthProfileData.familyHistory || [],
      allergies: healthProfileData.allergies || [],
      medications: healthProfileData.medications || [],
      bloodPressure: healthProfileData.bloodPressure ? {
        systolic: healthProfileData.bloodPressure.systolic,
        diastolic: healthProfileData.bloodPressure.diastolic
      } : undefined,
      restingHeartRate: healthProfileData.restingHeartRate,
      mentalHealthScore: healthProfileData.mentalHealthScore || 70
    };

    // Выполняем расширенный анализ здоровья
    const healthAnalysis = analyzer.calculateEnhancedHealthScore(enhancedProfile, analyses);

    // Проверяем недавнюю активность
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const hasRecentActivity = analyses.some(analysis => 
      new Date(analysis.created_at) > weekAgo
    );

    // Генерируем список активности
    const recentActivities: Array<{
      title: string;
      time: string;
      icon: string;
      iconColor: string;
      iconBg: string;
    }> = [];

    // Добавляем анализы
    analyses.slice(0, 3).forEach(analysis => {
      const timeAgo = getTimeAgo(analysis.created_at);
      recentActivities.push({
        title: `Анализ крови загружен`,
        time: timeAgo,
        icon: 'FileText',
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50'
      });
    });

    // Добавляем чаты
    chats.slice(0, 2).forEach(chat => {
      const timeAgo = getTimeAgo(chat.created_at);
      recentActivities.push({
        title: 'Консультация с ИИ-доктором',
        time: timeAgo,
        icon: 'MessageSquare',
        iconColor: 'text-green-500',
        iconBg: 'bg-green-50'
      });
    });

    // Сортируем по времени
    recentActivities.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    });

    return {
      healthScore: healthAnalysis.totalScore,
      riskLevel: healthAnalysis.riskLevel,
      riskDescription: generateRiskDescription(healthAnalysis),
      recommendations: healthAnalysis.recommendations.slice(0, 5).map(rec => rec.action),
      strengths: healthAnalysis.protectiveFactors.slice(0, 4),
      concerns: healthAnalysis.riskFactors.slice(0, 4),
      scoreExplanation: generateScoreExplanation(healthAnalysis),
      totalAnalyses,
      totalConsultations,
      lastAnalysisDate: analyses[0]?.created_at,
      hasRecentActivity,
      trendsAnalysis: {
        improving: Math.max(1, healthAnalysis.protectiveFactors.length),
        worsening: Math.max(0, healthAnalysis.riskFactors.length),
        stable: Math.max(1, 5 - healthAnalysis.protectiveFactors.length - healthAnalysis.riskFactors.length)
      },
      recentActivities: recentActivities.slice(0, 4),
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in enhanced analytics generation:', error);
    // Возвращаем базовые данные в случае ошибки
    return generateFallbackAnalytics(analyses, chats, healthProfileData);
  }
};

const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const generateRiskDescription = (analysis: any): string => {
  const { riskLevel, riskFactors } = analysis;
  
  if (riskLevel === 'критический') {
    return `Обнаружены серьезные факторы риска, требующие немедленного медицинского внимания. Основные проблемы: ${riskFactors.slice(0, 2).join(', ')}.`;
  } else if (riskLevel === 'высокий') {
    return `Выявлены значимые факторы риска для здоровья. Рекомендуется консультация с врачом и корректировка образа жизни.`;
  } else if (riskLevel === 'средний') {
    return `Ваше здоровье в целом стабильно, но есть области для улучшения. Профилактические меры помогут снизить риски.`;
  } else {
    return `Отличные показатели здоровья! Продолжайте поддерживать здоровый образ жизни.`;
  }
};

const generateScoreExplanation = (analysis: any): string => {
  const { breakdown, totalScore } = analysis;
  
  let explanation = `Ваш балл здоровья ${totalScore}/100 рассчитан на основе комплексного анализа: `;
  
  const factors = [];
  if (breakdown.lifestyleScore !== 0) {
    factors.push(`образ жизни (${breakdown.lifestyleScore > 0 ? '+' : ''}${breakdown.lifestyleScore})`);
  }
  if (breakdown.medicalConditionsImpact !== 0) {
    factors.push(`медицинские состояния (${breakdown.medicalConditionsImpact})`);
  }
  if (breakdown.familyHistoryImpact !== 0) {
    factors.push(`семейная история (${breakdown.familyHistoryImpact})`);
  }
  if (breakdown.labResultsScore !== 0) {
    factors.push(`лабораторные показатели (${breakdown.labResultsScore > 0 ? '+' : ''}${breakdown.labResultsScore})`);
  }
  if (breakdown.ageAdjustment !== 0) {
    factors.push(`возрастная корректировка (${breakdown.ageAdjustment > 0 ? '+' : ''}${breakdown.ageAdjustment})`);
  }
  
  explanation += factors.join(', ') + '.';
  
  return explanation;
};

const generateFallbackAnalytics = (analyses: any[], chats: any[], healthProfileData: any): CachedAnalytics => {
  return {
    healthScore: 65,
    riskLevel: 'средний',
    riskDescription: 'Базовая оценка на основе заполненного профиля здоровья.',
    recommendations: [
      'Регулярно проходите медицинские обследования',
      'Поддерживайте активный образ жизни',
      'Следите за качеством питания и сна'
    ],
    strengths: ['Ведете мониторинг здоровья'],
    concerns: ['Загрузите анализы для более точной оценки'],
    scoreExplanation: 'Базовая оценка рассчитана на основе данных профиля здоровья.',
    totalAnalyses: analyses.length,
    totalConsultations: chats.length,
    lastAnalysisDate: analyses[0]?.created_at,
    hasRecentActivity: false,
    trendsAnalysis: { improving: 1, worsening: 1, stable: 3 },
    recentActivities: [],
    lastUpdated: new Date().toISOString()
  };
};

export const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин назад`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ч назад`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} дн назад`;
  }
};

export const parseTimeAgo = (timeStr: string): number => {
  if (timeStr.includes('мин')) {
    return parseInt(timeStr);
  } else if (timeStr.includes('ч')) {
    return parseInt(timeStr) * 60;
  } else if (timeStr.includes('дн')) {
    return parseInt(timeStr) * 1440;
  }
  return 0;
};
