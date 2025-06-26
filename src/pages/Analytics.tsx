
import React from 'react';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import AnalyticsPageHeader from '@/components/analytics/AnalyticsPageHeader';
import HealthRecommendationsManager from '@/components/health-recommendations/HealthRecommendationsManager';

const Analytics = () => {
  return (
    <PageLayoutWithHeader
      headerComponent={
        <AnalyticsPageHeader 
          healthScore={0}
          riskLevel="unknown"
        />
      }
      fullWidth
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Аналитика и рекомендации
            </h1>
            <p className="text-gray-600">
              Создавайте персональные рекомендации для улучшения здоровья
            </p>
          </div>
          
          <HealthRecommendationsManager />
        </div>
      </div>
    </PageLayoutWithHeader>
  );
};

export default Analytics;
