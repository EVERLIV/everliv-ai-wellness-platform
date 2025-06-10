
export interface CachedAnalytics {
  healthScore: number;
  riskLevel: string;
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
}

export interface ChatRecord {
  created_at: string;
  title: string;
}
