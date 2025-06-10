
import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';

export const generateAnalyticsData = async (
  analyses: AnalysisRecord[], 
  chats: ChatRecord[]
): Promise<CachedAnalytics> => {
  const totalAnalyses = analyses.length;
  const totalConsultations = chats.length;

  // Определяем уровень риска
  let riskLevel = 'low';
  let totalRiskMarkers = 0;
  let totalOptimalMarkers = 0;
  let totalMarkers = 0;

  if (analyses.length > 0) {
    const latestAnalysis = analyses[0];
    const results = latestAnalysis.results;
    
    if (results?.riskLevel) {
      riskLevel = results.riskLevel;
    } else if (results?.markers) {
      analyses.forEach(analysis => {
        if (analysis.results?.markers) {
          analysis.results.markers.forEach((marker) => {
            totalMarkers++;
            if (marker.status === 'optimal' || marker.status === 'good') {
              totalOptimalMarkers++;
            } else if (marker.status === 'attention' || marker.status === 'risk' || marker.status === 'high' || marker.status === 'low') {
              totalRiskMarkers++;
            }
          });
        }
      });

      const riskPercentage = totalMarkers > 0 ? totalRiskMarkers / totalMarkers : 0;
      if (riskPercentage >= 0.5) riskLevel = 'high';
      else if (riskPercentage >= 0.2) riskLevel = 'medium';
    }
  }

  // Вычисляем индекс здоровья
  const healthScore = totalMarkers > 0 ? Math.round((totalOptimalMarkers / totalMarkers) * 100) : 75;

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
      title: `Анализ загружен`,
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
    healthScore,
    riskLevel,
    totalAnalyses,
    totalConsultations,
    lastAnalysisDate: analyses[0]?.created_at,
    hasRecentActivity,
    trendsAnalysis: {
      improving: Math.max(1, Math.floor(totalOptimalMarkers * 0.6)),
      worsening: Math.max(0, Math.floor(totalRiskMarkers * 0.4)),
      stable: Math.max(1, totalMarkers - Math.floor(totalOptimalMarkers * 0.6) - Math.floor(totalRiskMarkers * 0.4))
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
