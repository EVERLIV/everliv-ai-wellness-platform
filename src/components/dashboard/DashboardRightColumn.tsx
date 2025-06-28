
import React from "react";
import SmartGoalRecommendations from "./SmartGoalRecommendations";
import DashboardKeyMetrics from "./DashboardKeyMetrics";
import NutritionSummarySection from "./NutritionSummarySection";

interface DashboardRightColumnProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  return (
    <div className="space-y-4">
      {/* Ключевые показатели */}
      <DashboardKeyMetrics 
        healthScore={healthScore} 
        biologicalAge={biologicalAge} 
      />

      {/* Дневник питания */}
      <NutritionSummarySection />

      {/* Умные рекомендации */}
      <SmartGoalRecommendations />
    </div>
  );
};

export default DashboardRightColumn;
