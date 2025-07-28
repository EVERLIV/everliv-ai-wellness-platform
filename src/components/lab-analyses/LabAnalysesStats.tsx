import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, TrendingUp, Crown } from "lucide-react";
import { AnalysisStatistics } from "@/types/labAnalyses";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface LabAnalysesStatsProps {
  statistics: AnalysisStatistics;
}

const LabAnalysesStats: React.FC<LabAnalysesStatsProps> = ({ statistics }) => {
  const { isPremiumActive, currentPlan, subscription } = useSubscription();

  const getAnalysisLimit = () => {
    // Проверяем сначала активную подписку из базы данных
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const expiresAt = new Date(subscription.expires_at);
      
      if (expiresAt > now && subscription.plan_type === 'premium') {
        return 15; // премиум план
      }
    }
    
    // Затем проверяем isPremiumActive (включая dev режим)
    if (isPremiumActive) return 15;
    
    return 1; // базовый план
  };

  const limit = getAnalysisLimit();
  const usagePercentage = (statistics.currentMonthAnalyses / limit) * 100;

  // Определяем отображаемый план с учетом данных из базы
  const getDisplayPlan = () => {
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const expiresAt = new Date(subscription.expires_at);
      
      if (expiresAt > now) {
        return subscription.plan_type === 'premium' ? 'Премиум' : 'Стандарт';
      }
    }
    
    return isPremiumActive ? 'Премиум' : currentPlan;
  };

  const displayPlan = getDisplayPlan();

  console.log('📊 LabAnalysesStats: Subscription info:', {
    subscription: subscription ? {
      id: subscription.id,
      plan_type: subscription.plan_type,
      status: subscription.status,
      expires_at: subscription.expires_at,
      isExpired: subscription.expires_at ? new Date(subscription.expires_at) <= new Date() : true
    } : null,
    isPremiumActive,
    currentPlan,
    displayPlan,
    limit,
    currentMonthAnalyses: statistics.currentMonthAnalyses,
    usagePercentage
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <Card className="border-gray-200/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 py-2">
          <CardTitle className="text-xs font-medium">Всего анализов</CardTitle>
          <FileText className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 py-1 pt-0">
          <div className="text-lg font-bold">{statistics.totalAnalyses}</div>
          <p className="text-xs text-muted-foreground">
            За все время
          </p>
        </CardContent>
      </Card>

      <Card className="border-gray-200/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 py-2">
          <CardTitle className="text-xs font-medium">Этот месяц</CardTitle>
          <Calendar className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 py-1 pt-0">
          <div className="text-lg font-bold">
            {statistics.currentMonthAnalyses}/{limit}
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-full bg-gray-200 overflow-hidden`}>
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

      <Card className="border-gray-200/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 py-2">
          <CardTitle className="text-xs font-medium">План подписки</CardTitle>
          <Crown className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 py-1 pt-0">
          <div className="text-lg font-bold">
            {displayPlan}
          </div>
          <p className="text-xs text-muted-foreground">
            {limit} анализов в месяц
          </p>
        </CardContent>
      </Card>

      <Card className="border-gray-200/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 py-2">
          <CardTitle className="text-xs font-medium">Последний анализ</CardTitle>
          <TrendingUp className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 py-1 pt-0">
          <div className="text-lg font-bold">
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
