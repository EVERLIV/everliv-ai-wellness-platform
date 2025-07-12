import React from 'react';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useNavigate } from 'react-router-dom';
import { useHealthGoalsManager } from '@/hooks/useHealthGoalsManager';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Цели из профиля здоровья */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Цели из профиля здоровья
        </h3>
        
        {healthGoals.length === 0 ? (
          <div className="text-center py-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
            <Target className="h-6 w-6 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 mb-2">Цели не заданы</p>
            <Button 
              size="sm" 
              onClick={() => navigate('/health-profile')} 
              className="text-xs px-3 py-1.5 hover:bg-blue-600 hover:shadow-none transition-none"
            >
              Добавить цели
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {healthGoals.slice(0, 4).map((goal, index) => (
              <div key={index} className="flex items-center gap-2 p-2.5 bg-purple-50/50 rounded-lg border border-purple-200/30">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-800 font-medium">
                  {translateGoal(goal)}
                </span>
              </div>
            ))}
            {healthGoals.length > 4 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/health-profile')} 
                className="w-full text-xs mt-2 hover:bg-transparent hover:shadow-none transition-none"
              >
                Показать еще {healthGoals.length - 4}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Созданные цели пользователем */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Мои созданные цели
        </h3>
        
        {userGoals.length === 0 ? (
          <div className="text-center py-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
            <Target className="h-6 w-6 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">Нет созданных целей</p>
          </div>
        ) : (
          <div className="space-y-2">
            {userGoals.slice(0, 4).map((goal) => (
              <div key={goal.id} className="p-2.5 bg-green-50/50 rounded-lg border border-green-200/30">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-gray-800 text-sm">
                    {goal.title}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2">
                    {goal.progress_percentage || 0}%
                  </span>
                </div>
                {goal.end_date && (
                  <div className="text-xs text-green-700">
                    До: {new Date(goal.end_date).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>
            ))}
            {userGoals.length > 4 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs mt-2 hover:bg-transparent hover:shadow-none transition-none"
              >
                Показать еще {userGoals.length - 4}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGoalsSection;
