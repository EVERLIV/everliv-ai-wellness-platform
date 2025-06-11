
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";
import HealthSummaryHeader from "./health-summary/HealthSummaryHeader";
import HealthSummaryLoading from "./health-summary/HealthSummaryLoading";
import HealthSummaryEmptyState from "./health-summary/HealthSummaryEmptyState";
import HealthScoreDisplay from "./health-summary/HealthScoreDisplay";
import HealthRecommendation from "./health-summary/HealthRecommendation";

const DashboardHealthSummary = () => {
  const { 
    analytics, 
    isLoading, 
    isGenerating, 
    hasHealthProfile, 
    hasAnalyses, 
    generateAnalytics 
  } = useCachedAnalytics();

  return (
    <Card>
      <HealthSummaryHeader
        onRefresh={generateAnalytics}
        isGenerating={isGenerating}
        hasHealthProfile={hasHealthProfile}
        hasAnalyses={hasAnalyses}
      />
      <CardContent>
        {isLoading ? (
          <HealthSummaryLoading />
        ) : !analytics ? (
          <HealthSummaryEmptyState
            hasHealthProfile={hasHealthProfile}
            hasAnalyses={hasAnalyses}
            onGenerate={generateAnalytics}
            isGenerating={isGenerating}
          />
        ) : (
          <>
            <HealthScoreDisplay analytics={analytics} />
            <HealthRecommendation 
              analytics={analytics}
              hasHealthProfile={hasHealthProfile}
              hasAnalyses={hasAnalyses}
            />
            {analytics.lastUpdated && (
              <div className="text-xs text-gray-400 mt-3 text-center">
                Обновлено: {new Date(analytics.lastUpdated).toLocaleString('ru-RU')}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardHealthSummary;
