
import React, { useState, useEffect } from 'react';
import { CachedAnalytics } from '@/types/analytics';
import RecommendationHeader from './recommendations/RecommendationHeader';
import RecommendationCard from './recommendations/RecommendationCard';
import { EmptyState, StatusFooter } from './recommendations/RecommendationStates';
import { useRecommendationsGeneration } from './recommendations/useRecommendationsGeneration';

interface EnhancedAnalyticsRecommendationsProps {
  analytics: CachedAnalytics;
  healthProfile?: any;
}

const EnhancedAnalyticsRecommendations: React.FC<EnhancedAnalyticsRecommendationsProps> = ({
  analytics,
  healthProfile
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const {
    recommendations,
    isGenerating,
    lastAttempt,
    generateRecommendations
  } = useRecommendationsGeneration(analytics, healthProfile);

  const isCached = lastAttempt && !isGenerating;
  const cacheAge = lastAttempt ? Date.now() - new Date(lastAttempt).getTime() : 0;
  const isCacheRecent = cacheAge < 3600000; // Меньше часа

  console.log('📊 Analytics recommendations state:', {
    recommendationsCount: recommendations.length,
    isGenerating,
    lastAttempt,
    isCached,
    analytics: !!analytics,
    healthProfile: !!healthProfile,
    healthGoals: healthProfile?.healthGoals?.length || 0
  });

  // Отслеживаем статус подключения
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="space-y-6">
      <RecommendationHeader
        healthProfile={healthProfile}
        lastAttempt={lastAttempt}
        isOnline={isOnline}
        isGenerating={isGenerating}
        onRefresh={generateRecommendations}
      />

      {recommendations.length === 0 && (
        <EmptyState isGenerating={isGenerating} isOnline={isOnline} />
      )}

      <div className="grid gap-6">
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            isExpanded={expandedCards.has(rec.id)}
            onToggleExpanded={() => toggleExpanded(rec.id)}
          />
        ))}
      </div>

      {recommendations.length > 0 && (
        <StatusFooter isOnline={isOnline} />
      )}
    </div>
  );
};

export default EnhancedAnalyticsRecommendations;
