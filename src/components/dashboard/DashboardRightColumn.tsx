
import React from 'react';
import DashboardKeyMetrics from './DashboardKeyMetrics';
import QuickActionsCard from './header/QuickActionsCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardRightColumnProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  const isMobile = useIsMobile();

  // На мобильных устройствах не отображаем правую колонку отдельно
  if (isMobile) return null;

  return (
    <>
      {/* Ключевые показатели */}
      <DashboardKeyMetrics 
        healthScore={healthScore} 
        biologicalAge={biologicalAge} 
      />
      
      {/* Быстрые действия */}
      <QuickActionsCard />
    </>
  );
};

export default DashboardRightColumn;
