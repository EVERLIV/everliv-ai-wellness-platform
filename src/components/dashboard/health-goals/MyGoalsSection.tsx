
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, Clock, Plus, ArrowRight, AlertTriangle, TestTube } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useNavigate } from 'react-router-dom';

const MyGoalsSection: React.FC = () => {
  const { healthProfile, isLoading } = useHealthProfile();
  const navigate = useNavigate();

  // Мокированные чекапы рекомендаций (в реальном приложении будут из API)
  const recommendationCheckups = [
    {
      id: '1',
      title: 'Рекомендуемые анализы',
      description: 'Расширенная метаболическая панель, Маркеры воспаления',
      priority: 'high',
      category: 'Анализы',
      reason: 'Хроническое воспаление - основа большинства возрастных заболеваний'
    },
    {
      id: '2',
      title: 'Консультация кардиолога',
      description: 'Оценка сердечно-сосудистых рисков',
      priority: 'medium',
      category: 'Консультации',
      reason: 'Профилактика сердечно-сосудистых заболеваний'
    },
    {
      id: '3',
      title: 'Анализ витамина D',
      description: 'Проверка уровня витамина D в крови',
      priority: 'medium',
      category: 'Анализы',
      reason: 'Важен для костной системы и иммунитета'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Неизвестно';
    }
  };

  const handleGoToHealthProfile = () => {
    navigate('/health-profile');
  };

  const handleGoToAnalytics = () => {
    navigate('/analytics');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  const healthGoals = healthProfile?.healthGoals || [];

  return (
    <div className="space-y-6">
      {/* Мои цели из профиля здоровья */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Мои цели
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGoToHealthProfile}
            >
              Редактировать
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {healthGoals.length === 0 ? (
            <div className="text-center py-6">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Нет установленных целей</h3>
              <p className="text-sm text-gray-500 mb-4">
                Добавьте цели здоровья в своем профиле
              </p>
              <Button 
                size="sm"
                onClick={handleGoToHealthProfile}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить цели
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {healthGoals.slice(0, 4).map((goal, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{goal}</span>
                  </div>
                </div>
              ))}
              
              {healthGoals.length > 4 && (
                <div className="pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={handleGoToHealthProfile}
                  >
                    Показать все ({healthGoals.length})
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Чекапы рекомендаций */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Рекомендуемые чекапы
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGoToAnalytics}
            >
              Все рекомендации
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {recommendationCheckups.map((checkup) => (
              <div 
                key={checkup.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {checkup.category === 'Анализы' ? (
                        <TestTube className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {checkup.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {checkup.description}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getPriorityColor(checkup.priority)} border`}>
                    {getPriorityText(checkup.priority)}
                  </Badge>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{checkup.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyGoalsSection;
