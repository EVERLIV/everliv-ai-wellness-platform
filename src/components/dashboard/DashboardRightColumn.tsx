
import React from 'react';
import DashboardKeyMetrics from './DashboardKeyMetrics';
import DashboardChatsList from './DashboardChatsList';
import MyGoalsSection from './health-goals/MyGoalsSection';

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
      
      {/* Мои цели и чекапы */}
      <MyGoalsSection />
    </>
  );
};

export default DashboardRightColumn;
