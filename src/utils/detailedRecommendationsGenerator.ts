
import { CachedAnalytics } from '@/types/analytics';
import { HealthProfileData } from '@/types/healthProfile';
import { DetailedRecommendationsResult } from '@/types/detailedRecommendations';
import { generateRiskFactors } from './recommendations/riskFactorGenerator';
import { generateSpecialistRecommendations } from './recommendations/specialistGenerator';
import { generateSupplementRecommendations } from './recommendations/supplementGenerator';
import { generateTestRecommendations } from './recommendations/testGenerator';
import { generatePersonalizedRecommendations } from './recommendations/recommendationGenerator';

export const generateDetailedRecommendations = (
  analytics: CachedAnalytics,
  healthProfile?: HealthProfileData
): DetailedRecommendationsResult => {
  const recommendations = generatePersonalizedRecommendations(healthProfile);
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
