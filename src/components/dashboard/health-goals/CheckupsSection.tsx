
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { useHealthRecommendations } from '@/hooks/useHealthRecommendations';
import { useNavigate } from 'react-router-dom';

const CheckupsSection: React.FC = () => {
  const { 
    getPendingCheckups, 
    checkups,
    isLoading 
  } = useHealthRecommendations();
  
  const navigate = useNavigate();
  const pendingCheckups = getPendingCheckups();
  const completedCheckups = checkups.filter(c => c.status === 'completed').slice(0, 2);

  const getDaysUntil = (scheduledDate: string) => {
    const today = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusInfo = (checkup: any) => {
    if (checkup.status === 'completed') {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        text: 'Завершен',
        variant: 'default' as const
      };
    }
    
    const daysUntil = getDaysUntil(checkup.scheduled_date);
    const isOverdue = daysUntil < 0;
    const isToday = daysUntil === 0;
    
    if (isOverdue) {
      return {
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        text: `Просрочен на ${Math.abs(daysUntil)} дн.`,
        variant: 'destructive' as const
      };
    }
    
    if (isToday) {
      return {
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        text: 'Сегодня',
        variant: 'secondary' as const
      };
    }
    
    return {
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      text: `Через ${daysUntil} дн.`,
      variant: 'outline' as const
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Загрузка чекапов...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Чекапы рекомендаций
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/health-tracking')}
          >
            Все чекапы
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {pendingCheckups.length === 0 && completedCheckups.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Нет чекапов</h3>
            <p className="text-sm text-gray-500 mb-4">
              Чекапы создаются автоматически для ваших рекомендаций
            </p>
            <Button 
              size="sm"
              onClick={() => navigate('/health-tracking')}
            >
              Создать рекомендацию
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Предстоящие и просроченные чекапы */}
            {pendingCheckups.slice(0, 3).map((checkup) => {
              const statusInfo = getStatusInfo(checkup);
              const IconComponent = statusInfo.icon;
              
              return (
                <div 
                  key={checkup.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${statusInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {checkup.title}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {checkup.description}
                    </p>
                  </div>
                  <Badge variant={statusInfo.variant} className="text-xs">
                    {statusInfo.text}
                  </Badge>
                </div>
              );
            })}

            {/* Недавно завершенные чекапы */}
            {completedCheckups.map((checkup) => {
              const statusInfo = getStatusInfo(checkup);
              const IconComponent = statusInfo.icon;
              
              return (
                <div 
                  key={checkup.id}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${statusInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {checkup.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-600">
                        Оценка: {checkup.rating}/10
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-600">
                        {new Date(checkup.completed_at!).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusInfo.variant} className="text-xs">
                    {statusInfo.text}
                  </Badge>
                </div>
              );
            })}

            {/* Показать больше */}
            {(pendingCheckups.length > 3 || completedCheckups.length > 0) && (
              <div className="pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/health-tracking')}
                >
                  Показать все чекапы
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

export default CheckupsSection;
