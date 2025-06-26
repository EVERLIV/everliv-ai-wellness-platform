
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';
import { useHealthRecommendations } from '@/hooks/useHealthRecommendations';
import { useNavigate } from 'react-router-dom';

const MyGoalsSection: React.FC = () => {
  const { 
    getActiveRecommendations, 
    getPendingCheckups, 
    isLoading 
  } = useHealthRecommendations();
  
  const navigate = useNavigate();
  const activeRecommendations = getActiveRecommendations();
  const pendingCheckups = getPendingCheckups();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGoToRecommendations = () => {
    navigate('/analytics');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Загрузка рекомендаций...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Мои рекомендации
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGoToRecommendations}
          >
            Все рекомендации
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {activeRecommendations.length === 0 && pendingCheckups.length === 0 ? (
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Нет активных рекомендаций</h3>
            <p className="text-sm text-gray-500 mb-4">
              Создайте рекомендации для улучшения здоровья
            </p>
            <Button 
              size="sm"
              onClick={handleGoToRecommendations}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить рекомендацию
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Активные рекомендации */}
            {activeRecommendations.slice(0, 3).map((recommendation) => (
              <div 
                key={recommendation.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {recommendation.title}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {recommendation.description}
                  </p>
                </div>
                <Badge 
                  className={`text-xs ${getPriorityColor(recommendation.priority)}`}
                >
                  {recommendation.priority === 'high' ? 'Высокий' : 
                   recommendation.priority === 'medium' ? 'Средний' : 
                   recommendation.priority === 'critical' ? 'Критический' : 'Низкий'}
                </Badge>
              </div>
            ))}

            {/* Показать больше */}
            {activeRecommendations.length > 3 && (
              <div className="pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={handleGoToRecommendations}
                >
                  Показать все ({activeRecommendations.length})
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

export default MyGoalsSection;
