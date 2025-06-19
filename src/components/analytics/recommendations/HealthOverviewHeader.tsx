
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Activity, Target, Heart } from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";

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

  const totalBiomarkers = analytics.trendsAnalysis.improving + 
                          analytics.trendsAnalysis.stable + 
                          analytics.trendsAnalysis.worsening;

  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
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
                <div className={`text-3xl font-bold ${getScoreColor(analytics.healthScore)}`}>
                  {typeof analytics.healthScore === 'number' 
                    ? analytics.healthScore.toFixed(1) 
                    : analytics.healthScore}/100
                </div>
                <div className="text-sm text-gray-500">Общий балл</div>
              </div>
              <Badge className={`px-3 py-1 ${getRiskLevelColor(analytics.riskLevel)}`}>
                {analytics.riskLevel} риск
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-lg font-semibold">{analytics.totalAnalyses}</div>
                <div className="text-sm text-gray-600">Анализов</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-lg font-semibold">{totalBiomarkers}</div>
                <div className="text-sm text-gray-600">Биомаркеров</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-lg font-semibold">{analytics.totalConsultations}</div>
                <div className="text-sm text-gray-600">Консультаций</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="flex">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <Minus className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {analytics.trendsAnalysis.improving}/{analytics.trendsAnalysis.worsening}
                </div>
                <div className="text-sm text-gray-600">Тренды</div>
              </div>
            </div>
          </div>

          {/* Детальная разбивка биомаркеров */}
          {totalBiomarkers > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700">Улучшается</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {analytics.trendsAnalysis.improving} биомаркеров
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Minus className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Стабильно</span>
                </div>
                <div className="text-lg font-bold text-gray-600">
                  {analytics.trendsAnalysis.stable} биомаркеров
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-700">Требует внимания</span>
                </div>
                <div className="text-lg font-bold text-red-600">
                  {analytics.trendsAnalysis.worsening} биомаркеров
                </div>
              </div>
            </div>
          )}

          {analytics.scoreExplanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Как рассчитывается балл здоровья:</h4>
              <p className="text-sm text-blue-800">{analytics.scoreExplanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthOverviewHeader;
