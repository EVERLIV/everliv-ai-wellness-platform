import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Target,
  TestTube,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useNavigate } from 'react-router-dom';

const PriorityMetricsSection = () => {
  const { analytics, isLoading: analyticsLoading } = useCachedAnalytics();
  const navigate = useNavigate();

  if (analyticsLoading) {
    return (
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-base font-semibold">Краткая аналитика</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-base font-semibold">Краткая аналитика</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center py-6">
            <TestTube className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">Нет данных для аналитики</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/analytics')}
            >
              Создать аналитику
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Определяем статус здоровья
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { text: 'Отличное', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { text: 'Хорошее', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Требует внимания', color: 'bg-red-100 text-red-800' };
  };

  // Определяем уровень риска
  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const healthStatus = getHealthStatus(analytics.healthScore || 0);

  // Краткая выборка ключевых рекомендаций
  const getKeyRecommendations = () => {
    const recommendations = [];
    
    if (analytics.concerns && analytics.concerns.length > 0) {
      recommendations.push({
        type: 'concern',
        text: analytics.concerns[0],
        icon: AlertTriangle,
        color: 'text-red-500'
      });
    }
    
    if (analytics.strengths && analytics.strengths.length > 0) {
      recommendations.push({
        type: 'strength',  
        text: analytics.strengths[0],
        icon: TrendingUp,
        color: 'text-green-500'
      });
    }

    if (analytics.recommendations && analytics.recommendations.length > 0) {
      // Безопасная обработка recommendations как строки или объекта
      const firstRecommendation = analytics.recommendations[0];
      let text = '';
      
      if (typeof firstRecommendation === 'string') {
        text = firstRecommendation;
      } else if (firstRecommendation && typeof firstRecommendation === 'object') {
        text = (firstRecommendation as any).text || 
               (firstRecommendation as any).description || 
               (firstRecommendation as any).title || 
               'Доступна рекомендация';
      }
      
      if (text) {
        recommendations.push({
          type: 'action',
          text: text,
          icon: Target,
          color: 'text-blue-500'
        });
      }
    }

    return recommendations.slice(0, 3);
  };

  const keyRecommendations = getKeyRecommendations();

  return (
    <Card className="shadow-sm border-gray-200/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-base font-semibold">Краткая аналитика</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/analytics')}
            className="text-xs"
          >
            Подробнее <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Индекс здоровья */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Индекс здоровья</p>
            <p className="text-xl font-semibold text-gray-900">
              {Math.round(analytics.healthScore || 0)}%
            </p>
          </div>
          <Badge className={healthStatus.color}>
            {healthStatus.text}
          </Badge>
        </div>

        {/* Уровень риска */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Уровень риска</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {analytics.riskLevel || 'неизвестно'}
            </p>
          </div>
          <Badge className={getRiskColor(analytics.riskLevel)}>
            <Activity className="h-3 w-3 mr-1" />
            {analytics.riskLevel || 'N/A'}
          </Badge>
        </div>

        {/* Ключевые рекомендации */}
        {keyRecommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Ключевые моменты:</p>
            {keyRecommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <div key={index} className="flex items-start gap-2">
                  <IconComponent className={`h-3 w-3 mt-0.5 flex-shrink-0 ${rec.color}`} />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {rec.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Последнее обновление */}
        {analytics.lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t">
            <Clock className="h-3 w-3" />
            <span>
              Обновлено: {new Date(analytics.lastUpdated).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}

        {/* Кнопка перехода */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/analytics')}
        >
          Полная аналитика
        </Button>
      </CardContent>
    </Card>
  );
};

export default PriorityMetricsSection;