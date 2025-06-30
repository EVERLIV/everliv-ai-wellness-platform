
import React from 'react';
import SimpleWelcomeCard from './SimpleWelcomeCard';
import DashboardQuickActionsGrid from './DashboardQuickActionsGrid';
import SmartGoalRecommendations from './SmartGoalRecommendations';
import DashboardRightColumn from './DashboardRightColumn';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLeftColumnProps {
  userName: string;
}

const DashboardLeftColumn: React.FC<DashboardLeftColumnProps> = ({ userName }) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      {/* Simple Welcome Block */}
      <SimpleWelcomeCard userName={userName} />
      
      {/* Quick Actions */}
      <DashboardQuickActionsGrid />
      
      {/* Goals Section */}
      <SmartGoalRecommendations />
      
      {/* Health Index and other sections for mobile */}
      {isMobile && (
        <DashboardRightColumn 
          healthScore={80} 
          biologicalAge={35} 
        />
      )}
    </div>
  );
};

export default DashboardLeftColumn;
