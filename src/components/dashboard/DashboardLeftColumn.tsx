
import React from 'react';
import PersonalizedDashboardHeader from './PersonalizedDashboardHeader';
import DashboardQuickActionsGrid from './DashboardQuickActionsGrid';
import DashboardHealthCharts from './DashboardHealthCharts';

interface DashboardLeftColumnProps {
  userName: string;
}

const DashboardLeftColumn: React.FC<DashboardLeftColumnProps> = ({ userName }) => {
  return (
    <>
      {/* Персонализированный заголовок */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <PersonalizedDashboardHeader userName={userName} />
      </div>
      
      {/* Быстрые действия - детализированные карточки */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <DashboardQuickActionsGrid />
      </div>
      
      {/* Графики здоровья */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Показатели здоровья
        </h3>
        <DashboardHealthCharts />
      </div>
    </>
  );
};

export default DashboardLeftColumn;
