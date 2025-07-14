
import React from 'react';
import HealthInsightsDashboard from '@/components/health-insights/HealthInsightsDashboard';

interface EnhancedAnalyticsRecommendationsProps {
  analytics?: any;
  healthProfile?: any;
}

const EnhancedAnalyticsRecommendations: React.FC<EnhancedAnalyticsRecommendationsProps> = () => {
  return <HealthInsightsDashboard />;
};

export default EnhancedAnalyticsRecommendations;
