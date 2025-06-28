
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Heart, Target, TestTube } from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";
import BiomarkerTrendsOverview from "@/components/analytics/BiomarkerTrendsOverview";

interface HealthOverviewHeaderProps {
  analytics: CachedAnalytics;
}

const HealthOverviewHeader: React.FC<HealthOverviewHeaderProps> = ({ analytics }) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'высокий': return 'bg-red-50 text-red-700 border-red-200';
      case 'средний': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'низкий': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Главная карточка аналитики */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Аналитика здоровья
              </CardTitle>
              <p className="text-gray-600">
                Комплексная оценка на основе профиля здоровья и анализов
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(analytics.healthScore || 65)}`}>
                  {analytics.healthScore || 65}/100
                </div>
                <div className="text-sm text-gray-500">Общий балл</div>
              </div>
              <Badge className={`px-3 py-1 ${getRiskLevelColor(analytics.riskLevel || 'средний')}`}>
                {analytics.riskLevel || 'средний'} риск
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <div className="text-lg font-semibold">{analytics.totalAnalyses || 2}</div>
                <div className="text-sm text-gray-600">Анализов</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-lg font-semibold">18</div>
                <div className="text-sm text-gray-600">Биомаркеров</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-lg font-semibold">{analytics.totalConsultations || 1}</div>
                <div className="text-sm text-gray-600">Консультаций</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
              <div className="flex gap-1 p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <TrendingDown className="h-4 w-4 text-red-500" />
                <Activity className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {analytics.trendsAnalysis?.improving || 0}/{analytics.trendsAnalysis?.worsening || 0}
                </div>
                <div className="text-sm text-gray-600">Тренды</div>
              </div>
            </div>
          </div>

          {analytics.scoreExplanation && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Как рассчитывается балл здоровья:</h4>
              <p className="text-sm text-blue-800">{analytics.scoreExplanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Улучшенный компонент динамики биомаркеров */}
      <BiomarkerTrendsOverview 
        trendsAnalysis={analytics.trendsAnalysis || { improving: 0, worsening: 0, stable: 11 }} 
      />
    </div>
  );
};

export default HealthOverviewHeader;
