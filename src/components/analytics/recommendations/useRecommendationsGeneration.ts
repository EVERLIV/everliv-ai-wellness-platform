import { useSmartAuth } from '@/hooks/useSmartAuth';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import { CachedAnalytics } from '@/types/analytics';
import { useCachedRecommendations } from '@/hooks/useCachedRecommendations';
import { supabase } from '@/integrations/supabase/client';

export const useRecommendationsGeneration = (
  analytics: CachedAnalytics,
  healthProfile?: any
) => {
  const { user } = useSmartAuth();

  // Создаем источник данных для отслеживания изменений
  const sourceData = {
    analytics: {
      healthScore: analytics?.healthScore,
      riskLevel: analytics?.riskLevel,
      concerns: analytics?.concerns || [],
      strengths: analytics?.strengths || [],
      biomarkers: analytics?.biomarkers || []
    },
    healthProfile: {
      age: healthProfile?.age,
      gender: healthProfile?.gender,
      weight: healthProfile?.weight,
      height: healthProfile?.height,
      exerciseFrequency: healthProfile?.exerciseFrequency,
      medications: healthProfile?.medications || [],
      stressLevel: healthProfile?.stressLevel,
      sleepHours: healthProfile?.sleepHours,
      healthGoals: healthProfile?.healthGoals || []
    }
  };

  // Функция для генерации рекомендаций
  const generateRecommendations = async (): Promise<AnalyticsRecommendation[]> => {
    if (!user || !healthProfile?.healthGoals || !analytics) {
      return [];
    }

    console.log('🔄 Generating analytics recommendations with data:', sourceData);

    const { data, error } = await supabase.functions.invoke('generate-analytics-recommendations', {
      body: {
        analytics: sourceData.analytics,
        healthProfile: sourceData.healthProfile,
        userGoals: healthProfile.healthGoals,
        focusOnGoals: true
      }
    });

    if (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }

    if (!data?.recommendations) {
      console.error('No recommendations in response');
      return [];
    }

    console.log('✅ Generated analytics recommendations:', data.recommendations);
    return data.recommendations;
  };

  // Используем кэшированные рекомендации
  const cachedRecommendations = useCachedRecommendations(
    'analytics',
    sourceData,
    generateRecommendations
  );

  return {
    recommendations: cachedRecommendations.recommendations as AnalyticsRecommendation[],
    isGenerating: cachedRecommendations.isGenerating,
    lastAttempt: cachedRecommendations.lastUpdated,
    generateRecommendations: cachedRecommendations.regenerateRecommendations
  };
};