import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Activity, 
  Zap, 
  Trophy,
  CheckCircle,
  Target,
  ArrowRight
} from 'lucide-react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import QuickStartOption from './QuickStartOption';
import BiomarkerStepCard from './BiomarkerStepCard';
import BiologicalAgeResults from './BiologicalAgeResults';

interface BiologicalAgeWizardProps {
  biomarkers: Biomarker[];
  onValueChange: (biomarkerId: string, value: number) => void;
  healthProfile: HealthProfileData;
  onCalculate: () => void;
  isCalculating: boolean;
  results: any;
  currentAccuracy: any;
}

const WIZARD_STEPS = [
  {
    id: 'start',
    title: 'Начало',
    description: 'Выберите способ анализа',
    icon: Target
  },
  {
    id: 'essential',
    title: 'Основные показатели',
    description: 'Ключевые биомаркеры для базового анализа',
    icon: Heart,
    biomarkerCount: 8
  },
  {
    id: 'extended',
    title: 'Расширенный анализ',
    description: 'Дополнительные данные для точности',
    icon: Activity,
    biomarkerCount: 16
  },
  {
    id: 'comprehensive',
    title: 'Полный анализ',
    description: 'Максимальная точность расчета',
    icon: Zap,
    biomarkerCount: 24
  },
  {
    id: 'results',
    title: 'Результаты',
    description: 'Ваш биологический возраст',
    icon: Trophy
  }
];

