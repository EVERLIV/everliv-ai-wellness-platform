
export interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'stress' | 'supplements';
  priority: 'high' | 'medium' | 'low';
  scientificBasis: string;
  specificActions: string[];
}

export interface CategoryColors {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
}
