
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Activity,
  Brain,
  Shield,
  TestTube
} from 'lucide-react';
import { CachedAnalytics } from '@/types/analytics';
import BiomarkerTrendsOverview from './BiomarkerTrendsOverview';

interface DetailedHealthRecommendationsProps {
  analytics: CachedAnalytics;
  healthProfile?: any;
}

const DetailedHealthRecommendations: React.FC<DetailedHealthRecommendationsProps> = ({ 
  analytics, 
  healthProfile 
}) => {
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'низкий':
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'средний':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'высокий':
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'критический':
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Общий обзор здоровья */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Heart className="h-5 w-5" />
              Общий балл здоровья
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold ${getScoreColor(analytics.healthScore)}`}>
                {analytics.healthScore.toFixed(1)}
              </div>
              <div className="text-2xl text-gray-400">/100</div>
              <Badge className={`ml-auto ${getRiskLevelColor(analytics.riskLevel)} border`}>
                {analytics.riskLevel}
              </Badge>
            </div>
            {analytics.riskDescription && (
              <p className="text-sm text-gray-600 mt-3">
                {analytics.riskDescription}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Activity className="h-5 w-5" />
              Активность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.totalAnalyses}
                </div>
                <div className="text-sm text-gray-600">Анализов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.totalConsultations}
                </div>
                <div className="text-sm text-gray-600">Консультаций</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Тренды биомаркеров */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TestTube className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Динамика биомаркеров</h2>
        </div>
        <BiomarkerTrendsOverview trendsAnalysis={analytics.trendsAnalysis} />
      </div>

      {/* Рекомендации */}
      {analytics.recommendations && analytics.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="h-5 w-5" />
              Персональные рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Сильные стороны */}
      {analytics.strengths && analytics.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-5 w-5" />
              Ваши сильные стороны
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analytics.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">{strength}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Области для улучшения */}
      {analytics.concerns && analytics.concerns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Области для улучшения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.concerns.map((concern, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{concern}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Объяснение балла */}
      {analytics.scoreExplanation && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Brain className="h-5 w-5" />
              Как рассчитывается балл здоровья
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              {analytics.scoreExplanation}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedHealthRecommendations;
