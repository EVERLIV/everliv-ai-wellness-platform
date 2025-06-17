
import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';
import { EnhancedHealthAnalyzer, EnhancedHealthProfile } from '@/services/health-analytics/enhanced-health-analyzer';
import { generateRecentActivities, checkRecentActivity } from './analytics/activityGenerator';

const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 30;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age > 0 ? age : 30;
};

const processHealthProfileValue = (value: any): any => {
  // Если значение - это объект с полем customValue, возвращаем его
  if (typeof value === 'object' && value?.customValue) {
    return value.customValue;
  }
  
  // Если значение - это массив, обрабатываем каждый элемент
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item?.customValue) {
        return item.customValue;
      }
      return typeof item === 'object' ? item.value || item : item;
    }).filter(Boolean);
  }
  
  // Если это объект с полем value, возвращаем его
  if (typeof value === 'object' && value?.value) {
    return value.value;
  }
  
  return value;
};

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

  console.log('Generating enhanced analytics with processed data:', {
    totalAnalyses,
    totalConsultations,
    hasHealthProfile,
    profileData: healthProfileData
  });

  try {
    const analyzer = new EnhancedHealthAnalyzer();
    
    // Обрабатываем данные профиля и преобразуем их в нужный формат
    const enhancedProfile: EnhancedHealthProfile = {
      age: calculateAge(healthProfileData.dateOfBirth) || 30,
      gender: processHealthProfileValue(healthProfileData.gender) || 'not_specified',
      height: parseFloat(healthProfileData.height) || 170,
      weight: parseFloat(healthProfileData.weight) || 70,
      smokingStatus: processHealthProfileValue(healthProfileData.smokingStatus) || 'never',
      physicalActivity: processHealthProfileValue(healthProfileData.physicalActivity) || 'moderate',
      alcoholConsumption: processHealthProfileValue(healthProfileData.alcoholConsumption) || 'none',
      sleepHours: parseFloat(healthProfileData.sleepHours) || 8,
      stressLevel: parseFloat(healthProfileData.stressLevel) || 5,
      exerciseFrequency: parseFloat(healthProfileData.exerciseFrequency) || 3,
      waterIntake: parseFloat(healthProfileData.waterIntake) || 8,
      medicalConditions: processHealthProfileValue(healthProfileData.chronicConditions) || [],
      familyHistory: processHealthProfileValue(healthProfileData.familyHistory) || [],
      allergies: processHealthProfileValue(healthProfileData.allergies) || [],
      medications: processHealthProfileValue(healthProfileData.medications) || [],
      bloodPressure: healthProfileData.bloodPressure ? {
        systolic: healthProfileData.bloodPressure.systolic,
        diastolic: healthProfileData.bloodPressure.diastolic
      } : undefined,
      restingHeartRate: healthProfileData.restingHeartRate,
      mentalHealthScore: healthProfileData.mentalHealthScore || 70
    };

    console.log('Processed enhanced profile:', enhancedProfile);

    // Выполняем расширенный анализ здоровья
    const healthAnalysis = analyzer.calculateEnhancedHealthScore(enhancedProfile, analyses);

    // Проверяем недавнюю активность и генерируем список активности
    const hasRecentActivity = checkRecentActivity(analyses);
    const recentActivities = generateRecentActivities(analyses, chats);

    const analytics: CachedAnalytics = {
      healthScore: healthAnalysis.totalScore,
      riskLevel: translateRiskLevel(healthAnalysis.riskLevel),
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
      recentActivities,
      lastUpdated: new Date().toISOString()
    };

    console.log('Generated analytics:', analytics);
    return analytics;

  } catch (error) {
    console.error('Error in generateEnhancedAnalytics:', error);
    return null;
  }
};

const translateRiskLevel = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'high': return 'высокий';
    case 'medium': return 'средний';
    case 'low': return 'низкий';
    default: return level;
  }
};

const generateRiskDescription = (analysis: any): string => {
  const riskLevel = analysis.riskLevel.toLowerCase();
  
  if (riskLevel === 'high') {
    return 'Обнаружены показатели, требующие внимания. Рекомендуется консультация с врачом.';
  } else if (riskLevel === 'medium') {
    return 'Некоторые показатели могут быть улучшены. Следуйте рекомендациям для оптимизации здоровья.';
  } else {
    return 'Большинство показателей в норме. Продолжайте поддерживать здоровый образ жизни.';
  }
};

const generateScoreExplanation = (analysis: any): string => {
  const score = analysis.totalScore;
  
  if (score >= 80) {
    return 'Отличные показатели здоровья! Вы находитесь в хорошей форме.';
  } else if (score >= 60) {
    return 'Хорошие показатели с потенциалом для улучшения.';
  } else if (score >= 40) {
    return 'Средние показатели. Есть области для значительного улучшения.';
  } else {
    return 'Низкие показатели. Рекомендуется обратиться к врачу для детального обследования.';
  }
};
