
import React from "react";
import SmartGoalRecommendations from "./SmartGoalRecommendations";

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
      {/* Умные рекомендации */}
      <SmartGoalRecommendations />
    </div>
  );
};

export default DashboardRightColumn;
