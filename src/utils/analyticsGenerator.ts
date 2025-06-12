import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';
import { analyzeHealthProfile } from '@/services/ai/health-profile-analysis';

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

  const totalAnalyses = analyses.length;
  const totalConsultations = chats.length;

  // Анализируем профиль здоровья с помощью ИИ
  let healthAnalysis;
  try {
    healthAnalysis = await analyzeHealthProfile(healthProfileData);
  } catch (error) {
    console.error('Error analyzing health profile:', error);
    // Возвращаем базовые данные в случае ошибки
    healthAnalysis = {
      healthScore: 50,
      riskLevel: 'средний',
      riskDescription: 'Ошибка анализа профиля здоровья',
      recommendations: [],
      strengths: [],
      concerns: []
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
    recommendations: healthAnalysis.recommendations,
    strengths: healthAnalysis.strengths,
    concerns: healthAnalysis.concerns,
    totalAnalyses,
    totalConsultations,
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
