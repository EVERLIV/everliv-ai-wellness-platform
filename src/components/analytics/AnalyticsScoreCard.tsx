
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import AnalyticsValueDisplay from "./AnalyticsValueDisplay";

interface AnalyticsScoreCardProps {
  healthScore: number;
  riskLevel: string;
  lastUpdated?: string;
}

const AnalyticsScoreCard: React.FC<AnalyticsScoreCardProps> = ({
  healthScore,
  riskLevel,
  lastUpdated
}) => {
  const getRiskLevelColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskLevelText = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'Низкий риск';
      case 'medium': return 'Средний риск';
      case 'high': return 'Высокий риск';
      default: return 'Неопределен';
    }
  };

  const getScoreIcon = () => {
    if (healthScore >= 80) return TrendingUp;
    if (healthScore >= 60) return Minus;
    return TrendingDown;
  };

  const ScoreIcon = getScoreIcon();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScoreIcon className="h-5 w-5" />
          Общий балл здоровья
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsValueDisplay
          label="Балл здоровья"
          value={`${healthScore}/100`}
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Уровень риска
          </label>
          <Badge variant={getRiskLevelColor(riskLevel)}>
            {getRiskLevelText(riskLevel)}
          </Badge>
        </div>
        {lastUpdated && (
          <AnalyticsValueDisplay
            label="Последнее обновление"
            value={new Date(lastUpdated).toLocaleDateString('ru-RU')}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsScoreCard;
