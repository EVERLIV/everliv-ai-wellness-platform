import React from 'react';
import { Target } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useHealthGoalsManager } from '@/hooks/useHealthGoalsManager';

const MyGoalsSection: React.FC = () => {
  const { healthProfile } = useHealthProfile();
  const { goals, isLoading } = useHealthGoalsManager();

  // Предустановленные цели здоровья из профиля
  const getPredefinedGoalName = (goalKey: string): string => {
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
      'biological_age': 'Улучшение биологического возраста',
      'metabolic_health': 'Метаболическое здоровье',
      'bone_health': 'Здоровье костей',
      'mental_health': 'Психическое здоровье',
      'detox': 'Детоксикация организма',
      'athletic_performance': 'Спортивные результаты',
      // Добавляем недостающие переводы
      'musculoskeletal': 'Здоровье костно-мышечной системы',
      'metabolism': 'Улучшение метаболизма',
      'immunity': 'Укрепление иммунной системы',
      'cardiovascular_health': 'Здоровье сердца и сосудов',
      'cognitive_health': 'Когнитивное здоровье'
    };
    return translations[goalKey] || goalKey;
  };

  // Цели из профиля здоровья (выбранные)
  const profileGoals = healthProfile?.healthGoals || [];
  const selectedGoals = profileGoals.map(goalKey => getPredefinedGoalName(goalKey));

  // Пользовательские цели
  const customGoals = goals || [];

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 rounded-xl p-4 sm:p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Мои цели</h2>
        </div>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Загрузка целей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-lg p-3 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
          <Target className="h-3 w-3 text-white" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Мои цели</h2>
      </div>

      <div className="space-y-2">
        {/* Пользовательские цели */}
        {customGoals.length > 0 && (
          <div className="space-y-1">
            {customGoals.slice(0, 2).map((goal, index) => (
              <div key={goal.id} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <p className="text-foreground leading-tight truncate">{goal.title}</p>
              </div>
            ))}
            {customGoals.length > 2 && (
              <p className="text-xs text-muted-foreground pl-5">+{customGoals.length - 2} еще</p>
            )}
          </div>
        )}

        {/* Выбранные цели из профиля здоровья */}
        {selectedGoals.length > 0 && (
          <div className="space-y-1">
            {selectedGoals.slice(0, 2).map((goal, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-brand-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <p className="text-foreground/90 leading-tight truncate">{goal}</p>
              </div>
            ))}
            {selectedGoals.length > 2 && (
              <p className="text-xs text-muted-foreground pl-5">+{selectedGoals.length - 2} еще</p>
            )}
          </div>
        )}

        {/* Пустое состояние */}
        {selectedGoals.length === 0 && customGoals.length === 0 && (
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground mb-2">Нет целей</p>
            <button 
              onClick={() => window.location.href = '/health-profile'}
              className="text-xs text-brand-primary font-medium hover:text-brand-primary-dark transition-colors"
            >
              Добавить →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGoalsSection;