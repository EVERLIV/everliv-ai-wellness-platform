
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardKeyMetricsProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardKeyMetrics: React.FC<DashboardKeyMetricsProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-2 mobile-compact">
        <h3 className="text-adaptive-sm font-semibold text-gray-900 mb-2 flex items-center adaptive-gap-sm">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          Показатели
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded border border-red-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-adaptive-xs font-medium text-gray-700 mobile-text-wrap">Балл</span>
              <TrendingUp className="h-2.5 w-2.5 text-green-500 flex-shrink-0" />
            </div>
            <div className="flex items-center adaptive-gap-sm">
              <span className="text-adaptive-lg font-bold text-red-600">{healthScore}</span>
              <Progress value={healthScore} className="flex-1 h-1.5" />
            </div>
          </div>
          
          <div className="p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded border border-indigo-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-adaptive-xs font-medium text-gray-700 mobile-text-wrap">Био-возраст</span>
              <TrendingDown className="h-2.5 w-2.5 text-green-500 flex-shrink-0" />
            </div>
            <div className="flex items-center adaptive-gap-sm">
              <span className="text-adaptive-lg font-bold text-indigo-600">{biologicalAge}</span>
              <span className="text-adaptive-xs text-gray-500">лет</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 adaptive-p-md">
      <h3 className="text-adaptive-base font-semibold text-gray-900 mb-3 flex items-center adaptive-gap-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Ключевые показатели
      </h3>
      <div className="space-y-3">
        <div className="adaptive-p-md bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-adaptive-sm font-medium text-gray-700">Общий балл</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-adaptive-xs text-green-600">+2.3</span>
            </div>
          </div>
          <div className="flex items-center adaptive-gap-md">
            <span className="text-adaptive-2xl font-bold text-red-600">{healthScore}</span>
            <Progress value={healthScore} className="flex-1 h-2" />
          </div>
        </div>
        
        <div className="adaptive-p-md bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-adaptive-sm font-medium text-gray-700">Биологический возраст</span>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-adaptive-xs text-green-600">-1.2</span>
            </div>
          </div>
          <div className="flex items-center adaptive-gap-sm">
            <span className="text-adaptive-2xl font-bold text-indigo-600">{biologicalAge}</span>
            <span className="text-adaptive-sm text-gray-500">лет</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKeyMetrics;
