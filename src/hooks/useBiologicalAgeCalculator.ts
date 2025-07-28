
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BIOMARKERS, ACCURACY_LEVELS } from '@/data/biomarkers';
import { Biomarker, BiologicalAgeResult, AccuracyLevel } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { analyzeBiologicalAgeWithOpenAI } from '@/services/ai/biological-age-analysis';
import { supabase } from '@/integrations/supabase/client';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { useBiologicalAgeHistory } from '@/hooks/useBiologicalAgeHistory';
import { useBiomarkerHistory } from '@/hooks/useBiomarkerHistory';

export const useBiologicalAgeCalculator = (healthProfile: HealthProfileData | null) => {
  const { user } = useSmartAuth();
  const { saveSnapshot } = useBiologicalAgeHistory();
  const { saveBiomarkerData } = useBiomarkerHistory();
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
      console.log('User biomarkers data:', userBiomarkers);

      // Update biomarkers with user data
      const updatedBiomarkers = biomarkers.map(biomarker => {
        // Try to find matching biomarker by exact or very close name match
        const userBiomarker = userBiomarkers.find(ub => {
          if (!ub.name || !biomarker.name) return false;
          
          const ubName = ub.name.toLowerCase().trim();
          const biomarkerName = biomarker.name.toLowerCase().trim();
          
          // Exact match
          if (ubName === biomarkerName) return true;
          
          // Specific cardiovascular matches
          if (biomarkerName.includes('общий холестерин') && ubName.includes('холестерин') && !ubName.includes('лпнп') && !ubName.includes('лпвп')) return true;
          if (biomarkerName.includes('лпнп') && (ubName.includes('лпнп') || ubName.includes('ldl') || ubName.includes('плохой холестерин'))) return true;
          if (biomarkerName.includes('лпвп') && (ubName.includes('лпвп') || ubName.includes('hdl') || ubName.includes('хороший холестерин'))) return true;
          if (biomarkerName.includes('триглицериды') && ubName.includes('триглицерид')) return true;
          if (biomarkerName.includes('с-реактивный белок') && (ubName.includes('срб') || ubName.includes('c-реактивный') || ubName.includes('crp'))) return true;
          if (biomarkerName.includes('гомоцистеин') && ubName.includes('гомоцистеин')) return true;
          
          // Use general blood test markers for cardiovascular assessment where applicable
          // СОЭ can indicate inflammation (cardiovascular risk)
          if (biomarkerName.includes('соэ') && (ubName.includes('соэ') || ubName.includes('скорость оседания'))) return true;
          
          // Metabolic matches
          if (biomarkerName.includes('глюкоза') && ubName.includes('глюкоза')) return true;
          if (biomarkerName.includes('гликированный гемоглобин') && (ubName.includes('hba1c') || ubName.includes('гликированный'))) return true;
          if (biomarkerName.includes('инсулин') && ubName.includes('инсулин') && !ubName.includes('homa')) return true;
          
          // Kidney function
          if (biomarkerName.includes('креатинин') && ubName.includes('креатинин')) return true;
          if (biomarkerName.includes('мочевина') && ubName.includes('мочевина')) return true;
          
          // Liver function  
          if (biomarkerName.includes('алт') && (ubName.includes('алт') || ubName.includes('аланин'))) return true;
          if (biomarkerName.includes('аст') && (ubName.includes('аст') || ubName.includes('аспартат'))) return true;
          if (biomarkerName.includes('билирубин') && ubName.includes('билирубин')) return true;
          
          // Vitamins
          if (biomarkerName.includes('витамин d') && (ubName.includes('витамин d') || ubName.includes('25-oh'))) return true;
          if (biomarkerName.includes('витамин b12') && (ubName.includes('b12') || ubName.includes('цианокобаламин'))) return true;
          if (biomarkerName.includes('фолиевая кислота') && (ubName.includes('фолиевая') || ubName.includes('фолат'))) return true;
          
          return false;
        });

        if (userBiomarker && userBiomarker.value) {
          const numericValue = parseFloat(userBiomarker.value);
          if (!isNaN(numericValue)) {
            console.log(`Auto-filling biomarker: ${biomarker.name} with value: ${numericValue} from DB biomarker: ${userBiomarker.name}`);
            return {
              ...biomarker,
              value: numericValue,
              status: 'filled' as const
            };
          }
        }
        return biomarker;
      });

      const filledCount = updatedBiomarkers.filter(b => b.status === 'filled').length;
      console.log(`Total filled biomarkers after DB load: ${filledCount}`);
      
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
    setBiomarkers(prev => {
      const newBiomarkers = prev.map(biomarker => 
        biomarker.id === biomarkerId 
          ? { ...biomarker, value, status: 'filled' as const }
          : biomarker
      );
      
      // Check for achievements
      const filledCount = newBiomarkers.filter(b => b.status === 'filled').length;
      
      // Import and check achievements dynamically to avoid circular dependencies
      import('@/components/biological-age/AchievementToast').then(({ checkAchievements }) => {
        checkAchievements(filledCount, newBiomarkers);
      });
      
      return newBiomarkers;
    });
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
      
      // Сохраняем результат в историю
      try {
        const snapshot = await saveSnapshot(results, filledBiomarkers.length);
        if (snapshot) {
          // Сохраняем данные биомаркеров с привязкой к снимку
          await saveBiomarkerData(filledBiomarkers, snapshot.id, 'biological_age_calculation');
        }
      } catch (saveError) {
        console.error('Error saving biological age data:', saveError);
        // Не показываем ошибку пользователю, так как основной расчет прошел успешно
      }
      
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
