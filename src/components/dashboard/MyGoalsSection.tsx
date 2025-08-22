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
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary/5 via-brand-accent/5 to-brand-secondary/5 rounded-2xl p-5 sm:p-6 mb-6 border border-brand-primary/10 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-glass"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            Мои цели
          </h2>
        </div>

        <div className="space-y-5">
          {/* Пользовательские цели */}
          {customGoals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-brand-primary flex items-center gap-2">
                <div className="w-4 h-0.5 bg-brand-primary rounded-full"></div>
                Личные цели
              </h3>
              <div className="space-y-3">
                {customGoals.map((goal, index) => (
                  <div key={goal.id} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed font-medium">{goal.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Выбранные цели из профиля здоровья */}
          {selectedGoals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-brand-secondary flex items-center gap-2">
                <div className="w-4 h-0.5 bg-brand-secondary rounded-full"></div>
                Цели здоровья
              </h3>
              <div className="space-y-3">
                {selectedGoals.map((goal, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-300" style={{ animationDelay: `${index * 100 + 50}ms` }}>
                    <div className="w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Пустое состояние */}
          {selectedGoals.length === 0 && customGoals.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Пока нет целей</h3>
              <p className="text-sm text-muted-foreground mb-4">Установите цели здоровья для персонализированных рекомендаций</p>
              <button 
                onClick={() => window.location.href = '/health-profile'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Target className="h-4 w-4" />
                Установить цели здоровья
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGoalsSection;