
import React, { useState, useCallback } from "react";
import { User, Activity, Brain, Apple, Moon, FileText, Stethoscope, Target } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import PersonalInfoSection from "./PersonalInfoSection";
import PhysicalHealthSection from "./PhysicalHealthSection";
import MentalHealthSection from "./MentalHealthSection";
import LifestyleSection from "./LifestyleSection";
import SleepSection from "./SleepSection";
import LabResultsSection from "./LabResultsSection";
import MedicalHistorySection from "./MedicalHistorySection";
import HealthGoalsSection from "./HealthGoalsSection";
import StepContent from "./StepContent";
import FormControls from "./FormControls";
import MobileStepDots from "./MobileStepDots";
import { StepConfig } from "./types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StepByStepHealthProfileFormProps {
  healthProfile: HealthProfileData;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const StepByStepHealthProfileForm: React.FC<StepByStepHealthProfileFormProps> = ({
  healthProfile,
  onSave,
  onCancel,
  onChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Используем useCallback для предотвращения лишних ререндеров
  const handleChange = useCallback((updates: Partial<HealthProfileData>) => {
    console.log('Form change:', updates);
    onChange(updates);
  }, [onChange]);

  const steps: StepConfig[] = [
    {
      id: 'personal',
      title: "Личная информация",
      subtitle: "Основные данные о вас",
      icon: User,
      component: <PersonalInfoSection data={healthProfile} onChange={handleChange} />
    },
    {
      id: 'physical',
      title: "Физическое здоровье",
      subtitle: "Активность и физические показатели",
      icon: Activity,
      component: <PhysicalHealthSection data={healthProfile} onChange={handleChange} />
    },
    {
      id: 'mental',
      title: "Психическое здоровье",
      subtitle: "Стресс и эмоциональное состояние",
      icon: Brain,
      component: <MentalHealthSection data={healthProfile} onChange={handleChange} />
    },
    {
      id: 'lifestyle',
      title: "Образ жизни",
      subtitle: "Питание и привычки",
      icon: Apple,
      component: <LifestyleSection data={healthProfile} onChange={handleChange} />
    },
    {
      id: 'sleep',
      title: "Сон и отдых",
      subtitle: "Качество и продолжительность сна",
      icon: Moon,
      component: <SleepSection data={healthProfile} onChange={handleChange} />
    },
    {
      id: 'goals',
      title: "Цели здоровья",
      subtitle: "Ваши планы и задачи",
      icon: Target,
      component: <HealthGoalsSection healthProfile={healthProfile} isEditMode={true} onUpdate={handleChange} />
    },
    {
      id: 'medical',
      title: "Медицинская история",
      subtitle: "Заболевания и лечение",
      icon: FileText,
      component: <MedicalHistorySection data={healthProfile} onChange={handleChange} />
    },
    {
      id: 'lab',
      title: "Анализы",
      subtitle: "Результаты лабораторных исследований",
      icon: Stethoscope,
      component: <LabResultsSection labResults={healthProfile.labResults || {}} onChange={(labResults) => handleChange({ labResults })} />
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  }, [isLastStep]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  }, [isFirstStep]);

  const handleStepClick = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

  return (
    <div className="space-y-6">
      {/* Modern Progress Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Профиль здоровья</h2>
            <p className="text-gray-600">Заполните информацию для персональных рекомендаций</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Отмена</span>
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Шаг {currentStep + 1} из {steps.length}</span>
            <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Step Content */}
      <StepContent
        title={currentStepData.title}
        subtitle={currentStepData.subtitle}
        icon={currentStepData.icon}
      >
        {currentStepData.component}
      </StepContent>

      {/* Form Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <FormControls
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={onSave}
        />

        <MobileStepDots
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepClick={handleStepClick}
        />
      </div>
    </div>
  );
};

export default StepByStepHealthProfileForm;
