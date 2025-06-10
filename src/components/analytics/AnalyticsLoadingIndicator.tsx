
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, Bell } from 'lucide-react';

interface AnalyticsLoadingIndicatorProps {
  isGenerating: boolean;
  loadingStep: string;
}

const AnalyticsLoadingIndicator: React.FC<AnalyticsLoadingIndicatorProps> = ({
  isGenerating,
  loadingStep
}) => {
  console.log('AnalyticsLoadingIndicator render:', { isGenerating, loadingStep });

  const getProgressValue = (step: string) => {
    if (step.includes('Загрузка данных')) return 25;
    if (step.includes('Анализ данных')) return 65;
    if (step.includes('Сохранение')) return 90;
    return 10;
  };

  // Показываем компонент если идет генерация
  if (!isGenerating) {
    console.log('Not generating, hiding indicator');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Заголовок */}
            <div className="flex items-center justify-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600 animate-pulse" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Генерация аналитики здоровья
              </h2>
            </div>

            {/* Описание процесса */}
            <div className="max-w-md mx-auto text-gray-600">
              <p className="mb-4">
                Мы анализируем ваши медицинские данные и создаем персональную аналитику здоровья.
              </p>
            </div>

            {/* Прогресс-бар */}
            <div className="max-w-md mx-auto space-y-3">
              <Progress 
                value={getProgressValue(loadingStep)} 
                className="h-3"
              />
              <p className="text-sm font-medium text-blue-600">
                {loadingStep || 'Подготовка к обработке данных...'}
              </p>
            </div>

            {/* Дисклеймер о времени */}
            <div className="max-w-lg mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-blue-900 mb-1">
                    Время обработки
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    Генерация аналитики может занять 1-3 минуты в зависимости от объема ваших данных.
                  </p>
                </div>
              </div>
            </div>

            {/* Уведомление */}
            <div className="max-w-lg mx-auto bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-green-900 mb-1">
                    Уведомление о готовности
                  </h3>
                  <p className="text-sm text-green-700">
                    Как только аналитика будет готова, вы увидите уведомление и результаты отобразятся автоматически.
                  </p>
                </div>
              </div>
            </div>

            {/* Этапы обработки */}
            <div className="max-w-md mx-auto">
              <h4 className="font-medium text-gray-900 mb-3">Этапы обработки:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className={`flex items-center space-x-2 ${
                  loadingStep.includes('Загрузка данных') ? 'text-blue-600 font-medium' : ''
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    getProgressValue(loadingStep) >= 25 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                  <span>Загрузка медицинских данных</span>
                </div>
                <div className={`flex items-center space-x-2 ${
                  loadingStep.includes('Анализ данных') ? 'text-blue-600 font-medium' : ''
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    getProgressValue(loadingStep) >= 65 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                  <span>Анализ и обработка данных</span>
                </div>
                <div className={`flex items-center space-x-2 ${
                  loadingStep.includes('Сохранение') ? 'text-blue-600 font-medium' : ''
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    getProgressValue(loadingStep) >= 90 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                  <span>Сохранение результатов</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsLoadingIndicator;
