
import { CachedAnalytics } from "@/types/analytics";

// Утилита для обеспечения согласованности данных аналитики
export const ensureAnalyticsConsistency = (analytics: CachedAnalytics): CachedAnalytics => {
  return {
    ...analytics,
    // Обеспечиваем, что балл здоровья всегда число с точностью до 2 знаков
    healthScore: typeof analytics.healthScore === 'number' 
      ? Math.round(analytics.healthScore * 100) / 100 
      : 0,
    
    // Обеспечиваем корректный перевод уровня риска
    riskLevel: translateRiskLevel(analytics.riskLevel),
    
    // Обеспечиваем наличие всех необходимых полей
    totalAnalyses: analytics.totalAnalyses || 0,
    totalConsultations: analytics.totalConsultations || 0,
    recommendations: analytics.recommendations || [],
    strengths: analytics.strengths || [],
    concerns: analytics.concerns || [],
    trendsAnalysis: analytics.trendsAnalysis || {
      improving: 0,
      worsening: 0,
      stable: 0
    },
    recentActivities: analytics.recentActivities || [],
    lastUpdated: analytics.lastUpdated || new Date().toISOString()
  };
};

const translateRiskLevel = (level: string): string => {
  if (!level) return 'неизвестный';
  
  switch (level.toLowerCase()) {
    case 'high':
    case 'высокий':
      return 'высокий';
    case 'medium':
    case 'средний':
      return 'средний';
    case 'low':
    case 'низкий':
      return 'низкий';
    default:
      return level;
  }
};

// Функция для логирования различий в данных аналитики
export const logAnalyticsDifferences = (
  source: string, 
  analytics: CachedAnalytics, 
  userId: string
) => {
  console.log(`[Analytics ${source}] User: ${userId}`, {
    healthScore: analytics.healthScore,
    riskLevel: analytics.riskLevel,
    totalAnalyses: analytics.totalAnalyses,
    totalConsultations: analytics.totalConsultations,
    lastUpdated: analytics.lastUpdated,
    hasRecommendations: analytics.recommendations?.length > 0,
    hasStrengths: analytics.strengths?.length > 0,
    hasConcerns: analytics.concerns?.length > 0
  });
};
