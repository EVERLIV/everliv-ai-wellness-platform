
import React from 'react';
import DashboardKeyMetrics from './DashboardKeyMetrics';
import DashboardChatsList from './DashboardChatsList';
import NutritionSummarySection from './NutritionSummarySection';
import SmartGoalRecommendations from './SmartGoalRecommendations';

interface DashboardRightColumnProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  return (
    <>
      {/* Ключевые показатели */}
      <DashboardKeyMetrics 
        healthScore={healthScore} 
        biologicalAge={biologicalAge} 
      />
      
      {/* Мои чаты с доктором */}
      <DashboardChatsList />
      
      {/* Мое питание */}
      <NutritionSummarySection />
      
      {/* Умные рекомендации для достижения целей */}
      <SmartGoalRecommendations />
    </>
  );
};

export default DashboardRightColumn;
