import React from 'react';
import { Target } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useHealthGoalsManager } from '@/hooks/useHealthGoalsManager';

export const MyGoals: React.FC = () => {
  const { healthProfile } = useHealthProfile();
  const { goals, isLoading } = useHealthGoalsManager();

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
      'musculoskeletal': 'Здоровье костно-мышечной системы',
      'metabolism': 'Улучшение метаболизма',
      'immunity': 'Укрепление иммунной системы',
      'cardiovascular_health': 'Здоровье сердца и сосудов',
      'cognitive_health': 'Когнитивное здоровье'
    };
    return translations[goalKey] || goalKey;
  };

  const profileGoals = healthProfile?.healthGoals || [];
  const selectedGoals = profileGoals.map(goalKey => getPredefinedGoalName(goalKey));
  const customGoals = goals || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">Мои цели</h3>
        </div>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Загрузка целей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Target className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-base md:text-lg font-bold text-gray-900">Мои цели</h3>
      </div>

      <div className="space-y-3">
        {/* Пользовательские цели */}
        {customGoals.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Личные цели</h4>
            <div className="space-y-2">
              {customGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700 leading-relaxed">{goal.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Выбранные цели из профиля здоровья */}
        {selectedGoals.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Цели здоровья</h4>
            <div className="space-y-2">
              {selectedGoals.slice(0, 4).map((goal, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пустое состояние */}
        {selectedGoals.length === 0 && customGoals.length === 0 && (
          <div className="text-center py-4">
            <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-3">У вас пока нет целей</p>
            <button 
              onClick={() => window.location.href = '/health-profile'}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Установить цели здоровья
            </button>
          </div>
        )}
      </div>
    </div>
  );
};