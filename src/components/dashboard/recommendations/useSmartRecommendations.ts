
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
      setRecommendations([]);
      return;
    }

    setIsGenerating(true);
    console.log('Generating recommendations for goals:', healthProfile.healthGoals);
    console.log('User profile data:', {
      age: healthProfile.age,
      gender: healthProfile.gender,
      weight: healthProfile.weight,
      height: healthProfile.height,
      exerciseFrequency: healthProfile.exerciseFrequency,
      chronicConditions: healthProfile.chronicConditions,
      medications: healthProfile.medications,
      stressLevel: healthProfile.stressLevel,
      sleepHours: healthProfile.sleepHours
    });
    
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
        console.error('Supabase function error:', error);
        toast.error('Ошибка при генерации рекомендаций');
        
        // Показываем fallback рекомендации при ошибке
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
        setRecommendations(fallbackRecommendations);
        return;
      }

      console.log('Function response data:', data);

      if (data?.recommendations && Array.isArray(data.recommendations)) {
        console.log('Successfully received recommendations:', data.recommendations);
        setRecommendations(data.recommendations);
        toast.success('Персональные рекомендации готовы!');
      } else {
        console.log('No recommendations in response or invalid format');
        toast.error('Не удалось получить рекомендации');
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Ошибка при генерации рекомендаций');
      setRecommendations([]);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (healthProfile?.healthGoals && healthProfile.healthGoals.length > 0) {
      console.log('Health profile loaded with goals:', healthProfile.healthGoals);
      generateRecommendations();
    } else {
      console.log('No health goals found in profile, clearing recommendations');
      setRecommendations([]);
    }
  }, [healthProfile?.healthGoals, healthProfile?.age, healthProfile?.gender, healthProfile?.weight]);

  return {
    recommendations,
    isGenerating,
    generateRecommendations
  };
};
