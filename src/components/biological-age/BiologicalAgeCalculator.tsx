
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { BIOMARKERS, ACCURACY_LEVELS } from '@/data/biomarkers';
import { Biomarker, BiologicalAgeResult, AccuracyLevel } from '@/types/biologicalAge';
import UserProfileDisplay from './UserProfileDisplay';
import BiomarkerCategories from './BiomarkerCategories';
import AccuracyIndicator from './AccuracyIndicator';
import CalculationControls from './CalculationControls';
import BiologicalAgeResults from './BiologicalAgeResults';
import { analyzeBiologicalAgeWithOpenAI } from '@/services/ai/biological-age-analysis';
import { toast } from 'sonner';

const BiologicalAgeCalculator = () => {
  const { healthProfile, isLoading } = useHealthProfile();
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

  // Обновляем биомаркеры на основе профиля здоровья
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

  // Обновляем уровень точности
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
      const biomarkerData = {
        chronological_age: healthProfile.age,
        gender: healthProfile.gender,
        height: healthProfile.height,
        weight: healthProfile.weight,
        lifestyle_factors: {
          exercise_frequency: healthProfile.exerciseFrequency,
          stress_level: healthProfile.stressLevel,
          sleep_hours: healthProfile.sleepHours,
          smoking_status: healthProfile.smokingStatus || 'never',
          alcohol_consumption: healthProfile.alcoholConsumption || 'never'
        },
        biomarkers: filledBiomarkers.map(b => ({
          name: b.name,
          value: b.value!,
          unit: b.unit,
          normal_range: b.normal_range,
          category: b.category
        })),
        chronic_conditions: healthProfile.chronicConditions || [],
        medications: healthProfile.medications || []
      };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!healthProfile) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Сначала заполните профиль здоровья для использования калькулятора биологического возраста.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfileDisplay healthProfile={healthProfile} />
      
      <AccuracyIndicator accuracy={currentAccuracy} />

      {connectionError && (
        <Alert className="border-red-200 bg-red-50">
          <WifiOff className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Ошибка подключения:</strong> {connectionError}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retryCalculation}
              className="ml-4"
            >
              <Wifi className="h-4 w-4 mr-2" />
              Повторить
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <BiomarkerCategories
        biomarkers={biomarkers}
        onValueChange={handleBiomarkerValueChange}
        healthProfile={healthProfile}
      />

      <CalculationControls
        onCalculate={calculateBiologicalAge}
        isCalculating={isCalculating}
        currentAccuracy={currentAccuracy}
        totalBiomarkers={biomarkers.length}
      />

      {results && (
        <BiologicalAgeResults results={results} />
      )}
    </div>
  );
};

export default BiologicalAgeCalculator;