const BiologicalAgeWizard: React.FC<BiologicalAgeWizardProps> = ({
  biomarkers,
  onValueChange,
  healthProfile,
  onCalculate,
  isCalculating,
  results,
  currentAccuracy
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'quick' | 'step-by-step' | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const filledBiomarkers = biomarkers.filter(b => b.status === 'filled');
  const progress = Math.min(100, (filledBiomarkers.length / 24) * 100);

  // Auto-advance logic
  useEffect(() => {
    const filled = filledBiomarkers.length;
    if (filled >= 8 && !completedSteps.has('essential')) {
      setCompletedSteps(prev => new Set([...prev, 'essential']));
    }
    if (filled >= 16 && !completedSteps.has('extended')) {
      setCompletedSteps(prev => new Set([...prev, 'extended']));
    }
    if (filled >= 24 && !completedSteps.has('comprehensive')) {
      setCompletedSteps(prev => new Set([...prev, 'comprehensive']));
    }
  }, [filledBiomarkers.length]);

  const getEssentialBiomarkers = () => {
    // Return the most critical biomarkers for quick analysis
    return biomarkers.filter(b => 
      b.importance === 'high' && 
      ['cardiovascular', 'metabolic', 'hormonal', 'oxidative_stress'].includes(b.category)
    ).slice(0, 8); // Ensure exactly 8 for quick start
  };

  const getExtendedBiomarkers = () => {
    return biomarkers.filter(b => 
      (b.importance === 'high' || b.importance === 'medium') &&
      !getEssentialBiomarkers().some(eb => eb.id === b.id)
    ).slice(0, 8);
  };

  const getComprehensiveBiomarkers = () => {
    const essential = getEssentialBiomarkers();
    const extended = getExtendedBiomarkers();
    return biomarkers.filter(b => 
      !essential.some(eb => eb.id === b.id) &&
      !extended.some(eb => eb.id === b.id)
    ).slice(0, 8);
  };

  const getCurrentStepBiomarkers = () => {
    const step = WIZARD_STEPS[currentStep];
    switch (step.id) {
      case 'essential':
        return getEssentialBiomarkers();
      case 'extended':
        return getExtendedBiomarkers();
      case 'comprehensive':
        return getComprehensiveBiomarkers();
      default:
        return [];
    }
  };

  const getStepStatus = (stepId: string) => {
    if (completedSteps.has(stepId)) return 'completed';
    const step = WIZARD_STEPS.find(s => s.id === stepId);
    if (!step || !step.biomarkerCount) return 'available';
    
    const requiredCount = step.biomarkerCount;
    return filledBiomarkers.length >= requiredCount ? 'completed' : 'available';
  };

  const canProceedToResults = () => {
    return filledBiomarkers.length >= 8;
  };

  const handleQuickStart = () => {
    setSelectedMode('quick');
    // Start with essential biomarkers for quick input
    setCurrentStep(1); // Go to essential step instead of jumping to results
  };

  const handleStepByStep = () => {
    setSelectedMode('step-by-step');
    setCurrentStep(1); // Start with essential
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCalculateAndAdvance = () => {
    onCalculate();
    setCurrentStep(WIZARD_STEPS.length - 1);
  };

  const renderStartStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
          <Target className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Определение биологического возраста</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Выберите удобный способ анализа ваших биомаркеров для получения точной оценки биологического возраста
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <QuickStartOption 
          title="Быстрый старт"
          description="Только 8 ключевых показателей"
          icon={Zap}
          duration="5-7 минут"
          accuracy="65-75%"
          onClick={handleQuickStart}
        />
        
        <QuickStartOption 
          title="Пошаговый анализ"
          description="Подробный анализ для максимальной точности"
          icon={Target}
          duration="10-15 минут"
          accuracy="80-95%"
          onClick={handleStepByStep}
        />
      </div>

      {filledBiomarkers.length > 0 && (
        <div className="border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">
                У вас уже есть {filledBiomarkers.length} заполненных показателей
              </p>
              <p className="text-sm text-green-700">
                Вы можете сразу получить результат или дополнить данные для большей точности
              </p>
            </div>
          </div>
          {canProceedToResults() && (
            <Button 
              onClick={handleCalculateAndAdvance}
              className="mt-4 w-full"
              disabled={isCalculating}
            >
              Получить результат сейчас
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const renderBiomarkerStep = () => {
    const stepBiomarkers = getCurrentStepBiomarkers();
    const step = WIZARD_STEPS[currentStep];
    
    // For quick start mode, only show essential biomarkers in first step
    const displayBiomarkers = selectedMode === 'quick' && currentStep === 1 
      ? getEssentialBiomarkers().slice(0, 8) // Limit to 8 for quick start
      : stepBiomarkers;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <step.icon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">
              {selectedMode === 'quick' ? 'Быстрый анализ - Основные показатели' : step.title}
            </h2>
          </div>
          <p className="text-gray-600">
            {selectedMode === 'quick' ? 'Заполните 8 ключевых биомаркеров для быстрого расчета' : step.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {displayBiomarkers.map(biomarker => (
            <BiomarkerStepCard
              key={biomarker.id}
              biomarker={biomarker}
              onValueChange={onValueChange}
              healthProfile={healthProfile}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep <= 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Заполнено: {displayBiomarkers.filter(b => b.status === 'filled').length} из {displayBiomarkers.length}
            </p>
            {selectedMode === 'quick' && (
              <p className="text-xs text-green-600 mt-1">
                Быстрый режим: только ключевые показатели
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {canProceedToResults() && (
              <Button 
                onClick={handleCalculateAndAdvance}
                disabled={isCalculating}
              >
                Рассчитать
                <Trophy className="ml-2 h-4 w-4" />
              </Button>
            )}
            {selectedMode !== 'quick' && (
              <Button 
                variant="outline"
                onClick={nextStep}
                disabled={currentStep >= WIZARD_STEPS.length - 2}
              >
                Далее
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      {/* Progress Header */}
      <div className="border border-gray-200 bg-white p-3">
        <div className="space-y-4">
          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {WIZARD_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center ${index < WIZARD_STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${currentStep === index 
                      ? 'bg-blue-600 text-white' 
                      : getStepStatus(step.id) === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {getStepStatus(step.id) === 'completed' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium">{step.title}</p>
                    {step.biomarkerCount && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.min(filledBiomarkers.length, step.biomarkerCount)}/{step.biomarkerCount}
                      </Badge>
                    )}
                  </div>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>

          {/* Overall progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Общий прогресс</span>
              <span>{filledBiomarkers.length}/24 биомаркеров</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-600 text-center">
              Точность: {currentAccuracy.percentage}% • {currentAccuracy.description}
            </p>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="border border-gray-200 bg-white p-3">
        {currentStep === 0 && renderStartStep()}
        {currentStep > 0 && currentStep < WIZARD_STEPS.length - 1 && renderBiomarkerStep()}
        {currentStep === WIZARD_STEPS.length - 1 && results && (
          <BiologicalAgeResults results={results} />
        )}
        {currentStep === WIZARD_STEPS.length - 1 && !results && (
          <div className="text-center py-8">
            <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Готово к расчету
            </h3>
            <p className="text-gray-600 mb-6">
              У вас достаточно данных для определения биологического возраста
            </p>
            <Button 
              onClick={onCalculate}
              disabled={isCalculating}
              size="lg"
            >
              {isCalculating ? 'Анализируем...' : 'Рассчитать биологический возраст'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiologicalAgeWizard;