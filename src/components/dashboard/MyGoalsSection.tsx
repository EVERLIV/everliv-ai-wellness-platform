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
      <div className="bg-gradient-to-br from-brand-secondary/30 to-brand-accent/20 rounded-2xl p-5 shadow-md border border-brand-secondary/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-sm">
            <Target className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Мои цели</h2>
        </div>
        <div className="text-center py-6 bg-white/50 rounded-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Загрузка целей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-secondary/30 to-brand-accent/20 rounded-2xl p-5 shadow-md border border-brand-secondary/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-sm">
          <Target className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Мои цели</h2>
      </div>

      <div className="space-y-4">
        {/* Пользовательские цели */}
        {customGoals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/80 mb-3">Личные цели</h3>
            <div className="space-y-3">
              {customGoals.map((goal) => (
                <div key={goal.id} className="bg-white/70 rounded-xl p-3 border border-white/50">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-foreground font-medium leading-relaxed">{goal.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Выбранные цели из профиля здоровья */}
        {selectedGoals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/80 mb-3">Цели здоровья</h3>
            <div className="space-y-3">
              {selectedGoals.map((goal, index) => (
                <div key={index} className="bg-white/70 rounded-xl p-3 border border-white/50">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-foreground/90 font-medium leading-relaxed">{goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пустое состояние */}
        {selectedGoals.length === 0 && customGoals.length === 0 && (
          <div className="text-center py-6 bg-white/50 rounded-xl">
            <Target className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">У вас пока нет целей</p>
            <button 
              onClick={() => window.location.href = '/health-profile'}
              className="bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-primary-dark transition-colors"
            >
              Установить цели здоровья
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGoalsSection;