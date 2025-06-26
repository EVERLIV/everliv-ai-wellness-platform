
export interface AnalyticsRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'supplements' | 'biohacking';
  priority: 'critical' | 'high' | 'medium' | 'low';
  evidenceLevel: 'meta-analysis' | 'rct' | 'observational' | 'expert-opinion';
  safetyWarnings: string[];
  contraindications: string[];
  implementation: {
    steps: string[];
    duration: string;
    frequency: string;
    dosage?: string;
  };
  scientificBasis: string;
  biohackingLevel: 'beginner' | 'intermediate' | 'advanced';
}
