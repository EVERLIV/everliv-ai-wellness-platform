
import { CachedAnalytics } from '@/types/analytics';
import { HealthProfileData } from '@/hooks/useHealthProfile';
import { DetailedRecommendationsResult } from '@/types/detailedRecommendations';
import { generateRiskFactors } from './recommendations/riskFactorGenerator';
import { generateSpecialistRecommendations } from './recommendations/specialistGenerator';
import { generateSupplementRecommendations } from './recommendations/supplementGenerator';
import { generateTestRecommendations } from './recommendations/testGenerator';

export const generateDetailedRecommendations = (
  analytics: CachedAnalytics,
  healthProfile?: HealthProfileData
): DetailedRecommendationsResult => {
  const recommendations = [];
  const riskFactors = generateRiskFactors(healthProfile);
  const supplements = generateSupplementRecommendations(healthProfile);
  const specialists = generateSpecialistRecommendations(healthProfile);
  const tests = generateTestRecommendations();

  return {
    recommendations,
    riskFactors,
    supplements,
    specialists,
    tests
  };
};
