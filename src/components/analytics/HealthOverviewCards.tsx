
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";

interface HealthOverviewCardsProps {
  analytics: CachedAnalytics;
}

const HealthOverviewCards: React.FC<HealthOverviewCardsProps> = ({
  analytics
}) => {
  // Проверяем, достаточно ли данных для анализа трендов
  const hasEnoughDataForTrends = analytics.totalAnalyses > 1;

  if (!hasEnoughDataForTrends) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-amber-500" />
              <div className="text-center flex-1">
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Недостаточно данных для анализа трендов
                </p>
                <p className="text-sm text-gray-600">
                  Сделайте повторный анализ для аналитики ваших биомаркеров
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.totalAnalyses}
                </p>
                <p className="text-sm text-gray-600">Всего анализов</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {analytics.trendsAnalysis.improving}
              </p>
              <p className="text-sm text-gray-600">Улучшающихся показателей</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingDown className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">
                {analytics.trendsAnalysis.worsening}
              </p>
              <p className="text-sm text-gray-600">Ухудшающихся показателей</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {analytics.totalAnalyses}
              </p>
              <p className="text-sm text-gray-600">Всего анализов</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthOverviewCards;
