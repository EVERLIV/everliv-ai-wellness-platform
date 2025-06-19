
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";
import BiomarkerTrendsOverview from "../BiomarkerTrendsOverview";

interface HealthOverviewHeaderProps {
  analytics: CachedAnalytics;
}

const HealthOverviewHeader: React.FC<HealthOverviewHeaderProps> = ({ analytics }) => {
  return (
    <div className="space-y-6">
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
      </div>
      
      <BiomarkerTrendsOverview trendsAnalysis={analytics.trendsAnalysis} />
    </div>
  );
};

export default HealthOverviewHeader;
