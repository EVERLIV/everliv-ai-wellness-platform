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
      'athletic_performance': 'Спортивные результаты',
      'musculoskeletal': 'Здоровье опорно-двигательного аппарата'
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-gray-900">Мои цели</h3>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => navigate('/health-profile')} 
          className="text-[10px] h-5 px-1.5"
        >
          Все
        </Button>
      </div>
      
      {healthGoals.length === 0 && userGoals.length === 0 ? (
        <div className="text-center py-2 bg-gray-50/50 rounded border border-gray-200/50">
          <Target className="h-3 w-3 mx-auto text-gray-400 mb-1" />
          <p className="text-[10px] text-gray-500 mb-1">Цели не заданы</p>
          <Button 
            size="sm" 
            onClick={() => navigate('/health-profile')} 
            className="text-[10px] px-2 py-0.5 h-4"
          >
            Добавить
          </Button>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Показываем максимум 2 цели */}
          {[...healthGoals.slice(0, 1), ...userGoals.slice(0, 1)].map((goal, index) => (
            <div key={typeof goal === 'string' ? `health-${index}` : `user-${goal.id}`} 
                 className="flex items-center gap-1.5 p-1.5 bg-gray-50/50 rounded border border-gray-200/30">
              <div className={`w-1 h-1 rounded-full flex-shrink-0 ${typeof goal === 'string' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
              <span className="text-[10px] text-gray-700 truncate">
                {typeof goal === 'string' ? translateGoal(goal) : goal.title}
              </span>
            </div>
          ))}
          
          {(healthGoals.length + userGoals.length) > 2 && (
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/health-profile')} 
                className="text-[10px] h-4 px-1.5"
              >
                +{(healthGoals.length + userGoals.length) - 2}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyGoalsSection;
