
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

  return (
    <AnalyticsDisplayCard title="Персональные рекомендации" icon={Target}>
      <div className="space-y-4">
        {analytics.recommendations.map((recommendation, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">
                {recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsDisplayCard>
  );
};

export default AnalyticsRecommendationsCard;
