
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useNavigate } from 'react-router-dom';

const CheckupsList: React.FC = () => {
  const { analytics, isLoading, hasHealthProfile, hasAnalyses } = useCachedAnalytics();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Загрузка рекомендаций...</div>
        </CardContent>
      </Card>
    );
  }

  if (!hasHealthProfile || !hasAnalyses) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Чекапы и рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-400 mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Недостаточно данных</h3>
            <p className="text-sm text-gray-500 mb-4">
              Создайте профиль здоровья и загрузите анализы для получения рекомендаций
            </p>
            <div className="flex gap-2 justify-center">
              {!hasHealthProfile && (
                <Button 
                  size="sm"
                  onClick={() => navigate('/health-profile')}
                >
                  Создать профиль
                </Button>
              )}
              {!hasAnalyses && (
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/lab-analyses')}
                >
                  Загрузить анализы
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Чекапы и рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto text-blue-400 mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Готов к анализу</h3>
            <p className="text-sm text-gray-500 mb-4">
              Сгенерируйте рекомендации ИИ-доктора на основе ваших данных
            </p>
            <Button 
              size="sm"
              onClick={() => navigate('/analytics')}
            >
              Создать рекомендации
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recommendations = analytics.recommendations?.slice(0, 3) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Активные рекомендации
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/analytics')}
          >
            Все рекомендации
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 mx-auto text-green-400 mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Все рекомендации выполнены</h3>
            <p className="text-sm text-gray-500 mb-4">
              Обновите анализ для получения новых рекомендаций
            </p>
            <Button 
              size="sm"
              onClick={() => navigate('/analytics')}
            >
              Обновить анализ
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-blue-100 flex-shrink-0">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {recommendation}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-green-600 transition-colors">
                  <CheckCircle className="h-5 w-5" />
                </button>
              </div>
            ))}

            {analytics.recommendations && analytics.recommendations.length > 3 && (
              <div className="pt-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/analytics')}
                >
                  Показать все ({analytics.recommendations.length})
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckupsList;
