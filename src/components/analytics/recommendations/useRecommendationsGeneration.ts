
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
    if (user && healthProfile?.healthGoals) {
      generateRecommendations();
    }
  }, [user, healthProfile]);

  const generateRecommendations = async () => {
    if (!user || !healthProfile?.healthGoals || isGenerating) return;

    setIsGenerating(true);
    setLastAttempt(new Date());

    try {
      console.log('🔄 Generating recommendations for goals:', healthProfile.healthGoals);

      const { data, error } = await supabase.functions.invoke('generate-analytics-recommendations', {
        body: {
          healthGoals: healthProfile.healthGoals,
          userProfile: {
            age: healthProfile.age,
            gender: healthProfile.gender,
            weight: healthProfile.weight,
            height: healthProfile.height,
            exerciseFrequency: healthProfile.exerciseFrequency,
            medications: healthProfile.medications || [],
            stressLevel: healthProfile.stressLevel,
            sleepHours: healthProfile.sleepHours
          }
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
