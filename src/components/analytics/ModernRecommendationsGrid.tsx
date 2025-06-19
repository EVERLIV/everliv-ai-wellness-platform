
import React from "react";
import { CachedAnalytics } from "@/types/analytics";
import { HealthProfileData } from "@/types/healthProfile";
import { generateDetailedRecommendations } from "@/utils/detailedRecommendationsGenerator";
import { generateComprehensiveHealthRecommendations } from "@/utils/comprehensiveHealthAnalyzer";
import HealthOverviewHeader from "./recommendations/HealthOverviewHeader";
import PriorityRecommendations from "./recommendations/PriorityRecommendations";
import KeyRecommendations from "./recommendations/KeyRecommendations";
import RiskFactors from "./recommendations/RiskFactors";
import SupplementsSection from "./recommendations/SupplementsSection";
import SpecialistsSection from "./recommendations/SpecialistsSection";
import TestsSection from "./recommendations/TestsSection";

interface ModernRecommendationsGridProps {
  analytics: CachedAnalytics;
  healthProfile: HealthProfileData | null;
}

const ModernRecommendationsGrid: React.FC<ModernRecommendationsGridProps> = ({
  analytics,
  healthProfile
}) => {
  const recommendations = generateDetailedRecommendations(analytics, healthProfile || undefined);
  const comprehensiveRecommendations = generateComprehensiveHealthRecommendations(healthProfile, analytics);

  return (
    <div className="space-y-8">
      <HealthOverviewHeader analytics={analytics} />
      
      <PriorityRecommendations recommendations={comprehensiveRecommendations.priority} />
      
      <KeyRecommendations recommendations={recommendations.recommendations} />
      
      <RiskFactors riskFactors={recommendations.riskFactors} />
      
      <SupplementsSection supplements={recommendations.supplements} />
      
      <SpecialistsSection specialists={recommendations.specialists} />
      
      <TestsSection tests={recommendations.tests} />
    </div>
  );
};

export default ModernRecommendationsGrid;
