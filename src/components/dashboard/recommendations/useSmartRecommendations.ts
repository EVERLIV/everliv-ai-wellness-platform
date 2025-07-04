import { useHealthProfile } from '@/hooks/useHealthProfile';
import { supabase } from '@/integrations/supabase/client';
import { useCachedRecommendations } from '@/hooks/useCachedRecommendations';
import { SmartRecommendation } from './types';

export const useSmartRecommendations = () => {
  const { healthProfile } = useHealthProfile();

  // Создаем источник данных для отслеживания изменений
  const sourceData = {
    healthGoals: healthProfile?.healthGoals || [],
    userProfile: {
      age: healthProfile?.age,
      gender: healthProfile?.gender,
      weight: healthProfile?.weight,
      height: healthProfile?.height,
      exerciseFrequency: healthProfile?.exerciseFrequency,
      chronicConditions: healthProfile?.chronicConditions,
      medications: healthProfile?.medications,
      stressLevel: healthProfile?.stressLevel,
      sleepHours: healthProfile?.sleepHours
    }
  };

  // Функция для генерации рекомендаций
  const generateRecommendations = async (): Promise<SmartRecommendation[]> => {
    if (!healthProfile?.healthGoals || healthProfile.healthGoals.length === 0) {
      console.log('No health goals found for dashboard recommendations');
      return [];
    }

    console.log('🔄 Generating dashboard recommendations for goals:', healthProfile.healthGoals);
    
    const { data, error } = await supabase.functions.invoke('generate-goal-recommendations', {
      body: sourceData
    });

    if (error) {
      console.error('Error generating dashboard recommendations:', error);
      
      // Возвращаем fallback рекомендацию при ошибке
      const fallbackRecommendations: SmartRecommendation[] = [
        {
          id: 'fallback-1',
          title: 'Интервальное голодание 16:8',
          description: 'Современный подход к питанию для улучшения метаболизма',
          timeframe: '2-4 недели адаптации',
          category: 'nutrition',
          priority: 'high',
          scientificBasis: 'Исследования 2023г показывают эффективность ИГ для метаболизма. Консультация врача обязательна',
          specificActions: [
            'Окно питания: 12:00-20:00, голодание: 20:00-12:00',
            'Начните с 14:10, постепенно переходя к 16:8',
            'Пейте воду, чай, кофе без сахара в период голодания',
            'Контролируйте самочувствие, при недомогании - прекратите'
          ]
        }
      ];
      return fallbackRecommendations;
    }

    if (!data?.recommendations || !Array.isArray(data.recommendations)) {
      console.log('No valid recommendations in response');
      return [];
    }

    console.log('✅ Generated dashboard recommendations:', data.recommendations);
    return data.recommendations;
  };

  // Используем кэшированные рекомендации
  const cachedRecommendations = useCachedRecommendations(
    'dashboard',
    sourceData,
    generateRecommendations
  );

  return {
    recommendations: cachedRecommendations.recommendations as SmartRecommendation[],
    isGenerating: cachedRecommendations.isGenerating,
    generateRecommendations: cachedRecommendations.regenerateRecommendations
  };
};