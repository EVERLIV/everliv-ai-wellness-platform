import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';
import { EnhancedHealthAnalyzer, EnhancedHealthProfile } from '@/services/health-analytics/enhanced-health-analyzer';
import { generateRecentActivities, checkRecentActivity } from './analytics/activityGenerator';
import { supabase } from '@/integrations/supabase/client';

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
  if (typeof value === 'object' && value?.customValue) {
    return value.customValue;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item?.customValue) {
        return item.customValue;
      }
      return typeof item === 'object' ? item.value || item : item;
    }).filter(Boolean);
  }
  
  if (typeof value === 'object' && value?.value) {
    return value.value;
  }
  
  return value;
};

// Функция анализа биомаркеров для определения трендов
const analyzeBiomarkerTrends = (analyses: AnalysisRecord[]): { improving: number, stable: number, concerning: number } => {
  let improving = 0;
  let stable = 0;
  let concerning = 0;
  
  const biomarkerMap = new Map<string, any[]>();
  
  // Группируем биомаркеры по названиям из всех анализов
  analyses.forEach(analysis => {
    if (analysis.results?.markers && Array.isArray(analysis.results.markers)) {
      analysis.results.markers.forEach((marker: any) => {
        if (marker.name) {
          if (!biomarkerMap.has(marker.name)) {
            biomarkerMap.set(marker.name, []);
          }
          biomarkerMap.get(marker.name)?.push({
            value: marker.value,
            status: marker.status,
            date: analysis.created_at
          });
        }
      });
    }
  });
  
  // Анализируем тренды для каждого биомаркера
  biomarkerMap.forEach((values, markerName) => {
    if (values.length >= 2) {
      // Сортируем по дате
      values.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const latest = values[values.length - 1];
      const previous = values[values.length - 2];
      
      // Анализируем изменение статуса
      if (latest.status === 'optimal' || latest.status === 'good') {
        if (previous.status === 'concerning' || previous.status === 'critical') {
          improving++;
        } else {
          stable++;
        }
      } else if (latest.status === 'concerning' || latest.status === 'critical') {
        concerning++;
      } else {
        stable++;
      }
    } else if (values.length === 1) {
      const marker = values[0];
      if (marker.status === 'optimal' || marker.status === 'good') {
        stable++;
      } else if (marker.status === 'concerning' || marker.status === 'critical') {
        concerning++;
      } else {
        stable++;
      }
    }
  });
  
  return { improving, stable, concerning };
};

// Улучшенная функция расчета детального балла здоровья
const calculateEnhancedHealthScore = async (
  profile: EnhancedHealthProfile, 
  analyses: AnalysisRecord[], 
  userId: string
): Promise<number> => {
  let baseScore = 50;
  let scoreAdjustments = 0;
  
  console.log('Calculating enhanced health score for user:', userId, {
    profileAge: profile.age,
    analysesCount: analyses.length
  });
  
  // Пытаемся получить динамические данные
  try {
    const { data: dynamicScore } = await supabase.rpc('calculate_dynamic_health_score', {
      user_id_param: userId,
      days_back: 7
    });
    
    if (dynamicScore && dynamicScore > 0) {
      console.log('Using dynamic health score:', dynamicScore);
      return Math.round(dynamicScore * 100) / 100;
    }
  } catch (error) {
    console.log('Dynamic score not available, using enhanced static calculation');
  }
  
  // Расчет базового балла с учетом возраста
  if (profile.age <= 25) baseScore += 10;
  else if (profile.age <= 35) baseScore += 5;
  else if (profile.age <= 45) baseScore += 2;
  else if (profile.age <= 55) baseScore -= 2;
  else if (profile.age <= 65) baseScore -= 5;
  else baseScore -= 10;
  
  // Физическая активность (до 15 баллов)
  const activityScore = getActivityScore(profile.physicalActivity, profile.exerciseFrequency);
  scoreAdjustments += activityScore;
  
  // Питание и образ жизни (до 12 баллов)
  const lifestyleScore = getLifestyleScore(profile);
  scoreAdjustments += lifestyleScore;
  
  // Сон (до 10 баллов)
  const sleepScore = getSleepScore(profile.sleepHours);
  scoreAdjustments += sleepScore;
  
  // Стресс (от -8 до +5 баллов)
  const stressScore = getStressScore(profile.stressLevel);
  scoreAdjustments += stressScore;
  
  // Вредные привычки (от -15 до +5 баллов)
  const habitsScore = getHabitsScore(profile.smokingStatus, profile.alcoholConsumption);
  scoreAdjustments += habitsScore;
  
  // Хронические заболевания (до -20 баллов)
  const conditionsScore = getConditionsScore(profile.medicalConditions);
  scoreAdjustments += conditionsScore;
  
  // ИМТ (от -8 до +8 баллов)
  const bmiScore = getBMIScore(profile.height, profile.weight);
  scoreAdjustments += bmiScore;
  
  // Биомаркеры - детальный анализ (до 20 баллов)
  const biomarkersScore = getBiomarkersScore(analyses);
  scoreAdjustments += biomarkersScore;
  
  // Бонус за наличие анализов
  const analysesBonus = Math.min(analyses.length * 2, 10);
  scoreAdjustments += analysesBonus;
  
  const finalScore = Math.max(20, Math.min(100, baseScore + scoreAdjustments));
  
  console.log('Enhanced health score calculation:', {
    baseScore,
    activityScore,
    lifestyleScore,
    sleepScore,
    stressScore,
    habitsScore,
    conditionsScore,
    bmiScore,
    biomarkersScore,
    analysesBonus,
    finalScore
  });
  
  return Math.round(finalScore * 100) / 100;
};

