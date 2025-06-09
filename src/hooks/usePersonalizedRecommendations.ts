
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileData } from '@/hooks/useProfile';

interface NutritionGoals {
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
}

interface CurrentIntake {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodRecommendation {
  name: string;
  reason: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

interface LabTest {
  name: string;
  reason: string;
  frequency: string;
  priority: 'high' | 'medium' | 'low';
  preparation?: string;
}

interface Supplement {
  name: string;
  dosage: string;
  benefit: string;
  timing: string;
  interactions?: string;
}

interface AbsorptionHelper {
  name: string;
  function: string;
  takeWith: string;
}

interface LifestyleRecommendation {
  category: string;
  advice: string;
  goal: string;
}

interface MealPlan {
  mealType: string;
  foods: string[];
}

interface Recommendations {
  foods: FoodRecommendation[];
  labTests: LabTest[];
  supplements: Supplement[];
  absorptionHelpers: AbsorptionHelper[];
  lifestyle: LifestyleRecommendation[];
  mealPlan: MealPlan[];
}

interface RecommendationData {
  profile: ProfileData | null;
  goals: NutritionGoals | null;
  currentIntake: CurrentIntake;
}

export const usePersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = async (data: RecommendationData) => {
    if (!data.profile || !data.goals) {
      toast.error('Недостаточно данных для генерации рекомендаций');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Generating personalized recommendations with data:', data);

      const { data: response, error } = await supabase.functions.invoke('generate-nutrition-recommendations', {
        body: {
          profile: data.profile,
          goals: data.goals,
          currentIntake: data.currentIntake
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate recommendations');
      }

      console.log('Generated recommendations:', response.recommendations);
      setRecommendations(response.recommendations);
      toast.success('Персональные рекомендации готовы!');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Ошибка при генерации рекомендаций');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recommendations,
    isLoading,
    generateRecommendations
  };
};
