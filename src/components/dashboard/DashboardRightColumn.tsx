
import React from "react";
import DashboardQuickActions from "./DashboardQuickActions";
import MyGoalsSection from "./health-goals/MyGoalsSection";
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
      {/* Мои цели здоровья */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-3">
        <MyGoalsSection />
      </div>

      {/* Умные рекомендации */}
      <SmartGoalRecommendations />

      {/* Быстрые действия */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Быстрые действия
        </h3>
        <DashboardQuickActions />
      </div>
    </div>
  );
};

export default DashboardRightColumn;
