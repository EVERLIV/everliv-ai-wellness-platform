
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";

interface HealthOverviewHeaderProps {
  analytics: CachedAnalytics;
}

const HealthOverviewHeader: React.FC<HealthOverviewHeaderProps> = ({ analytics }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Brain className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Персональные рекомендации</h1>
          <p className="text-gray-600">Комплексный анализ вашего здоровья</p>
        </div>
        <div className="ml-auto">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{analytics.healthScore}</div>
            <div className="text-sm text-gray-500">Оценка здоровья</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Улучшается</span>
          </div>
          <div className="text-lg font-semibold text-green-600">
            {analytics.trendsAnalysis.improving} показателей
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Стабильно</span>
          </div>
          <div className="text-lg font-semibold text-blue-600">
            {analytics.trendsAnalysis.stable} показателей
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">Требует внимания</span>
          </div>
          <div className="text-lg font-semibold text-amber-600">
            {analytics.trendsAnalysis.worsening} показателей
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthOverviewHeader;
