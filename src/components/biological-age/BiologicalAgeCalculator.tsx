
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Calculator, TrendingUp, Heart, User } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { BIOMARKERS, ACCURACY_LEVELS } from '@/data/biomarkers';
import { Biomarker, BiologicalAgeResult, AccuracyLevel } from '@/types/biologicalAge';
import BiomarkerCard from './BiomarkerCard';
import BiologicalAgeResults from './BiologicalAgeResults';
import AccuracyIndicator from './AccuracyIndicator';
import { analyzeBiologicalAgeWithOpenAI } from '@/services/ai/biological-age-analysis';
import { toast } from 'sonner';

const BiologicalAgeCalculator = () => {
  const { healthProfile, isLoading } = useHealthProfile();
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(BIOMARKERS);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<BiologicalAgeResult | null>(null);
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
      toast.error('Ошибка при расчете биологического возраста');
    } finally {
      setIsCalculating(false);
    }
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

  const getCategoryTitle = (category: string) => {
    const titles = {
      'cardiovascular': 'Сердечно-сосудистая система',
      'metabolic': 'Метаболические маркеры',
      'hormonal': 'Гормональная система',
      'inflammatory': 'Воспалительные маркеры',
      'oxidative_stress': 'Окислительный стресс',
      'kidney_function': 'Почечная функция',
      'liver_function': 'Печеночная функция',
      'telomeres_epigenetics': 'Теломеры и эпигенетика'
    };
    return titles[category as keyof typeof titles] || category;
  };

  return (
    <div className="space-y-6">
      {/* Информация о пользователе из профиля здоровья */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Данные из профиля здоровья
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Возраст:</span> {healthProfile.age} лет
            </div>
            <div>
              <span className="font-medium">Пол:</span> {
                healthProfile.gender === 'male' ? 'Мужской' : 
                healthProfile.gender === 'female' ? 'Женский' : 'Другой'
              }
            </div>
            <div>
              <span className="font-medium">Рост:</span> {healthProfile.height} см
            </div>
            <div>
              <span className="font-medium">Вес:</span> {healthProfile.weight} кг
            </div>
            <div>
              <span className="font-medium">Курение:</span> {
                healthProfile.smokingStatus === 'never' ? 'Не курю' :
                healthProfile.smokingStatus === 'former' ? 'Бросил' : 'Курю'
              }
            </div>
            <div>
              <span className="font-medium">Алкоголь:</span> {
                healthProfile.alcoholConsumption === 'never' ? 'Не употребляю' :
                healthProfile.alcoholConsumption === 'rarely' ? 'Редко' :
                healthProfile.alcoholConsumption === 'occasionally' ? 'Иногда' : 'Регулярно'
              }
            </div>
            <div>
              <span className="font-medium">Сон:</span> {healthProfile.sleepHours} часов
            </div>
            <div>
              <span className="font-medium">Упражнения:</span> {healthProfile.exerciseFrequency} раз/неделю
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Заголовок и описание */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Рекомендуемые анализы для определения биологического возраста
          </CardTitle>
          <p className="text-sm text-gray-600">
            Добавьте результаты анализов для более точного расчета биологического возраста
          </p>
        </CardHeader>
        <CardContent>
          <AccuracyIndicator accuracy={currentAccuracy} />
        </CardContent>
      </Card>

      {/* Дисклеймер */}
      <Alert>
        <Heart className="h-4 w-4" />
        <AlertDescription>
          <strong>Важно:</strong> Результат не является медицинским диагнозом. 
          Консультируйтесь с врачом перед принятием решений. 
          Чем больше анализов предоставлено, тем точнее результат.
        </AlertDescription>
      </Alert>

      {/* Биомаркеры по категориям */}
      <div className="space-y-6">
        {Object.entries(
          biomarkers.reduce((acc, biomarker) => {
            if (!acc[biomarker.category]) {
              acc[biomarker.category] = [];
            }
            acc[biomarker.category].push(biomarker);
            return acc;
          }, {} as Record<string, Biomarker[]>)
        ).map(([category, categoryBiomarkers]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">
                {getCategoryTitle(category)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryBiomarkers.map(biomarker => (
                  <BiomarkerCard
                    key={biomarker.id}
                    biomarker={biomarker}
                    onValueChange={handleBiomarkerValueChange}
                    healthProfile={healthProfile}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Кнопка расчета */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={calculateBiologicalAge}
              disabled={isCalculating || currentAccuracy.current_tests < ACCURACY_LEVELS.basic.min}
              size="lg"
              className="w-full max-w-md"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Рассчитываем...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Рассчитать биологический возраст
                </>
              )}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Заполнено анализов: {currentAccuracy.current_tests} из {biomarkers.length}
              <br />
              Точность расчета: {currentAccuracy.percentage}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Результаты */}
      {results && (
        <BiologicalAgeResults results={results} />
      )}
    </div>
  );
};

export default BiologicalAgeCalculator;
