
import React from 'react';
import { Button } from '@/components/ui/button';
import { Beaker, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface RecommendationHeaderProps {
  healthProfile?: any;
  lastAttempt: Date | null;
  isOnline: boolean;
  isGenerating: boolean;
  onRefresh: () => void;
}

const RecommendationHeader: React.FC<RecommendationHeaderProps> = ({
  healthProfile,
  lastAttempt,
  isOnline,
  isGenerating,
  onRefresh
}) => {
  const getGoalNameInRussian = (goal: string) => {
    const translations: Record<string, string> = {
      'biological_age': 'Биологический возраст',
      'cardiovascular': 'Сердечно-сосудистое здоровье',
      'cognitive': 'Когнитивное здоровье',
      'musculoskeletal': 'Опорно-двигательная система',
      'metabolism': 'Метаболизм',
      'muscle_gain': 'Набор мышечной массы',
      'weight_loss': 'Снижение веса',
      'energy_boost': 'Повышение энергии',
      'sleep_improvement': 'Улучшение сна',
      'stress_management': 'Управление стрессом',
      'stress_reduction': 'Снижение стресса',
      'immunity_boost': 'Укрепление иммунитета',
      'immune_support': 'Укрепление иммунитета',
      'longevity': 'Увеличение продолжительности жизни',
      'hormonal_balance': 'Гормональный баланс',
      'digestive_health': 'Здоровье пищеварения',
      'skin_health': 'Здоровье кожи',
      'metabolic_health': 'Метаболическое здоровье',
      'bone_health': 'Здоровье костей',
      'mental_health': 'Психическое здоровье',
      'detox': 'Детоксикация организма',
      'athletic_performance': 'Спортивные результаты',
      'endurance': 'Выносливость',
      'flexibility': 'Гибкость'
    };
    return translations[goal] || goal;
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Beaker className="h-6 w-6 text-blue-600" />
          Персональные рекомендации ИИ-доктора
          <div className="flex items-center gap-1 ml-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>
        </h2>
        <p className="text-gray-600 mt-1">
          {healthProfile?.healthGoals?.length > 0 ? (
            <span>
              Рекомендации для ваших целей: <span className="text-blue-600 font-medium">
                {healthProfile.healthGoals.map((goal: string) => getGoalNameInRussian(goal)).join(', ')}
              </span>
            </span>
          ) : (
            'Экспертные рекомендации на основе доказательной медицины'
          )}
        </p>
        {lastAttempt && (
          <p className="text-xs text-gray-500 mt-1">
            Последняя попытка: {lastAttempt.toLocaleTimeString('ru-RU')}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onRefresh}
          disabled={isGenerating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Генерируем...' : 'Обновить'}
        </Button>
        
        <Button
          onClick={() => {
            // Принудительная регенерация с очисткой кэша
            localStorage.removeItem('analytics-recommendations-cache');
            onRefresh();
          }}
          disabled={isGenerating}
          variant="destructive"
          size="sm"
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
          Сброс
        </Button>
      </div>
    </div>
  );
};

export default RecommendationHeader;
