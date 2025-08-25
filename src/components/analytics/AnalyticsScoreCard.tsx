
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
    <div className="space-y-content-xs">
      <div className="flex items-center gap-2">
        <ScoreIcon className="h-5 w-5 text-accent" />
        <h3 className="text-base font-semibold text-primary">Общий балл здоровья</h3>
      </div>
      <div className="space-y-content-xs">
        <div className="space-y-1 p-content-xs bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-xs text-muted-foreground">Балл здоровья</span>
          <div className="text-2xl font-bold text-primary">{healthScore}/100</div>
        </div>
        <div className="space-y-1 p-content-xs bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground">Уровень риска</span>
          <div>
            <Badge variant={getRiskLevelColor(riskLevel)} className="text-xs">
              {getRiskLevelText(riskLevel)}
            </Badge>
          </div>
        </div>
        {lastUpdated && (
          <div className="space-y-1 p-content-xs bg-muted/30 rounded-lg">
            <span className="text-xs text-muted-foreground">Последнее обновление</span>
            <div className="text-xs font-medium text-foreground">
              {new Date(lastUpdated).toLocaleDateString('ru-RU')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsScoreCard;
