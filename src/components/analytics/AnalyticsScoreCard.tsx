
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
    <div className="bg-white p-3 border">
      <div className="flex items-center gap-2 mb-3">
        <ScoreIcon className="h-4 w-4" />
        <h3 className="text-sm font-medium">Общий балл здоровья</h3>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="text-xs text-gray-600">Балл здоровья</span>
          <div className="text-lg font-medium">{healthScore}/100</div>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-600">Уровень риска</span>
          <div>
            <Badge variant={getRiskLevelColor(riskLevel)} className="text-xs px-2 py-0.5">
              {getRiskLevelText(riskLevel)}
            </Badge>
          </div>
        </div>
        {lastUpdated && (
          <div className="space-y-1">
            <span className="text-xs text-gray-600">Последнее обновление</span>
            <div className="text-xs font-medium">
              {new Date(lastUpdated).toLocaleDateString('ru-RU')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsScoreCard;
