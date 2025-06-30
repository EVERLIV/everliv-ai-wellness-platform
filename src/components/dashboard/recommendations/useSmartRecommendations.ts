
import { useState, useEffect, useRef } from 'react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SmartRecommendation } from './types';

export const useSmartRecommendations = () => {
  const { healthProfile } = useHealthProfile();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Используем ref для отслеживания предыдущих целей
  const previousGoalsRef = useRef<string[]>([]);
  const recommendationsGeneratedRef = useRef(false);

  // Функция для сравнения массивов целей
  const areGoalsEqual = (goals1: string[], goals2: string[]) => {
    if (goals1.length !== goals2.length) return false;
    const sorted1 = [...goals1].sort();
    const sorted2 = [...goals2].sort();
    return sorted1.every((goal, index) => goal === sorted2[index]);
  };

  const generateRecommendations = async () => {
    if (!healthProfile?.healthGoals || healthProfile.healthGoals.length === 0) {
      console.log('No health goals found, clearing recommendations');
      setRecommendations([]);
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

      if (data?.recommendations && Array.isArray(data.recommendations)) {
        console.log('Successfully received recommendations:', data.recommendations);
        setRecommendations(data.recommendations);
        toast.success('Персональные рекомендации готовы!');
      } else {
        console.log('No recommendations in response or invalid format');
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
    const currentGoals = healthProfile?.healthGoals || [];
    const previousGoals = previousGoalsRef.current;

    // Проверяем, есть ли цели и изменились ли они
    if (currentGoals.length > 0) {
      const goalsChanged = !areGoalsEqual(currentGoals, previousGoals);
      const needsGeneration = goalsChanged || !recommendationsGeneratedRef.current;

      if (needsGeneration) {
        console.log('Goals changed or first generation:', {
          previousGoals,
          currentGoals,
          goalsChanged,
          firstGeneration: !recommendationsGeneratedRef.current
        });
        
        generateRecommendations();
        recommendationsGeneratedRef.current = true;
        previousGoalsRef.current = [...currentGoals];
      } else {
        console.log('Goals unchanged, skipping regeneration');
      }
    } else {
      console.log('No health goals found, clearing recommendations');
      setRecommendations([]);
      recommendationsGeneratedRef.current = false;
      previousGoalsRef.current = [];
    }
  }, [
    healthProfile?.healthGoals?.join(','), // Используем join для точного отслеживания изменений
    healthProfile?.age,
    healthProfile?.gender,
    healthProfile?.weight
  ]);

  return {
    recommendations,
    isGenerating,
    generateRecommendations: () => {
      // Принудительная генерация - сбрасываем флаги
      recommendationsGeneratedRef.current = false;
      previousGoalsRef.current = [];
      generateRecommendations();
    }
  };
};
