
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

// Улучшенная функция расчета детального балла здоровья
const calculateDetailedHealthScore = (profile: EnhancedHealthProfile, analyses: AnalysisRecord[]): number => {
  let baseScore = 50; // Базовый балл
  let scoreAdjustments = 0;
  
  // Физическая активность (0-15 баллов)
  const activityScore = getActivityScore(profile.physicalActivity, profile.exerciseFrequency);
  scoreAdjustments += activityScore;
  
  // Питание и образ жизни (0-12 баллов)
  const lifestyleScore = getLifestyleScore(profile);
  scoreAdjustments += lifestyleScore;
  
  // Сон (0-10 баллов)
  const sleepScore = getSleepScore(profile.sleepHours);
  scoreAdjustments += sleepScore;
  
  // Стресс (влияет на -8 до +5 баллов)
  const stressScore = getStressScore(profile.stressLevel);
  scoreAdjustments += stressScore;
  
  // Вредные привычки (-15 до +5 баллов)
  const habitsScore = getHabitsScore(profile.smokingStatus, profile.alcoholConsumption);
  scoreAdjustments += habitsScore;
  
  // Хронические заболевания (-20 до 0 баллов)
  const conditionsScore = getConditionsScore(profile.medicalConditions);
  scoreAdjustments += conditionsScore;
  
  // Возраст (влияет на общий балл)
  const ageScore = getAgeScore(profile.age);
  scoreAdjustments += ageScore;
  
  // ИМТ (влияет на -8 до +8 баллов)
  const bmiScore = getBMIScore(profile.height, profile.weight);
  scoreAdjustments += bmiScore;
  
  // Анализы крови (0-15 баллов бонуса за наличие)
  const analysesBonus = Math.min(analyses.length * 2.5, 15);
  scoreAdjustments += analysesBonus;
  
  const finalScore = Math.max(0, Math.min(100, baseScore + scoreAdjustments));
  
  // Возвращаем с точностью до 2 знаков после запятой
  return Math.round(finalScore * 100) / 100;
};

const getActivityScore = (physicalActivity: string, exerciseFrequency: number): number => {
  let score = 0;
  
  // Базовый балл за уровень активности
  switch (physicalActivity?.toLowerCase()) {
    case 'high':
    case 'высокий':
      score += 12;
      break;
    case 'moderate':
    case 'средний':
      score += 8;
      break;
    case 'low':
    case 'низкий':
      score += 3;
      break;
    case 'sedentary':
    case 'сидячий':
      score += 0;
      break;
    default:
      score += 5;
  }
  
  // Дополнительные баллы за частоту упражнений
  if (exerciseFrequency >= 5) score += 3;
  else if (exerciseFrequency >= 3) score += 2;
  else if (exerciseFrequency >= 1) score += 1;
  
  return score;
};

const getLifestyleScore = (profile: EnhancedHealthProfile): number => {
  let score = 0;
  
  // Потребление воды
  if (profile.waterIntake >= 8) score += 3;
  else if (profile.waterIntake >= 6) score += 2;
  else if (profile.waterIntake >= 4) score += 1;
  
  // Психическое здоровье
  if (profile.mentalHealthScore >= 80) score += 4;
  else if (profile.mentalHealthScore >= 60) score += 2;
  else if (profile.mentalHealthScore >= 40) score += 1;
  else score -= 2;
  
  // Пульс в покое
  if (profile.restingHeartRate) {
    if (profile.restingHeartRate >= 60 && profile.restingHeartRate <= 70) score += 3;
    else if (profile.restingHeartRate >= 50 && profile.restingHeartRate <= 80) score += 2;
    else if (profile.restingHeartRate >= 80 && profile.restingHeartRate <= 90) score += 1;
    else score -= 1;
  }
  
  // Давление
  if (profile.bloodPressure) {
    const systolic = profile.bloodPressure.systolic;
    const diastolic = profile.bloodPressure.diastolic;
    
    if (systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80) {
      score += 2;
    } else if (systolic <= 140 && diastolic <= 90) {
      score += 1;
    } else {
      score -= 2;
    }
  }
  
  return score;
};

