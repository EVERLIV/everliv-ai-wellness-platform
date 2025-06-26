
import React from 'react';
import DashboardKeyMetrics from './DashboardKeyMetrics';
import DashboardChatsList from './DashboardChatsList';
import NutritionSummarySection from './NutritionSummarySection';

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
    </>
  );
};

export default DashboardRightColumn;
