
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
                {healthProfile.healthGoals.map((goal: string) => {
                  switch(goal) {
                    case 'cognitive': return 'Когнитивное здоровье';
                    case 'cardiovascular': return 'Сердечно-сосудистое здоровье';
                    default: return goal;
                  }
                }).join(', ')}
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
      <Button
        onClick={onRefresh}
        disabled={isGenerating}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Генерируем...' : 'Обновить'}
      </Button>
    </div>
  );
};

export default RecommendationHeader;
