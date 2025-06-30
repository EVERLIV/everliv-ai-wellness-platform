
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TestTube } from "lucide-react";
import AnalyticsDisplayCard from "./AnalyticsDisplayCard";
import AnalyticsValueDisplay from "./AnalyticsValueDisplay";
import { CachedAnalytics } from "@/types/analytics";

interface AnalyticsBiomarkersCardProps {
  analytics: CachedAnalytics;
}

const AnalyticsBiomarkersCard: React.FC<AnalyticsBiomarkersCardProps> = ({
  analytics
}) => {
  if (!analytics.biomarkers || analytics.biomarkers.length === 0) {
    return null;
  }

  return (
    <AnalyticsDisplayCard title="Анализ биомаркеров" icon={TestTube}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analytics.biomarkers.map((biomarker, index) => (
          <div key={index} className="space-y-2">
            <AnalyticsValueDisplay
              label={biomarker.name}
              value={`${biomarker.value} ${biomarker.unit || ''}`}
            />
            <Badge variant={
              biomarker.status === 'normal' ? 'default' :
              biomarker.status === 'borderline' ? 'secondary' :
              'destructive'
            }>
              {biomarker.status === 'normal' ? 'Норма' :
               biomarker.status === 'borderline' ? 'Погранично' :
               biomarker.status === 'abnormal' ? 'Отклонение' :
               biomarker.status}
            </Badge>
          </div>
        ))}
      </div>
    </AnalyticsDisplayCard>
  );
};

export default AnalyticsBiomarkersCard;
