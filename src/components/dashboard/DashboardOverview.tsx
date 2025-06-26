
import React from 'react';
import { Grid } from '@/components/ui/grid';
import QuickStatsCards from './QuickStatsCards';
import RecentActivityFeed from './RecentActivityFeed';
import MyGoalsSection from './health-goals/MyGoalsSection';
import CheckupsList from './CheckupsList';
import HealthProfileQuickView from './HealthProfileQuickView';

interface DashboardOverviewProps {
  patientData: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ patientData }) => {
  return (
    <div className="space-y-8">
      {/* Быстрая статистика */}
      <QuickStatsCards />
      
      {/* Основная сетка */}
      <Grid className="grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка */}
        <div className="space-y-6">
          <MyGoalsSection />
          <HealthProfileQuickView />
        </div>
        
        {/* Правая колонка */}
        <div className="space-y-6">
          <CheckupsList />
          <RecentActivityFeed />
        </div>
      </Grid>
    </div>
  );
};

export default DashboardOverview;
