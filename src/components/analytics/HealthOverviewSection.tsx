
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Activity } from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";
import { HealthProfileData } from "@/types/healthProfile";

interface HealthOverviewSectionProps {
  analytics: CachedAnalytics;
  healthProfile: HealthProfileData | null;
}

const HealthOverviewSection: React.FC<HealthOverviewSectionProps> = ({
  analytics,
  healthProfile
}) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'низкий':
        return 'bg-green-100 text-green-800';
      case 'средний':
        return 'bg-yellow-100 text-yellow-800';
      case 'высокий':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Общий балл здоровья</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.healthScore}/100</div>
          <p className="text-xs text-muted-foreground">
            {analytics.scoreExplanation || 'Комплексная оценка здоровья'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Уровень риска</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Badge className={getRiskColor(analytics.riskLevel)}>
              {analytics.riskLevel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics.riskDescription || 'Общая оценка рисков'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Активность</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalAnalyses}</div>
          <p className="text-xs text-muted-foreground">
            Анализов за все время
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthOverviewSection;