// Функция оценки биомаркеров
const getBiomarkersScore = (analyses: AnalysisRecord[]): number => {
  if (!analyses.length) return 0;
  
  let totalMarkers = 0;
  let optimalMarkers = 0;
  let concerningMarkers = 0;
  let criticalMarkers = 0;
  
  analyses.forEach(analysis => {
    if (analysis.results?.markers && Array.isArray(analysis.results.markers)) {
      analysis.results.markers.forEach((marker: any) => {
        totalMarkers++;
        
        switch (marker.status?.toLowerCase()) {
          case 'optimal':
          case 'good':
            optimalMarkers++;
            break;
          case 'concerning':
          case 'warning':
            concerningMarkers++;
            break;
          case 'critical':
          case 'high':
          case 'low':
            criticalMarkers++;
            break;
        }
      });
    }
  });
  
  if (totalMarkers === 0) return 0;
  
  const optimalRatio = optimalMarkers / totalMarkers;
  const concerningRatio = concerningMarkers / totalMarkers;
  const criticalRatio = criticalMarkers / totalMarkers;
  
  // Расчет балла на основе соотношения
  let score = 0;
  score += optimalRatio * 20; // Максимум 20 баллов за оптимальные показатели
  score -= concerningRatio * 10; // Штраф за проблемные показатели
  score -= criticalRatio * 15; // Больший штраф за критические показатели
  
  return Math.max(-15, Math.min(20, score));
};

// Остальные функции расчета остаются без изменений
const getActivityScore = (physicalActivity: string, exerciseFrequency: number): number => {
  let score = 0;
  
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
  
  if (exerciseFrequency >= 5) score += 3;
  else if (exerciseFrequency >= 3) score += 2;
  else if (exerciseFrequency >= 1) score += 1;
  
  return score;
};

