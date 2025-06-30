
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Target, Lightbulb } from "lucide-react";
import AnalyticsDisplayCard from "./AnalyticsDisplayCard";
import { CachedAnalytics } from "@/types/analytics";

interface AnalyticsRecommendationsCardProps {
  analytics: CachedAnalytics;
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
      default: return '💡';
    }
  };

  const getCategoryColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  return (
    <AnalyticsDisplayCard title="Персональные рекомендации" icon={Target}>
      <div className="space-y-4">
        {analytics.recommendations.map((rec, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCategoryIcon(rec.category)}</span>
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
              </div>
              {rec.priority && (
                <Badge variant={getCategoryColor(rec.priority)}>
                  {rec.priority === 'high' ? 'Высокий' :
                   rec.priority === 'medium' ? 'Средний' :
                   rec.priority === 'low' ? 'Низкий' :
                   rec.priority}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
            {rec.category && (
              <Badge variant="outline" className="text-xs">
                {rec.category === 'lifestyle' ? 'Образ жизни' :
                 rec.category === 'nutrition' ? 'Питание' :
                 rec.category === 'supplements' ? 'Добавки' :
                 rec.category === 'tests' ? 'Анализы' :
                 rec.category === 'consultation' ? 'Консультация' :
                 rec.category}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </AnalyticsDisplayCard>
  );
};

export default AnalyticsRecommendationsCard;