const getSleepScore = (sleepHours: number): number => {
  if (sleepHours >= 7 && sleepHours <= 9) return 10;
  if (sleepHours >= 6 && sleepHours <= 10) return 7;
  if (sleepHours >= 5 && sleepHours <= 11) return 4;
  return 1;
};

const getStressScore = (stressLevel: number): number => {
  if (stressLevel <= 3) return 5;
  if (stressLevel <= 5) return 2;
  if (stressLevel <= 7) return -2;
  return -8;
};

const getHabitsScore = (smoking: string, alcohol: string): number => {
  let score = 0;
  
  // Курение
  switch (smoking?.toLowerCase()) {
    case 'never':
    case 'никогда':
      score += 5;
      break;
    case 'former':
    case 'бросил':
      score += 2;
      break;
    case 'occasionally':
    case 'иногда':
      score -= 5;
      break;
    case 'regularly':
    case 'регулярно':
      score -= 10;
      break;
    default:
      score += 0;
  }
  
  // Алкоголь
  switch (alcohol?.toLowerCase()) {
    case 'none':
    case 'никогда':
      score += 0;
      break;
    case 'rarely':
    case 'редко':
      score += 0;
      break;
    case 'moderately':
    case 'умеренно':
      score -= 2;
      break;
    case 'frequently':
    case 'часто':
      score -= 5;
      break;
    default:
      score += 0;
  }
  
  return score;
};

const getConditionsScore = (conditions: string[]): number => {
  if (!conditions || conditions.length === 0) return 0;
  
  // Штраф за каждое хроническое заболевание
  return Math.max(-20, -conditions.length * 4);
};

const getAgeScore = (age: number): number => {
  if (age <= 25) return 2;
  if (age <= 35) return 1;
  if (age <= 45) return 0;
  if (age <= 55) return -1;
  if (age <= 65) return -2;
  return -3;
};

const getBMIScore = (height: number, weight: number): number => {
  if (!height || !weight) return 0;
  
  const bmi = weight / ((height / 100) ** 2);
  
  if (bmi >= 18.5 && bmi <= 24.9) return 8;
  if (bmi >= 25 && bmi <= 29.9) return 3;
  if (bmi >= 17 && bmi <= 17.9) return 2;
  if (bmi >= 30 && bmi <= 34.9) return -3;
  if (bmi >= 35) return -8;
  return -5;
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

    // Используем улучшенный расчет балла здоровья
    const detailedHealthScore = calculateDetailedHealthScore(enhancedProfile, analyses);
    
    // Выполняем расширенный анализ здоровья
    const healthAnalysis = analyzer.calculateEnhancedHealthScore(enhancedProfile, analyses);

    // Проверяем недавнюю активность и генерируем список активности
    const hasRecentActivity = checkRecentActivity(analyses);
    const recentActivities = generateRecentActivities(analyses, chats);

    const analytics: CachedAnalytics = {
      healthScore: detailedHealthScore, // Используем детальный балл
      riskLevel: translateRiskLevel(healthAnalysis.riskLevel),
      riskDescription: generateRiskDescription(healthAnalysis),
      recommendations: healthAnalysis.recommendations.slice(0, 5).map(rec => rec.action),
      strengths: healthAnalysis.protectiveFactors.slice(0, 4),
      concerns: healthAnalysis.riskFactors.slice(0, 4),
      scoreExplanation: generateScoreExplanation(detailedHealthScore),
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

    console.log('Generated analytics with detailed score:', analytics);
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

const generateScoreExplanation = (score: number): string => {
  if (score >= 80) {
    return `Отличные показатели здоровья! Ваш балл ${score} указывает на высокий уровень здоровья.`;
  } else if (score >= 60) {
    return `Хорошие показатели с потенциалом для улучшения. Балл ${score} показывает стабильное состояние здоровья.`;
  } else if (score >= 40) {
    return `Средние показатели. Балл ${score} указывает на необходимость улучшения образа жизни.`;
  } else {
    return `Низкие показатели. Балл ${score} требует внимания к состоянию здоровья и консультации с врачом.`;
  }
};
