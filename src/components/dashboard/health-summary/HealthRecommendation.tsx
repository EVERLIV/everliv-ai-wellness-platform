
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Activity, FileText } from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";

interface HealthRecommendationProps {
  analytics: CachedAnalytics | null;
  hasHealthProfile: boolean;
  hasAnalyses: boolean;
}

const HealthRecommendation: React.FC<HealthRecommendationProps> = ({
  analytics,
  hasHealthProfile,
  hasAnalyses
}) => {
  const getRecommendationMessage = () => {
    if (!hasHealthProfile || !hasAnalyses) {
      return {
        icon: AlertTriangle,
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        title: 'Заполните данные',
        message: 'Для получения анализа здоровья заполните профиль здоровья и добавьте анализ крови'
      };
    }

    if (!analytics) {
      return {
        icon: FileText,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
        title: 'Сгенерируйте аналитику',
        message: 'Данные готовы для анализа. Сгенерируйте персональную аналитику здоровья'
      };
    }

    if (!analytics.hasRecentActivity) {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 border-yellow-200',
        title: 'Обновите данные',
        message: 'Рекомендуется загрузить свежие анализы для актуальных рекомендаций'
      };
    }

    if (analytics.riskLevel === 'высокий') {
      return {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        title: 'Требуется внимание',
        message: 'Обнаружены показатели, требующие внимания. Рекомендуется консультация врача'
      };
    }

    return {
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      title: 'Отличная работа!',
      message: 'Ваши показатели в норме. Продолжайте следить за здоровьем'
    };
  };

  const recommendation = getRecommendationMessage();

  return (
    <div className={`border rounded-lg p-4 ${recommendation.bg}`}>
      <div className="flex items-start gap-3">
        <recommendation.icon className={`h-5 w-5 ${recommendation.color} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h4 className={`font-medium ${recommendation.color} mb-1`}>
            {recommendation.title}
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            {recommendation.message}
          </p>
          {!hasHealthProfile && (
            <Button 
              size="sm" 
              onClick={() => window.location.href = '/health-profile'}
              className="bg-amber-600 hover:bg-amber-700 mr-2"
            >
              Заполнить профиль
            </Button>
          )}
          {!hasAnalyses && (
            <Button 
              size="sm" 
              onClick={() => window.location.href = '/lab-analyses'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Загрузить анализ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthRecommendation;
