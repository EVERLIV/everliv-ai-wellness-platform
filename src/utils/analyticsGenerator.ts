
import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';
import { supabase } from '@/integrations/supabase/client';

export const generateAnalyticsData = async (
  analyses: AnalysisRecord[], 
  chats: ChatRecord[],
  hasHealthProfile: boolean = false,
  healthProfileData?: any
): Promise<CachedAnalytics | null> => {
  
  // Check if we have minimum required data
  if (!hasHealthProfile || !healthProfileData) {
    return null;
  }

  // Используем реальное количество анализов из переданного массива
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
    
    // Проверяем, что получили корректный ответ
    if (!data) {
      console.error('No data received from edge function');
      throw new Error('Нет ответа от сервера');
    }

    // Проверяем структуру ответа - может быть data.analysis или data.healthData
    if (data.analysis) {
      healthAnalysis = data.analysis;
    } else if (data.healthData && data.healthData.overview) {
      // Если получили healthData, извлекаем нужную информацию
      const overview = data.healthData.overview;
      healthAnalysis = {
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
    
    // Дополнительная проверка обязательных полей
    if (typeof healthAnalysis.healthScore !== 'number') {
      console.error('Invalid healthScore in response:', healthAnalysis);
      throw new Error('Некорректный балл здоровья');
    }
    
    // Нормализуем уровень риска
    healthAnalysis.riskLevel = normalizeRiskLevel(healthAnalysis.riskLevel);
    
  } catch (error) {
    console.error('Error analyzing health profile:', error);
    // Возвращаем базовые данные в случае ошибки с реалистичной оценкой риска
    const defaultRiskLevel = calculateDefaultRiskLevel(healthProfileData);
    healthAnalysis = {
      healthScore: calculateDefaultHealthScore(healthProfileData),
      riskLevel: defaultRiskLevel,
      riskDescription: `Базовая оценка здоровья на основе заполненного профиля. Для более точного анализа рекомендуется загрузить результаты анализов.`,
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
  }

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
    healthScore: healthAnalysis.healthScore,
    riskLevel: healthAnalysis.riskLevel,
    riskDescription: healthAnalysis.riskDescription,
    recommendations: healthAnalysis.recommendations || [],
    strengths: healthAnalysis.strengths || [],
    concerns: healthAnalysis.concerns || [],
    scoreExplanation: healthAnalysis.scoreExplanation,
    totalAnalyses,  // Используем реальное количество
    totalConsultations,  // Используем реальное количество
    lastAnalysisDate: analyses[0]?.created_at,
    hasRecentActivity,
    trendsAnalysis: {
      improving: Math.max(1, healthAnalysis.strengths?.length || 1),
      worsening: Math.max(0, healthAnalysis.concerns?.length || 0),
      stable: Math.max(1, 3 - (healthAnalysis.strengths?.length || 0) - (healthAnalysis.concerns?.length || 0))
    },
    recentActivities: recentActivities.slice(0, 4),
    lastUpdated: new Date().toISOString()
  };
};

// Функция для нормализации уровня риска
const normalizeRiskLevel = (riskLevel: string): string => {
  if (!riskLevel) return 'средний';
  
  const level = riskLevel.toLowerCase();
  
  if (level.includes('низк') || level === 'low') return 'низкий';
  if (level.includes('высок') || level === 'high') return 'высокий';
  if (level.includes('средн') || level === 'medium') return 'средний';
  
  return 'средний';
};

// Функция для расчета базового уровня риска на основе профиля
const calculateDefaultRiskLevel = (healthProfile: any): string => {
  let riskFactors = 0;
  
  // Проверяем факторы риска
  if (healthProfile.smokingStatus === 'regular' || healthProfile.smokingStatus === 'occasional') {
    riskFactors += 2;
  }
  
  if (healthProfile.physicalActivity === 'sedentary') {
    riskFactors += 1;
  }
  
  if (healthProfile.alcoholConsumption === 'heavy') {
    riskFactors += 1;
  }
  
  if (healthProfile.sleepHours < 6) {
    riskFactors += 1;
  }
  
  if (healthProfile.stressLevel > 7) {
    riskFactors += 1;
  }
  
  if (healthProfile.age > 50) {
    riskFactors += 1;
  }
  
  // Определяем уровень риска
  if (riskFactors >= 3) return 'высокий';
  if (riskFactors >= 1) return 'средний';
  return 'низкий';
};

// Функция для расчета базового балла здоровья
const calculateDefaultHealthScore = (healthProfile: any): number => {
  let score = 80; // Базовый балл
  
  // Вычитаем за негативные факторы
  if (healthProfile.smokingStatus === 'regular') score -= 15;
  else if (healthProfile.smokingStatus === 'occasional') score -= 8;
  
  if (healthProfile.physicalActivity === 'sedentary') score -= 10;
  else if (healthProfile.physicalActivity === 'light') score -= 5;
  
  if (healthProfile.alcoholConsumption === 'heavy') score -= 10;
  else if (healthProfile.alcoholConsumption === 'moderate') score -= 3;
  
  if (healthProfile.sleepHours < 6) score -= 8;
  else if (healthProfile.sleepHours < 7) score -= 4;
  
  if (healthProfile.stressLevel > 7) score -= 8;
  else if (healthProfile.stressLevel > 5) score -= 4;
  
  // Добавляем за позитивные факторы
  if (healthProfile.exerciseFrequency >= 5) score += 5;
  else if (healthProfile.exerciseFrequency >= 3) score += 3;
  
  if (healthProfile.waterIntake >= 8) score += 3;
  
  return Math.max(30, Math.min(100, score));
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
