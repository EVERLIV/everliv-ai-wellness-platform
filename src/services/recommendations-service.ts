
import { supabase } from "@/integrations/supabase/client";
import { PersonalRecommendation } from "@/types/recommendations";
import { HealthProfileData } from "@/types/healthProfile";

export const generatePersonalRecommendations = async (
  userId: string,
  healthProfile: HealthProfileData
): Promise<PersonalRecommendation[]> => {
  const recommendations: Omit<PersonalRecommendation, 'id' | 'created_at' | 'updated_at'>[] = [];

  // Рекомендации по физической активности
  if (!healthProfile.physicalActivity || healthProfile.physicalActivity === 'low') {
    recommendations.push({
      user_id: userId,
      title: 'Увеличьте физическую активность',
      description: 'Добавьте 30 минут умеренной физической активности в день. Начните с прогулок или легких упражнений.',
      category: 'exercise',
      priority: 'high',
      is_completed: false,
      source_data: { field: 'physicalActivity', value: healthProfile.physicalActivity }
    });
  }

  // Рекомендации по сну
  if (healthProfile.sleepHours && (healthProfile.sleepHours < 7 || healthProfile.sleepHours > 9)) {
    recommendations.push({
      user_id: userId,
      title: 'Нормализуйте режим сна',
      description: 'Оптимальная продолжительность сна для взрослого человека составляет 7-9 часов в сутки.',
      category: 'sleep',
      priority: 'high',
      is_completed: false,
      source_data: { field: 'sleepHours', value: healthProfile.sleepHours }
    });
  }

  // Рекомендации по стрессу
  if (healthProfile.stressLevel && healthProfile.stressLevel > 6) {
    recommendations.push({
      user_id: userId,
      title: 'Управление стрессом',
      description: 'Высокий уровень стресса может негативно влиять на здоровье. Попробуйте техники релаксации или медитацию.',
      category: 'stress',
      priority: 'high',
      is_completed: false,
      source_data: { field: 'stressLevel', value: healthProfile.stressLevel }
    });
  }

  // Рекомендации по питанию
  if (healthProfile.waterIntake && healthProfile.waterIntake < 6) {
    recommendations.push({
      user_id: userId,
      title: 'Увеличьте потребление воды',
      description: 'Рекомендуется выпивать не менее 8 стаканов воды в день для поддержания оптимального уровня гидратации.',
      category: 'nutrition',
      priority: 'medium',
      is_completed: false,
      source_data: { field: 'waterIntake', value: healthProfile.waterIntake }
    });
  }

  // Медицинские рекомендации
  if (healthProfile.lastCheckup) {
    const lastCheckupDate = new Date(healthProfile.lastCheckup);
    const now = new Date();
    const monthsDiff = (now.getTime() - lastCheckupDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsDiff > 12) {
      recommendations.push({
        user_id: userId,
        title: 'Пройдите медицинское обследование',
        description: 'Последнее обследование было более года назад. Рекомендуется проходить профилактический осмотр ежегодно.',
        category: 'medical',
        priority: 'medium',
        is_completed: false,
        source_data: { field: 'lastCheckup', value: healthProfile.lastCheckup }
      });
    }
  }

  return recommendations as PersonalRecommendation[];
};

export const saveRecommendations = async (recommendations: Omit<PersonalRecommendation, 'id' | 'created_at' | 'updated_at'>[]) => {
  if (recommendations.length === 0) return;

  const { data, error } = await supabase
    .from('personal_recommendations')
    .insert(recommendations)
    .select();

  if (error) throw error;
  return data;
};

export const fetchUserRecommendations = async (userId: string): Promise<PersonalRecommendation[]> => {
  const { data, error } = await supabase
    .from('personal_recommendations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const markRecommendationCompleted = async (recommendationId: string): Promise<void> => {
  const { error } = await supabase
    .from('personal_recommendations')
    .update({ 
      is_completed: true, 
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', recommendationId);

  if (error) throw error;
};