const getLifestyleScore = (profile: EnhancedHealthProfile): number => {
  let score = 0;
  
  if (profile.waterIntake >= 8) score += 3;
  else if (profile.waterIntake >= 6) score += 2;
  else if (profile.waterIntake >= 4) score += 1;
  
  if (profile.mentalHealthScore >= 80) score += 4;
  else if (profile.mentalHealthScore >= 60) score += 2;
  else if (profile.mentalHealthScore >= 40) score += 1;
  else score -= 2;
  
  if (profile.restingHeartRate) {
    if (profile.restingHeartRate >= 60 && profile.restingHeartRate <= 70) score += 3;
    else if (profile.restingHeartRate >= 50 && profile.restingHeartRate <= 80) score += 2;
    else if (profile.restingHeartRate >= 80 && profile.restingHeartRate <= 90) score += 1;
    else score -= 1;
  }
  
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
  return Math.max(-20, -conditions.length * 4);
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
  healthProfileData?: any,
  userId?: string
): Promise<CachedAnalytics | null> => {
  
  if (!hasHealthProfile || !healthProfileData || !userId) {
    return null;
  }

  const totalAnalyses = analyses.length;
  const totalConsultations = chats.length;

  console.log('Generating enhanced analytics with processed data:', {
    totalAnalyses,
    totalConsultations,
    hasHealthProfile,
    profileData: healthProfileData,
    userId
  });

  try {
    const analyzer = new EnhancedHealthAnalyzer();
    
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
    const detailedHealthScore = await calculateEnhancedHealthScore(enhancedProfile, analyses, userId);
    
    // Выполняем расширенный анализ здоровья
    const healthAnalysis = analyzer.calculateEnhancedHealthScore(enhancedProfile, analyses);

    // Анализируем тренды биомаркеров
    const biomarkerTrends = analyzeBiomarkerTrends(analyses);

    // Проверяем недавнюю активность и генерируем список активности
    const hasRecentActivity = checkRecentActivity(analyses);
    const recentActivities = generateRecentActivities(analyses, chats);

    const analytics: CachedAnalytics = {
      healthScore: detailedHealthScore,
      riskLevel: translateRiskLevel(healthAnalysis.riskLevel),
      riskDescription: generateRiskDescription(healthAnalysis, detailedHealthScore),
      recommendations: healthAnalysis.recommendations.slice(0, 5).map(rec => rec.action),
      strengths: healthAnalysis.protectiveFactors.slice(0, 4),
      concerns: healthAnalysis.riskFactors.slice(0, 4),
      scoreExplanation: generateScoreExplanation(detailedHealthScore, enhancedProfile, analyses),
      totalAnalyses,
      totalConsultations,
      lastAnalysisDate: analyses[0]?.created_at,
      hasRecentActivity,
      trendsAnalysis: {
        improving: biomarkerTrends.improving,
        worsening: biomarkerTrends.concerning,
        stable: biomarkerTrends.stable
      },
      recentActivities,
      lastUpdated: new Date().toISOString()
    };

    console.log('Generated enhanced analytics with detailed explanation:', {
      healthScore: analytics.healthScore,
      scoreExplanation: analytics.scoreExplanation,
      biomarkerTrends: analytics.trendsAnalysis
    });
    
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

const generateRiskDescription = (analysis: any, healthScore: number): string => {
  const riskLevel = analysis.riskLevel.toLowerCase();
  
  if (healthScore >= 85) {
    return 'Превосходные показатели здоровья! Вы находитесь в отличной физической форме. Продолжайте поддерживать здоровый образ жизни и регулярно контролируйте показатели.';
  } else if (healthScore >= 75) {
    return 'Очень хорошие показатели здоровья с небольшими возможностями для улучшения. Следуйте персональным рекомендациям для достижения оптимального состояния.';
  } else if (healthScore >= 65) {
    return 'Хорошие показатели здоровья, но есть потенциал для значительного улучшения. Рекомендуется уделить внимание основным факторам риска.';
  } else if (healthScore >= 50) {
    return 'Средние показатели здоровья. Необходимы изменения в образе жизни и регулярный мониторинг здоровья. Рекомендуется консультация со специалистами.';
  } else {
    return 'Показатели здоровья требуют серьезного внимания. Настоятельно рекомендуется незамедлительная консультация с врачом и кардинальные изменения образа жизни.';
  }
};

const generateScoreExplanation = (score: number, profile: EnhancedHealthProfile, analyses: AnalysisRecord[]): string => {
  const factors = [];
  
  // Анализируем ключевые факторы влияющие на балл
  if (profile.age <= 25) factors.push('молодой возраст (+10)');
  else if (profile.age <= 35) factors.push('молодой возраст (+5)');
  else if (profile.age <= 45) factors.push('средний возраст (+2)');
  else if (profile.age <= 55) factors.push('зрелый возраст (-2)');
  else if (profile.age >= 65) factors.push('пожилой возраст (-10)');
  
  // Физическая активность
  switch (profile.physicalActivity?.toLowerCase()) {
    case 'high':
    case 'высокий':
      factors.push('высокая физическая активность (+12)');
      break;
    case 'moderate':
    case 'средний':
      factors.push('умеренная физическая активность (+8)');
      break;
    case 'low':
    case 'низкий':
      factors.push('низкая физическая активность (+3)');
      break;
    case 'sedentary':
    case 'сидячий':
      factors.push('сидячий образ жизни (0)');
      break;
  }
  
  // Сон
  if (profile.sleepHours >= 7 && profile.sleepHours <= 9) {
    factors.push('оптимальный сон (+10)');
  } else if (profile.sleepHours >= 6 && profile.sleepHours <= 10) {
    factors.push('приемлемый сон (+7)');
  } else if (profile.sleepHours < 6) {
    factors.push('недостаток сна (-5)');
  } else {
    factors.push('избыток сна (+1)');
  }
  
  // Стресс
  if (profile.stressLevel <= 3) factors.push('низкий стресс (+5)');
  else if (profile.stressLevel <= 5) factors.push('умеренный стресс (+2)');
  else if (profile.stressLevel <= 7) factors.push('повышенный стресс (-2)');
  else factors.push('высокий стресс (-8)');
  
  // Курение
  switch (profile.smokingStatus?.toLowerCase()) {
    case 'never':
    case 'никогда':
      factors.push('некурящий (+5)');
      break;
    case 'former':
    case 'бросил':
      factors.push('бывший курильщик (+2)');
      break;
    case 'occasionally':
    case 'иногда':
      factors.push('эпизодическое курение (-5)');
      break;
    case 'regularly':
    case 'регулярно':
      factors.push('регулярное курение (-10)');
      break;
  }
  
  // ИМТ
  if (profile.height && profile.weight) {
    const bmi = profile.weight / ((profile.height / 100) ** 2);
    if (bmi >= 18.5 && bmi <= 24.9) factors.push('нормальный ИМТ (+8)');
    else if (bmi >= 25 && bmi <= 29.9) factors.push('избыточный вес (+3)');
    else if (bmi >= 30) factors.push('ожирение (-8)');
    else if (bmi < 18.5) factors.push('недостаточный вес (-5)');
  }
  
  // Хронические заболевания
  if (profile.medicalConditions && profile.medicalConditions.length > 0) {
    factors.push(`хронические заболевания (-${profile.medicalConditions.length * 4})`);
  }
  
  // Биомаркеры
  if (analyses.length > 0) {
    let totalMarkers = 0;
    let optimalMarkers = 0;
    let criticalMarkers = 0;
    
    analyses.forEach(analysis => {
      if (analysis.results?.markers && Array.isArray(analysis.results.markers)) {
        analysis.results.markers.forEach((marker: any) => {
          totalMarkers++;
          if (marker.status?.toLowerCase() === 'optimal' || marker.status?.toLowerCase() === 'good') {
            optimalMarkers++;
          } else if (marker.status?.toLowerCase() === 'critical' || marker.status?.toLowerCase() === 'high' || marker.status?.toLowerCase() === 'low') {
            criticalMarkers++;
          }
        });
      }
    });
    
    if (totalMarkers > 0) {
      const optimalRatio = optimalMarkers / totalMarkers;
      const criticalRatio = criticalMarkers / totalMarkers;
      
      if (optimalRatio >= 0.8) {
        factors.push(`отличные биомаркеры (+${Math.round(optimalRatio * 20)})`);
      } else if (optimalRatio >= 0.6) {
        factors.push(`хорошие биомаркеры (+${Math.round(optimalRatio * 15)})`);
      } else if (criticalRatio >= 0.3) {
        factors.push(`проблемные биомаркеры (-${Math.round(criticalRatio * 15)})`);
      } else {
        factors.push(`смешанные биомаркеры (${Math.round((optimalRatio - criticalRatio) * 10)})`);
      }
      
      factors.push(`${totalMarkers} биомаркеров проанализировано`);
    }
  }
  
  // Ментальное здоровье
  if (profile.mentalHealthScore >= 80) {
    factors.push('отличное ментальное здоровье (+4)');
  } else if (profile.mentalHealthScore >= 60) {
    factors.push('хорошее ментальное здоровье (+2)');
  } else if (profile.mentalHealthScore >= 40) {
    factors.push('среднее ментальное здоровье (+1)');
  } else if (profile.mentalHealthScore < 40) {
    factors.push('проблемы с ментальным здоровьем (-2)');
  }
  
  return `Балл ${score}/100 рассчитан на основе анализа: ${factors.join(', ')}. Базовый балл 50 скорректирован с учетом всех факторов здоровья и образа жизни.`;
};
