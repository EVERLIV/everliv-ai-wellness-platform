
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import { CachedAnalytics } from '@/types/analytics';
import { toast } from '@/hooks/use-toast';

export const useRecommendationsGeneration = (
  analytics: CachedAnalytics,
  healthProfile?: any
) => {
  const { user } = useSmartAuth();
  const [recommendations, setRecommendations] = useState<AnalyticsRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);

  useEffect(() => {
    if (user && healthProfile?.healthGoals && analytics) {
      generateRecommendations();
    }
  }, [user, healthProfile, analytics]);

  const generateRecommendations = async () => {
    if (!user || !healthProfile?.healthGoals || !analytics || isGenerating) return;

    setIsGenerating(true);
    setLastAttempt(new Date());

    try {
      console.log('🔄 Generating recommendations with data:', { 
        healthGoals: healthProfile.healthGoals,
        analytics: analytics,
        userProfile: healthProfile 
      });

      const { data, error } = await supabase.functions.invoke('generate-analytics-recommendations', {
        body: {
          analytics: {
            healthScore: analytics.healthScore,
            riskLevel: analytics.riskLevel,
            concerns: analytics.concerns || [],
            strengths: analytics.strengths || [],
            biomarkers: analytics.biomarkers || []
          },
          healthProfile: {
            age: healthProfile.age,
            gender: healthProfile.gender,
            weight: healthProfile.weight,
            height: healthProfile.height,
            exerciseFrequency: healthProfile.exerciseFrequency,
            medications: healthProfile.medications || [],
            stressLevel: healthProfile.stressLevel,
            sleepHours: healthProfile.sleepHours
          },
          userGoals: healthProfile.healthGoals,
          focusOnGoals: true
        }
      });

      if (error) {
        console.error('Error generating recommendations:', error);
        toast({
          title: "Ошибка генерации",
          description: "Не удалось сгенерировать рекомендации. Попробуйте позже.",
          variant: "destructive",
        });
        return;
      }

      if (data?.recommendations) {
        console.log('✅ Generated recommendations:', data.recommendations);
        setRecommendations(data.recommendations);
        
        toast({
          title: "Рекомендации обновлены",
          description: `Сгенерировано ${data.recommendations.length} персональных рекомендаций`,
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    recommendations,
    isGenerating,
    lastAttempt,
    generateRecommendations
  };
};
