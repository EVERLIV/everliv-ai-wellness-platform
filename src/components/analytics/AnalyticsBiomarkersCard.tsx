
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
    <div className="space-y-content-xs">
      <div className="flex items-center gap-2">
        <TestTube className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-primary">Анализ биомаркеров</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-content-xs">
        {analytics.biomarkers.map((biomarker, index) => (
          <div key={index} className="space-y-2 p-content-xs bg-muted/20 border border-border rounded-lg">
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
    </div>
  );
};

export default AnalyticsBiomarkersCard;
