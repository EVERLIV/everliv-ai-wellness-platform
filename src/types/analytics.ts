
export interface CachedAnalytics {
  healthScore: number;
  riskLevel: string;
  riskDescription?: string;
  recommendations?: string[];
  strengths?: string[];
  concerns?: string[];
  scoreExplanation?: string;
  totalAnalyses: number;
  totalConsultations: number;
  lastAnalysisDate?: string;
  hasRecentActivity: boolean;
  trendsAnalysis: {
    improving: number;
    worsening: number;
    stable: number;
  };
  recentActivities: Array<{
    title: string;
    time: string;
    icon: string;
    iconColor: string;
    iconBg: string;
  }>;
  lastUpdated: string;
  [key: string]: any; // Add index signature for JSON compatibility
}

export interface AnalysisRecord {
  created_at: string;
  results?: {
    riskLevel?: string;
    markers?: Array<{
      name: string;
      value: number | string;
      unit: string;
      status: 'optimal' | 'good' | 'attention' | 'risk' | 'high' | 'low';
    }>;
  };
  [key: string]: any; // Add index signature for flexibility
}

export interface ChatRecord {
  created_at: string;
  title: string;
  [key: string]: any; // Add index signature for flexibility
}
