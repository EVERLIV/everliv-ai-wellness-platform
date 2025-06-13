
export interface DetailedRecommendation {
  id: string;
  category: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  specificActions: string[];
  expectedResult: string;
  timeframe: string;
  cost?: string;
}

export interface RiskFactor {
  id: string;
  factor: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  currentImpact: string;
  mitigation: string[];
  monitoringFrequency: string;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  benefit: string;
  duration: string;
  cost: string;
  whereToBuy: string;
  interactions?: string;
  sideEffects?: string;
}

export interface SpecialistRecommendation {
  id: string;
  specialist: string;
  urgency: 'immediate' | 'within_month' | 'within_3_months' | 'annual';
  reason: string;
  whatToExpected: string;
  preparation: string[];
  estimatedCost: string;
  frequency: string;
}

export interface TestRecommendation {
  id: string;
  testName: string;
  priority: 'high' | 'medium' | 'low';
  frequency: string;
  reason: string;
  preparation: string[];
  expectedCost: string;
  whereToGet: string;
  whatItChecks: string[];
}

export interface DetailedRecommendationsResult {
  recommendations: DetailedRecommendation[];
  riskFactors: RiskFactor[];
  supplements: Supplement[];
  specialists: SpecialistRecommendation[];
  tests: TestRecommendation[];
}
