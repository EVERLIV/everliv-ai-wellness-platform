
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight, Plus } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useNavigate } from 'react-router-dom';

const SmartGoalRecommendations: React.FC = () => {
  const { healthProfile } = useHealthProfile();
  const navigate = useNavigate();

  // Переводим цели здоровья на русский
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

  // Получаем цели из профиля здоровья
  const healthGoals = healthProfile?.healthGoals || [];

  // Генерируем рекомендации на основе профиля
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (healthProfile?.stressLevel && healthProfile.stressLevel > 7) {
      recommendations.push({
        id: 1,
        title: 'Снизить уровень стресса',
        description: 'Медитация 10 минут в день',
        progress: 0,
        priority: 'high',
        timeFrame: '2 недели'
      });
    }

    if (healthProfile?.sleepHours && healthProfile.sleepHours < 7) {
      recommendations.push({
        id: 2,
        title: 'Улучшить качество сна',
        description: 'Спать по 7-8 часов в день',
        progress: 30,
        priority: 'high',
        timeFrame: '1 месяц'
      });
    }

    if (healthProfile?.exerciseFrequency && healthProfile.exerciseFrequency < 3) {
      recommendations.push({
        id: 3,
        title: 'Увеличить физическую активность',
        description: '3 тренировки в неделю',
        progress: 20,
        priority: 'medium',
        timeFrame: '3 недели'
      });
    }

    if (healthProfile?.waterIntake && healthProfile.waterIntake < 8) {
      recommendations.push({
        id: 4,
        title: 'Увеличить потребление воды',
        description: 'Пить 8 стаканов воды в день',
        progress: 60,
        priority: 'medium',
        timeFrame: '1 неделя'
      });
    }

    return recommendations.slice(0, 3); // Показываем максимум 3 рекомендации
  };

  const recommendations = generateRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="shadow-sm border-gray-200/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Target className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold">Цели здоровья</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Цели из профиля здоровья */}
        {healthGoals.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Ваши цели:</h4>
            {healthGoals.slice(0, 3).map((goal, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-800">{translateGoal(goal)}</span>
              </div>
            ))}
            {healthGoals.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                onClick={() => navigate('/health-profile')}
              >
                +{healthGoals.length - 3} ещё
              </Button>
            )}
          </div>
        )}

        {/* Рекомендации на основе профиля */}
        {recommendations.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700">Рекомендации:</h4>
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 text-sm mb-1">
                      {rec.title}
                    </h5>
                    <p className="text-xs text-gray-600 mb-2">
                      {rec.description}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority === 'high' ? 'Высокий' : 
                     rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Прогресс</span>
                      <span>{rec.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${rec.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Если нет целей и рекомендаций */}
        {healthGoals.length === 0 && recommendations.length === 0 && (
          <div className="text-center py-6">
            <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-3">Создайте профиль здоровья для получения персональных целей</p>
            <Button 
              size="sm" 
              onClick={() => navigate('/health-profile')}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Создать профиль
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartGoalRecommendations;
