
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardKeyMetricsProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardKeyMetrics: React.FC<DashboardKeyMetricsProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Ключевые показатели
      </h3>
      <div className="space-y-3">
        <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Общий балл</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+2.3</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-600">{healthScore}</span>
            <Progress value={healthScore} className="flex-1 h-2" />
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Биологический возраст</span>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">-1.2</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">{biologicalAge}</span>
            <span className="text-sm text-gray-500">лет</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKeyMetrics;
