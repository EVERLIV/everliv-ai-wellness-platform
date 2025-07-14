import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, RefreshCw, Clock, User, TrendingUp, Wifi, WifiOff } from 'lucide-react';

interface HealthInsightsHeaderProps {
  totalInsights: number;
  lastUpdated: Date | null;
  isGenerating: boolean;
  isOnline: boolean;
  profileData: {
    age: number | null;
    bmi: number | null;
    lastAnalysis: string | null;
  } | null;
  onRefresh: () => void;
  onForceRefresh: () => void;
}

const HealthInsightsHeader: React.FC<HealthInsightsHeaderProps> = ({
  totalInsights,
  lastUpdated,
  isGenerating,
  isOnline,
  profileData,
  onRefresh,
  onForceRefresh
}) => {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Никогда';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Только что';
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDataCompletenessStatus = () => {
    if (!profileData) return { status: 'no-data', text: 'Нет данных', color: 'bg-gray-100 text-gray-600' };
    
    let score = 0;
    if (profileData.age) score += 25;
    if (profileData.bmi) score += 25;
    if (profileData.lastAnalysis) score += 50;
    
    if (score >= 75) return { status: 'excellent', text: 'Отличная', color: 'bg-green-100 text-green-700' };
    if (score >= 50) return { status: 'good', text: 'Хорошая', color: 'bg-yellow-100 text-yellow-700' };
    if (score >= 25) return { status: 'basic', text: 'Базовая', color: 'bg-orange-100 text-orange-700' };
    return { status: 'minimal', text: 'Минимальная', color: 'bg-red-100 text-red-700' };
  };

  const dataStatus = getDataCompletenessStatus();

  return (
    <div className="space-y-4">
      {/* Основной заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              ИИ-инсайты и рекомендации
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
              </div>
            </h1>
            <p className="text-gray-600 mt-1">
              Персональная аналитика здоровья на основе OpenAI
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onRefresh}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Анализируем...' : 'Обновить'}
          </Button>
          
          <Button
            onClick={onForceRefresh}
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

      {/* Статистика и информация */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Всего инсайтов: 
          </span>
          <Badge variant="secondary" className="ml-1">
            {totalInsights}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Обновлено: {formatLastUpdated(lastUpdated)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Полнота данных:</span>
          <Badge className={`text-xs ${dataStatus.color}`}>
            {dataStatus.text}
          </Badge>
        </div>

        {profileData && (
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {profileData.age && (
              <span>Возраст: {profileData.age} лет</span>
            )}
            {profileData.bmi && (
              <span>ИМТ: {profileData.bmi.toFixed(1)}</span>
            )}
            {profileData.lastAnalysis && (
              <span>
                Последний анализ: {new Date(profileData.lastAnalysis).toLocaleDateString('ru-RU')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Описание категорий */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Прогнозная аналитика</h3>
            <p className="text-blue-700 text-xs mt-1">
              Анализ рисков и прогнозирование будущих проблем со здоровьем
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <Brain className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">Практические рекомендации</h3>
            <p className="text-green-700 text-xs mt-1">
              Конкретные действия для улучшения показателей здоровья
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <User className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900">Персонализированные</h3>
            <p className="text-purple-700 text-xs mt-1">
              Индивидуальные советы на основе вашего уникального профиля
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInsightsHeader;