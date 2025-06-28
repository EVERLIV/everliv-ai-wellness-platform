
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BIOMARKERS, ACCURACY_LEVELS } from '@/data/biomarkers';
import { Biomarker, BiologicalAgeResult, AccuracyLevel } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { analyzeBiologicalAgeWithOpenAI } from '@/services/ai/biological-age-analysis';
import { supabase } from '@/integrations/supabase/client';
import { useSmartAuth } from '@/hooks/useSmartAuth';

export const useBiologicalAgeCalculator = (healthProfile: HealthProfileData | null) => {
  const { user } = useSmartAuth();
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(BIOMARKERS);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<BiologicalAgeResult | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentAccuracy, setCurrentAccuracy] = useState<AccuracyLevel>({
    level: 'basic',
    percentage: 0,
    required_tests: 0,
    current_tests: 0,
    description: 'Недостаточно данных'
  });

  // Load biomarkers from user's lab analyses
  useEffect(() => {
    if (user) {
      loadUserBiomarkers();
    }
  }, [user]);

  // Update biomarkers based on health profile (fallback)
  useEffect(() => {
    if (healthProfile?.labResults) {
      const updatedBiomarkers = biomarkers.map(biomarker => {
        const profileValue = healthProfile.labResults[biomarker.id];
        if (profileValue !== undefined && profileValue !== null) {
          return {
            ...biomarker,
            value: typeof profileValue === 'number' ? profileValue : parseFloat(profileValue.toString()),
            status: 'filled' as const
          };
        }
        return biomarker;
      });
      setBiomarkers(updatedBiomarkers);
    }
  }, [healthProfile]);

  const loadUserBiomarkers = async () => {
    if (!user) return;

    try {
      console.log('Loading user biomarkers for biological age calculation');

      // Get user's analyses
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id')
        .eq('user_id', user.id);

      if (analysesError) {
        console.error('Error fetching analyses:', analysesError);
        return;
      }

      if (!analyses || analyses.length === 0) {
        console.log('No analyses found for user');
        return;
      }

      const analysisIds = analyses.map(a => a.id);

      // Get biomarkers for those analyses
      const { data: userBiomarkers, error: biomarkersError } = await supabase
        .from('biomarkers')
        .select('name, value, reference_range, status')
        .in('analysis_id', analysisIds);

      if (biomarkersError) {
        console.error('Error fetching biomarkers:', biomarkersError);
        return;
      }

      if (!userBiomarkers || userBiomarkers.length === 0) {
        console.log('No biomarkers found for user');
        return;
      }

      console.log('Found user biomarkers:', userBiomarkers.length);

      // Update biomarkers with user data
      const updatedBiomarkers = biomarkers.map(biomarker => {
        // Try to find matching biomarker by name (case-insensitive)
        const userBiomarker = userBiomarkers.find(ub => 
          ub.name && biomarker.name && 
          ub.name.toLowerCase().includes(biomarker.name.toLowerCase()) ||
          biomarker.name.toLowerCase().includes(ub.name.toLowerCase())
        );

        if (userBiomarker && userBiomarker.value) {
          const numericValue = parseFloat(userBiomarker.value);
          if (!isNaN(numericValue)) {
            return {
              ...biomarker,
              value: numericValue,
              status: 'filled' as const
            };
          }
        }
        return biomarker;
      });

      setBiomarkers(updatedBiomarkers);
      console.log('Updated biomarkers with user data');

    } catch (error) {
      console.error('Error loading user biomarkers:', error);
    }
  };

  // Update accuracy level
  useEffect(() => {
    const filledTests = biomarkers.filter(b => b.status === 'filled').length;
    
    let accuracy: AccuracyLevel;
    if (filledTests >= ACCURACY_LEVELS.comprehensive.min) {
      accuracy = {
        level: 'comprehensive',
        percentage: ACCURACY_LEVELS.comprehensive.percentage,
        required_tests: ACCURACY_LEVELS.comprehensive.min,
        current_tests: filledTests,
        description: ACCURACY_LEVELS.comprehensive.description
      };
    } else if (filledTests >= ACCURACY_LEVELS.extended.min) {
      accuracy = {
        level: 'extended',
        percentage: ACCURACY_LEVELS.extended.percentage,
        required_tests: ACCURACY_LEVELS.extended.min,
        current_tests: filledTests,
        description: ACCURACY_LEVELS.extended.description
      };
    } else if (filledTests >= ACCURACY_LEVELS.basic.min) {
      accuracy = {
        level: 'basic',
        percentage: ACCURACY_LEVELS.basic.percentage,
        required_tests: ACCURACY_LEVELS.basic.min,
        current_tests: filledTests,
        description: ACCURACY_LEVELS.basic.description
      };
    } else {
      accuracy = {
        level: 'basic',
        percentage: 0,
        required_tests: ACCURACY_LEVELS.basic.min,
        current_tests: filledTests,
        description: 'Недостаточно данных'
      };
    }
    
    setCurrentAccuracy(accuracy);
  }, [biomarkers]);

  const handleBiomarkerValueChange = (biomarkerId: string, value: number) => {
    setBiomarkers(prev => prev.map(biomarker => 
      biomarker.id === biomarkerId 
        ? { ...biomarker, value, status: 'filled' as const }
        : biomarker
    ));
  };

  const calculateBiologicalAge = async () => {
    if (!healthProfile) {
      toast.error('Сначала заполните профиль здоровья');
      return;
    }

    if (currentAccuracy.current_tests < ACCURACY_LEVELS.basic.min) {
      toast.error(`Минимум ${ACCURACY_LEVELS.basic.min} анализов требуется для расчета`);
      return;
    }

    setIsCalculating(true);
    setConnectionError(null);
    
    try {
      const filledBiomarkers = biomarkers.filter(b => b.status === 'filled');
      
      // Enhanced biomarker data with user context for gender/age-specific recommendations
      const biomarkerData = {
        chronological_age: healthProfile.age,
        gender: healthProfile.gender || 'unknown',
        height: healthProfile.height,
        weight: healthProfile.weight,
        lifestyle_factors: {
          exercise_frequency: healthProfile.exerciseFrequency,
          stress_level: healthProfile.stressLevel,
          sleep_hours: healthProfile.sleepHours,
          smoking_status: healthProfile.smokingStatus || 'never',
          alcohol_consumption: healthProfile.alcoholConsumption || 'never'
        },
        health_goals: healthProfile.healthGoals || [],
        chronic_conditions: healthProfile.chronicConditions || [],
        medications: healthProfile.medications || [],
        biomarkers: filledBiomarkers.map(b => ({
          name: b.name,
          value: b.value!,
          unit: b.unit,
          normal_range: b.normal_range,
          category: b.category,
          optimal_value: b.normal_range?.optimal || (b.normal_range ? (b.normal_range.min + b.normal_range.max) / 2 : undefined)
        })),
        analysis_context: {
          total_biomarkers: filledBiomarkers.length,
          accuracy_level: currentAccuracy.level,
          user_age: healthProfile.age,
          user_gender: healthProfile.gender,
          // Add age/gender-specific context for recommendations
          age_group: healthProfile.age < 30 ? 'young_adult' : 
                    healthProfile.age < 50 ? 'middle_aged' : 'senior',
          specific_considerations: {
            hormonal_changes: healthProfile.gender === 'female' && healthProfile.age > 40 ? 'perimenopause_menopause' :
                            healthProfile.gender === 'male' && healthProfile.age > 50 ? 'andropause' : 'normal',
            cardiovascular_risk: healthProfile.age > 40 ? 'increased' : 'standard',
            metabolic_changes: healthProfile.age > 35 ? 'age_related_decline' : 'standard'
          }
        }
      };

      console.log('Calculating biological age with enhanced gender/age-specific data:', biomarkerData);

      const aiResults = await analyzeBiologicalAgeWithOpenAI(biomarkerData);
      
      const results: BiologicalAgeResult = {
        biological_age: aiResults.biologicalAge || healthProfile.age,
        chronological_age: healthProfile.age,
        age_difference: (aiResults.biologicalAge || healthProfile.age) - healthProfile.age,
        accuracy_percentage: currentAccuracy.percentage,
        confidence_level: Math.min(95, 50 + (currentAccuracy.current_tests * 2)),
        analysis: aiResults.detailedAnalysis || 'Анализ не доступен',
        recommendations: aiResults.recommendations?.map(r => r.recommendation) || [],
        missing_analyses: aiResults.missingAnalyses || [],
        next_suggested_tests: []
      };

      setResults(results);
      toast.success('Биологический возраст рассчитан успешно!');
    } catch (error) {
      console.error('Error calculating biological age:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setConnectionError(errorMessage);
      
      if (errorMessage.includes('API key')) {
        toast.error('Ошибка конфигурации ИИ. Обратитесь к администратору.');
      } else if (errorMessage.includes('quota') || errorMessage.includes('лимит')) {
        toast.error('Превышен лимит запросов. Попробуйте позже.');
      } else if (errorMessage.includes('подключение') || errorMessage.includes('network')) {
        toast.error('Проблема с подключением к интернету');
      } else {
        toast.error('Ошибка при расчете биологического возраста');
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const retryCalculation = () => {
    setConnectionError(null);
    calculateBiologicalAge();
  };

  return {
    biomarkers,
    isCalculating,
    results,
    connectionError,
    currentAccuracy,
    handleBiomarkerValueChange,
    calculateBiologicalAge,
    retryCalculation
  };
};
