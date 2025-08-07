import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AggregatedHealthProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  bmi: number | null;
  medical_conditions: string[] | null;
  allergies: string[] | null;
  medications: string[] | null;
  profile_goals: string[] | null;
  health_profile_data: any;
  health_profile_created: string | null;
  biomarkers: any[];
  analyses_count: number;
  last_analysis_date: string | null;
  avg_weight_30d: number | null;
  avg_steps_30d: number | null;
  avg_sleep_30d: number | null;
  avg_exercise_30d: number | null;
  avg_stress_30d: number | null;
  avg_mood_30d: number | null;
  avg_water_30d: number | null;
  avg_nutrition_30d: number | null;
  health_metrics_count_30d: number;
  avg_calories_30d: number | null;
  avg_protein_30d: number | null;
  avg_carbs_30d: number | null;
  avg_fat_30d: number | null;
  nutrition_tracking_days_30d: number;
  user_goals: any[];
  profile_created: string;
  profile_updated: string;
}

/**
 * Hook для получения агрегированного профиля здоровья пользователя
 * Использует специальное представление user_health_ai_profile
 */
export const useAggregatedHealthProfile = () => {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery<AggregatedHealthProfile | null>({
    queryKey: ['aggregated-health-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_health_ai_profile')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching aggregated health profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
    retry: (failureCount, error) => {
      // Не повторяем запрос, если пользователь не аутентифицирован
      if (error?.message?.includes('not authenticated')) {
        return false;
      }
      return failureCount < 2;
    }
  });
};

/**
 * Вспомогательная функция для расчета полноты данных профиля
 */
export const calculateProfileCompleteness = (profile: AggregatedHealthProfile | null): number => {
  if (!profile) return 0;

  let score = 0;
  let maxScore = 0;

  // Базовые демографические данные (30 баллов)
  maxScore += 30;
  if (profile.age) score += 10;
  if (profile.gender) score += 10;
  if (profile.height && profile.weight) score += 10;

  // Профиль здоровья (30 баллов)
  maxScore += 30;
  if (profile.health_profile_data) score += 30;

  // Биомаркеры (20 баллов)
  maxScore += 20;
  const biomarkersCount = profile.biomarkers?.length || 0;
  if (biomarkersCount > 0) score += Math.min(20, biomarkersCount * 2);

  // Метрики образа жизни (15 баллов)
  maxScore += 15;
  if (profile.health_metrics_count_30d > 0) score += Math.min(15, profile.health_metrics_count_30d);

  // Питание (5 баллов)
  maxScore += 5;
  if (profile.nutrition_tracking_days_30d > 0) score += Math.min(5, profile.nutrition_tracking_days_30d);

  return Math.round((score / maxScore) * 100);
};

/**
 * Вспомогательная функция для получения ключевых показателей здоровья
 */
export const getHealthSummary = (profile: AggregatedHealthProfile | null) => {
  if (!profile) return null;

  return {
    demographics: {
      age: profile.age,
      gender: profile.gender,
      bmi: profile.bmi,
      bmi_category: profile.bmi ? getBMICategory(profile.bmi) : null
    },
    recent_activity: {
      avg_steps: profile.avg_steps_30d,
      avg_sleep: profile.avg_sleep_30d,
      avg_exercise: profile.avg_exercise_30d,
      tracking_days: profile.health_metrics_count_30d
    },
    medical_data: {
      biomarkers_count: profile.biomarkers?.length || 0,
      analyses_count: profile.analyses_count,
      last_test_date: profile.last_analysis_date,
      conditions_count: profile.medical_conditions?.length || 0
    },
    nutrition_tracking: {
      tracking_days: profile.nutrition_tracking_days_30d,
      avg_calories: profile.avg_calories_30d,
      avg_protein: profile.avg_protein_30d
    },
    completeness_score: calculateProfileCompleteness(profile)
  };
};

/**
 * Определение категории ИМТ
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Недостаточный вес';
  if (bmi < 25) return 'Нормальный вес';
  if (bmi < 30) return 'Избыточный вес';
  return 'Ожирение';
};

/**
 * Проверка готовности данных для ИИ-анализа
 */
export const isReadyForAIAnalysis = (profile: AggregatedHealthProfile | null): boolean => {
  if (!profile) return false;

  // Минимальные требования для ИИ-анализа
  const hasBasicInfo = profile.age && profile.gender;
  const hasHealthData = profile.health_profile_data || 
                       (profile.biomarkers?.length || 0) > 0 || 
                       profile.health_metrics_count_30d > 0;

  return !!(hasBasicInfo && hasHealthData);
};