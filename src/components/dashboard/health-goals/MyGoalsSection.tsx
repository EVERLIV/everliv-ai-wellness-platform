import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Plus, ArrowRight, AlertTriangle, TestTube, Clock } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useNavigate } from 'react-router-dom';
import { useHealthGoalsManager } from '@/hooks/useHealthGoalsManager';
import SimpleGoalCreator from '@/components/goals/SimpleGoalCreator';

const MyGoalsSection: React.FC = () => {
  const {
    healthProfile,
    isLoading
  } = useHealthProfile();
  const { goals } = useHealthGoalsManager();
  const navigate = useNavigate();

  // Перевод целей на русский язык - расширенный список
  const translateGoal = (goal: string): string => {
    const translations: Record<string, string> = {
      'cognitive': 'Улучшение когнитивных функций',
      'cardiovascular': 'Здоровье сердечно-сосудистой системы',
      'weight_loss': 'Снижение веса',
      'muscle_gain': 'Набор мышечной массы',
      'energy_boost': 'Повышение энергии',
      'sleep_improvement': 'Улучшение сна',
      'stress_reduction': 'Снижение стресса',
      'immunity_boost': 'Укрепление иммунитета',
      'longevity': 'Увеличение продолжительности жизни',
      'hormonal_balance': 'Гормональный баланс',
      'digestive_health': 'Здоровье пищеварения',
      'skin_health': 'Здоровье кожи',
      'biological_age': 'Биологический возраст',
      'metabolic_health': 'Метаболическое здоровье',
      'bone_health': 'Здоровье костей',
      'mental_health': 'Психическое здоровье',
      'detox': 'Детоксикация организма',
      'athletic_performance': 'Спортивные результаты'
    };
    return translations[goal] || goal;
  };

  // Компактные рекомендации для достижения целей
  const goalRecommendations = [
    {
      id: '1',
      title: 'Лабораторные анализы',
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
      title: 'Витамин D',
      description: 'Проверка уровня в крови',
      priority: 'medium',
      category: 'Анализы',
      reason: 'Важен для костной системы и иммунитета'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Неизвестно';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
          <div className="animate-pulse">Загрузка...</div>
        </div>
      </div>
    );
  }

  const healthGoals = healthProfile?.healthGoals || [];
  const userGoals = goals || [];

  return (
    <div className="space-y-3">
      {/* Упрощенное создание целей */}
      <SimpleGoalCreator />

      {/* Мои цели из профиля здоровья */}
      <div className="bg-gray-50/50 rounded-lg border border-gray-200/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-gray-800 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            Цели из профиля
          </h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/health-profile')} 
            className="text-xs px-1.5 py-0.5 h-5"
          >
            Изменить
          </Button>
        </div>
        
        {healthGoals.length === 0 ? (
          <div className="text-center py-3">
            <Target className="h-6 w-6 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-500 mb-2">Цели не заданы</p>
            <Button 
              size="sm" 
              onClick={() => navigate('/health-profile')} 
              className="text-xs px-2 py-1 h-6"
            >
              <Plus className="h-3 w-3 mr-1" />
              Добавить
            </Button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {healthGoals.slice(0, 2).map((goal, index) => (
              <div key={index} className="flex items-center gap-1.5 p-1.5 bg-white/70 rounded text-xs">
                <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-800 font-medium text-xs">
                  {translateGoal(goal)}
                </span>
              </div>
            ))}
            
            {healthGoals.length > 2 && (
              <div className="pt-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs h-5" 
                  onClick={() => navigate('/health-profile')}
                >
                  Еще {healthGoals.length - 2}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Созданные цели пользователем */}
      {userGoals.length > 0 && (
        <div className="bg-gray-50/50 rounded-lg border border-gray-200/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-800 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              Созданные цели
            </h4>
          </div>
          
          <div className="space-y-1.5">
            {userGoals.slice(0, 2).map((goal) => (
              <div key={goal.id} className="flex items-start justify-between p-2 bg-green-50/50 rounded border border-green-200/30">
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-800 text-xs mb-0.5 truncate">
                    {goal.title}
                  </h5>
                  {goal.end_date && (
                    <div className="text-xs text-green-700">
                      До: {new Date(goal.end_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {goal.progress_percentage || 0}%
                </div>
              </div>
            ))}
            
            {userGoals.length > 2 && (
              <div className="pt-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs h-5"
                >
                  Еще {userGoals.length - 2}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Рекомендации для достижения целей */}
      <div className="bg-gray-50/50 rounded-lg border border-gray-200/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-gray-800 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Рекомендации
          </h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/analytics')} 
            className="text-xs px-1.5 py-0.5 h-5"
          >
            Все
          </Button>
        </div>
        
        <div className="space-y-1.5">
          {goalRecommendations.slice(0, 2).map((rec) => (
            <div key={rec.id} className="border border-gray-200/50 rounded p-2 hover:bg-white/50 transition-colors">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-start gap-1.5 flex-1 min-w-0">
                  <div className="w-4 h-4 bg-blue-50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    {rec.category === 'Анализы' ? (
                      <TestTube className="h-2.5 w-2.5 text-blue-600" />
                    ) : (
                      <Clock className="h-2.5 w-2.5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-800 text-xs mb-0.5 leading-tight">
                      {rec.title}
                    </h5>
                    <p className="text-xs text-gray-600 leading-tight">
                      {rec.description.length > 40 ? rec.description.substring(0, 40) + '...' : rec.description}
                    </p>
                  </div>
                </div>
                <Badge className={`${getPriorityColor(rec.priority)} border text-xs px-1 py-0.5 ml-1.5 flex-shrink-0`}>
                  {getPriorityText(rec.priority)}
                </Badge>
              </div>
            </div>
          ))}
          
          {goalRecommendations.length > 2 && (
            <div className="pt-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs h-5"
                onClick={() => navigate('/analytics')}
              >
                Еще {goalRecommendations.length - 2}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGoalsSection;
