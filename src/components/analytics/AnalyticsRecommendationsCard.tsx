
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Target, Lightbulb } from "lucide-react";
import AnalyticsDisplayCard from "./AnalyticsDisplayCard";
import { CachedAnalytics } from "@/types/analytics";

interface AnalyticsRecommendationsCardProps {
  analytics: CachedAnalytics;
}

interface DetailedRecommendation {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
}

const AnalyticsRecommendationsCard: React.FC<AnalyticsRecommendationsCardProps> = ({
  analytics
}) => {
  if (!analytics.recommendations || analytics.recommendations.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'lifestyle': return '🏃‍♂️';
      case 'nutrition': return '🥗';
      case 'supplements': return '💊';
      case 'tests': return '🧪';
      case 'consultation': return '👨‍⚕️';
      case 'exercise': return '💪';
      case 'sleep': return '😴';
      case 'stress': return '🧘';
      default: return '💡';
    }
  };

  const getCategoryColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': case 'critical': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const translateCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'lifestyle': return 'Образ жизни';
      case 'nutrition': return 'Питание';
      case 'supplements': return 'Добавки';
      case 'tests': return 'Анализы';
      case 'consultation': return 'Консультация';
      case 'exercise': return 'Упражнения';
      case 'sleep': return 'Сон';
      case 'stress': return 'Стресс';
      case 'biohacking': return 'Биохакинг';
      default: return category;
    }
  };

  const translatePriority = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': case 'critical': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  // Проверяем, являются ли рекомендации детальными объектами или простыми строками
  const isDetailedRecommendation = (rec: any): rec is DetailedRecommendation => {
    return typeof rec === 'object' && rec.title && rec.description;
  };

  return (
    <AnalyticsDisplayCard title="Персональные рекомендации" icon={Target}>
      <div className="space-y-4">
        {analytics.recommendations.map((rec, index) => {
          // Если это детальная рекомендация
          if (isDetailedRecommendation(rec)) {
            return (
              <div key={rec.id || index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(rec.category)}</span>
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  </div>
                  {rec.priority && (
                    <Badge variant={getCategoryColor(rec.priority)}>
                      {translatePriority(rec.priority)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                {rec.category && (
                  <Badge variant="outline" className="text-xs">
                    {translateCategory(rec.category)}
                  </Badge>
                )}
              </div>
            );
          }
          
          // Если это простая строка (fallback)
          return (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  {rec}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsDisplayCard>
  );
};

export default AnalyticsRecommendationsCard;
