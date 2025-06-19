
import { supabase } from '@/integrations/supabase/client';
import { PersonalRecommendation } from '@/types/recommendations';

export const generatePersonalRecommendations = async (
  userId: string, 
  healthProfile: any
): Promise<Omit<PersonalRecommendation, 'id' | 'created_at' | 'updated_at'>[]> => {
  const recommendations: Omit<PersonalRecommendation, 'id' | 'created_at' | 'updated_at'>[] = [];

  // Рекомендации по физической активности
  if (healthProfile.physicalActivity === 'sedentary') {
    recommendations.push({
      user_id: userId,
      title: 'Увеличьте физическую активность',
      description: 'Начните с 15-20 минут ходьбы в день. Это поможет улучшить здоровье сердца и общее самочувствие.',
      category: 'exercise',
      priority: 'high',
      is_completed: false,
      source_data: { based_on: 'physical_activity_level' }
    });
  }

  // Рекомендации по сну
  if (healthProfile.sleepHours && healthProfile.sleepHours < 7) {
    recommendations.push({
      user_id: userId,
      title: 'Улучшите качество сна',
      description: 'Старайтесь спать 7-9 часов в сутки. Установите режим сна и избегайте экранов перед сном.',
      category: 'sleep',
      priority: 'high',
      is_completed: false,
      source_data: { based_on: 'sleep_hours', current_hours: healthProfile.sleepHours }
    });
  }

  // Рекомендации по стрессу
  if (healthProfile.stressLevel && healthProfile.stressLevel > 7) {
    recommendations.push({
      user_id: userId,
      title: 'Управление стрессом',
      description: 'Практикуйте техники релаксации: медитацию, глубокое дыхание или йогу 10-15 минут в день.',
      category: 'stress',
      priority: 'high',
      is_completed: false,
      source_data: { based_on: 'stress_level', current_level: healthProfile.stressLevel }
    });
  }

  // Рекомендации по питанию
  if (healthProfile.weight && healthProfile.height) {
    const bmi = healthProfile.weight / Math.pow(healthProfile.height / 100, 2);
    if (bmi > 25) {
      recommendations.push({
        user_id: userId,
        title: 'Оптимизация веса',
        description: 'Рассмотрите сбалансированную диету с увеличением потребления овощей и фруктов.',
        category: 'nutrition',
        priority: 'medium',
        is_completed: false,
        source_data: { based_on: 'bmi', current_bmi: Math.round(bmi * 10) / 10 }
      });
    }
  }

  // Рекомендации по курению
  if (healthProfile.smokingStatus === 'current') {
    recommendations.push({
      user_id: userId,
      title: 'Отказ от курения',
      description: 'Обратитесь к специалисту для составления плана отказа от курения. Это значительно улучшит ваше здоровье.',
      category: 'lifestyle',
      priority: 'high',
      is_completed: false,
      source_data: { based_on: 'smoking_status' }
    });
  }

  // Общие рекомендации
  recommendations.push({
    user_id: userId,
    title: 'Регулярные медицинские осмотры',
    description: 'Проходите профилактические осмотры у врача раз в год для раннего выявления проблем со здоровьем.',
    category: 'medical',
    priority: 'medium',
    is_completed: false,
    source_data: { based_on: 'general_health' }
  });

  return recommendations;
};

export const saveRecommendations = async (recommendations: Omit<PersonalRecommendation, 'id' | 'created_at' | 'updated_at'>[]) => {
  const { error } = await supabase
    .from('personal_recommendations')
    .insert(recommendations);

  if (error) {
    console.error('Error saving recommendations:', error);
    throw error;
  }
};

export const fetchUserRecommendations = async (userId: string): Promise<PersonalRecommendation[]> => {
  const { data, error } = await supabase
    .from('personal_recommendations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }

  return data as PersonalRecommendation[];
};

export const markRecommendationCompleted = async (recommendationId: string) => {
  const { error } = await supabase
    .from('personal_recommendations')
    .update({ 
      is_completed: true, 
      completed_at: new Date().toISOString() 
    })
    .eq('id', recommendationId);

  if (error) {
    console.error('Error marking recommendation as completed:', error);
    throw error;
  }
};
