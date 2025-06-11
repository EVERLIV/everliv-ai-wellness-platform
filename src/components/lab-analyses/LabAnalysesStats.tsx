
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, TrendingUp, Crown } from "lucide-react";
import { AnalysisStatistics } from "@/hooks/useLabAnalysesData";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface LabAnalysesStatsProps {
  statistics: AnalysisStatistics;
}

const LabAnalysesStats: React.FC<LabAnalysesStatsProps> = ({ statistics }) => {
  const { subscription } = useSubscription();

  const getAnalysisLimit = () => {
    if (!subscription || subscription.plan_type === 'basic') return 1;
    if (subscription.plan_type === 'premium') return 15;
    return 1;
  };

  const limit = getAnalysisLimit();
  const usagePercentage = (statistics.currentMonthAnalyses / limit) * 100;

  const getPlanName = () => {
    if (!subscription || subscription.plan_type === 'basic') return 'Базовый';
    if (subscription.plan_type === 'premium') return 'Премиум';
    return 'Стандарт';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего анализов</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalAnalyses}</div>
          <p className="text-xs text-muted-foreground">
            За все время
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Этот месяц</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.currentMonthAnalyses}/{limit}
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-full bg-gray-200 rounded-full overflow-hidden`}>
              <div 
                className={`h-full transition-all duration-300 ${
                  usagePercentage >= 100 
                    ? 'bg-red-500' 
                    : usagePercentage >= 80 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {Math.round(usagePercentage)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">План подписки</CardTitle>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getPlanName()}</div>
          <p className="text-xs text-muted-foreground">
            {limit} анализов в месяц
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Последний анализ</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.mostRecentAnalysis 
              ? new Date(statistics.mostRecentAnalysis).toLocaleDateString('ru-RU')
              : "—"
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {statistics.mostRecentAnalysis ? "Дата" : "Нет данных"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabAnalysesStats;
