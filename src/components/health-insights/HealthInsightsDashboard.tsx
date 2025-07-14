import React, { useState, useEffect } from 'react';
import { useHealthInsights } from '@/hooks/useHealthInsights';
import HealthInsightsHeader from './HealthInsightsHeader';
import HealthInsightsSection from './HealthInsightsSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle, Brain, Wifi, WifiOff } from 'lucide-react';

const HealthInsightsDashboard: React.FC = () => {
  const {
    insights,
    isLoading,
    isGenerating,
    lastUpdated,
    profileData,
    generateInsights,
    getInsightsByCategory
  } = useHealthInsights();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['practical']));

  // Отслеживаем статус подключения
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSectionToggle = (category: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedSections(newExpanded);
  };

  const handleRefresh = () => {
    generateInsights(false);
  };

  const handleForceRefresh = () => {
    generateInsights(true);
  };

  // Получаем инсайты по категориям
  const predictiveInsights = getInsightsByCategory('predictive');
  const practicalInsights = getInsightsByCategory('practical');
  const personalizedInsights = getInsightsByCategory('personalized');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border border-gray-200">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Загружаем ваши данные</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Анализируем ваш профиль здоровья...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и основная информация */}
      <HealthInsightsHeader
        totalInsights={insights.length}
        lastUpdated={lastUpdated}
        isGenerating={isGenerating}
        isOnline={isOnline}
        profileData={profileData}
        onRefresh={handleRefresh}
        onForceRefresh={handleForceRefresh}
      />

      {/* Индикатор генерации */}
      {isGenerating && (
        <Alert className="border-blue-200 bg-blue-50">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              ИИ анализирует ваши данные и генерирует персональные рекомендации...
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Статус подключения */}
      {!isOnline && (
        <Alert className="border-red-200 bg-red-50">
          <WifiOff className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Нет подключения к интернету. Некоторые функции могут быть недоступны.
          </AlertDescription>
        </Alert>
      )}

      {/* Пустое состояние */}
      {!isGenerating && insights.length === 0 && (
        <Card className="border border-gray-200">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Инсайты пока не сгенерированы
            </h3>
            <p className="text-gray-600 mb-4">
              Для получения персональных рекомендаций необходимо заполнить профиль здоровья и загрузить результаты анализов.
            </p>
            <div className="text-sm text-gray-500">
              <p>Убедитесь, что:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Заполнены основные данные профиля</li>
                <li>Загружены результаты медицинских анализов</li>
                <li>Есть активное подключение к интернету</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Секции инсайтов */}
      {insights.length > 0 && (
        <div className="space-y-6">
          {/* Прогнозная аналитика */}
          <HealthInsightsSection
            category="predictive"
            insights={predictiveInsights}
            isExpanded={expandedSections.has('predictive')}
            onToggleExpand={() => handleSectionToggle('predictive')}
          />

          {/* Практические рекомендации */}
          <HealthInsightsSection
            category="practical"
            insights={practicalInsights}
            isExpanded={expandedSections.has('practical')}
            onToggleExpand={() => handleSectionToggle('practical')}
          />

          {/* Персонализированные рекомендации */}
          <HealthInsightsSection
            category="personalized"
            insights={personalizedInsights}
            isExpanded={expandedSections.has('personalized')}
            onToggleExpand={() => handleSectionToggle('personalized')}
          />
        </div>
      )}

      {/* Футер с дополнительной информацией */}
      {insights.length > 0 && (
        <Card className="border border-gray-200 bg-gray-50">
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Brain className="h-4 w-4" />
              <span>
                Рекомендации созданы на основе анализа ваших данных с помощью OpenAI GPT-4.1
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Данные рекомендации носят информационный характер и не заменяют консультацию врача.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthInsightsDashboard;