export interface HealthInsight {
  id: string;
  category: 'predictive' | 'practical' | 'personalized';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  scientificBasis: string;
  actionItems: string[];
  timeframe: string;
  riskFactors?: string[];
  benefits?: string[];
}

export interface HealthInsightsResponse {
  success: boolean;
  insights: HealthInsight[];
  profileData: {
    age: number | null;
    bmi: number | null;
    lastAnalysis: string | null;
  };
  error?: string;
}

export type InsightCategory = 'predictive' | 'practical' | 'personalized';

export const getCategoryTitle = (category: InsightCategory): string => {
  const titles = {
    predictive: 'Прогнозная аналитика',
    practical: 'Практические рекомендации',
    personalized: 'Персонализированные рекомендации'
  };
  return titles[category];
};

export const getCategoryDescription = (category: InsightCategory): string => {
  const descriptions = {
    predictive: 'Анализ рисков и прогнозирование будущих проблем со здоровьем',
    practical: 'Конкретные действия для улучшения показателей здоровья',
    personalized: 'Индивидуальные советы на основе вашего уникального профиля'
  };
  return descriptions[category];
};

export const getCategoryIcon = (category: InsightCategory): string => {
  const icons = {
    predictive: 'TrendingUp',
    practical: 'Target', 
    personalized: 'User'
  };
  return icons[category];
};

export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  const colors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  return colors[priority];
};

export const getPriorityLabel = (priority: 'high' | 'medium' | 'low'): string => {
  const labels = {
    high: 'Высокий приоритет',
    medium: 'Средний приоритет',
    low: 'Низкий приоритет'
  };
  return labels[priority];
};