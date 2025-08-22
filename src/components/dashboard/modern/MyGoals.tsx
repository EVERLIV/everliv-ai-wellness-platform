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
      <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Мои цели</h3>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-slate-600 font-medium">Загрузка целей...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Мои цели</h3>
        </div>

        <div className="space-y-6">
          {/* Пользовательские цели */}
          {customGoals.length > 0 && (
            <div className="bg-white/50 rounded-2xl p-4 border border-blue-100/50">
              <h4 className="text-sm font-bold text-slate-700 mb-3 tracking-wide uppercase">Личные цели</h4>
              <div className="space-y-3">
                {customGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="flex items-start gap-3 group">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200" />
                    <p className="text-sm text-slate-700 leading-relaxed font-medium group-hover:text-slate-900 transition-colors duration-200">{goal.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Выбранные цели из профиля здоровья */}
          {selectedGoals.length > 0 && (
            <div className="bg-white/50 rounded-2xl p-4 border border-indigo-100/50">
              <h4 className="text-sm font-bold text-slate-700 mb-3 tracking-wide uppercase">Цели здоровья</h4>
              <div className="space-y-3">
                {selectedGoals.slice(0, 4).map((goal, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200" />
                    <p className="text-sm text-slate-700 leading-relaxed font-medium group-hover:text-slate-900 transition-colors duration-200">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Пустое состояние */}
          {selectedGoals.length === 0 && customGoals.length === 0 && (
            <div className="text-center py-8 bg-white/50 rounded-2xl border border-slate-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Пока нет целей</h4>
              <p className="text-sm text-slate-600 mb-4">Установите цели для отслеживания прогресса</p>
              <button 
                onClick={() => window.location.href = '/health-profile'}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Установить цели
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};