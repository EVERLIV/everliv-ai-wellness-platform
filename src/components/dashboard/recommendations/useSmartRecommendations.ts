
import { useState, useEffect } from 'react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SmartRecommendation } from './types';

export const useSmartRecommendations = () => {
  const { healthProfile } = useHealthProfile();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecommendations = async () => {
    if (!healthProfile?.healthGoals || healthProfile.healthGoals.length === 0) {
      console.log('No health goals found, skipping recommendations generation');
      return;
    }

    setIsGenerating(true);
    console.log('Generating recommendations for goals:', healthProfile.healthGoals);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-goal-recommendations', {
        body: {
          healthGoals: healthProfile.healthGoals,
          userProfile: {
            age: healthProfile.age,
            gender: healthProfile.gender,
            weight: healthProfile.weight,
            height: healthProfile.height,
            exerciseFrequency: healthProfile.exerciseFrequency,
            chronicConditions: healthProfile.chronicConditions,
            medications: healthProfile.medications,
            stressLevel: healthProfile.stressLevel,
            sleepHours: healthProfile.sleepHours
          }
        }
      });

      if (error) {
        console.error('Error generating recommendations:', error);
        toast.error('Ошибка при генерации рекомендаций');
        return;
      }

      console.log('Recommendations response:', data);

      if (data?.recommendations) {
        setRecommendations(data.recommendations);
        console.log('Successfully set recommendations:', data.recommendations);
      } else {
        console.log('No recommendations in response');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка при генерации рекомендаций');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (healthProfile?.healthGoals && healthProfile.healthGoals.length > 0) {
      console.log('Health profile loaded with goals:', healthProfile.healthGoals);
      generateRecommendations();
    } else {
      console.log('No health goals found in profile');
    }
  }, [healthProfile?.healthGoals]);

  return {
    recommendations,
    isGenerating,
    generateRecommendations
  };
};
