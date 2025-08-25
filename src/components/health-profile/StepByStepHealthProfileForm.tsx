
import React, { useState, useCallback } from "react";
import { User, Activity, Brain, Apple, Moon, FileText, Stethoscope, Target, Pill, ArrowLeft, ArrowRight } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import PersonalInfoSection from "./PersonalInfoSection";
import PhysicalHealthSection from "./PhysicalHealthSection";
import MentalHealthSection from "./MentalHealthSection";
import LifestyleSection from "./LifestyleSection";
import SleepSection from "./SleepSection";
import LabResultsSection from "./LabResultsSection";
import MedicalHistorySection from "./MedicalHistorySection";
import MedicationsSection from "./MedicationsSection";
import HealthGoalsSection from "./HealthGoalsSection";
import { StepConfig } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();

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
      id: 'medications',
      title: "Принимаемые лекарства",
      subtitle: "Текущие препараты и добавки",
      icon: Pill,
      component: <MedicationsSection data={healthProfile} onChange={handleChange} />
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

  if (isMobile) {
    return (
      <div className="w-full max-w-sm mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-50">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-blue-600 text-base font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Отмена
          </button>
          <span className="text-gray-600 text-base">
            {currentStep + 1} из {steps.length}
          </span>
        </div>

        {/* Content */}
        <div className="pb-32">
          {/* Main Title */}
          <div className="px-5 pb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {currentStepData.title}
            </h1>
            <p className="text-base text-gray-600">
              {currentStepData.subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 mx-5 mt-5 mb-8">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Icon Section */}
          <div className="px-5 pb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <currentStepData.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-0.5">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStepData.subtitle}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-5">
            <div className="space-y-6">
              {currentStepData.component}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 px-5 py-4">
          <div className="flex gap-3 mb-4 max-w-sm mx-auto">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={cn(
                "flex-1 h-12 rounded-lg text-base font-semibold transition-all flex items-center justify-center gap-2",
                isFirstStep
                  ? "bg-transparent text-gray-400 cursor-not-allowed"
                  : "bg-transparent text-gray-600 hover:bg-gray-200"
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>
            
            {isLastStep ? (
              <button
                onClick={onSave}
                className="flex-1 h-12 bg-green-600 text-white rounded-lg text-base font-semibold hover:bg-green-700 transition-colors"
              >
                Сохранить
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 h-12 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Далее
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version remains the same for now
  return (
    <div className="space-y-6">
      {/* Desktop content unchanged */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Профиль здоровья</h2>
            <p className="text-gray-600">Заполните информацию для персональных рекомендаций</p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            Отмена
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Шаг {currentStep + 1} из {steps.length}</span>
            <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <currentStepData.icon className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600">
              {currentStepData.subtitle}
            </p>
          </div>
        </div>
        
        {currentStepData.component}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={cn(
              "px-6 py-2 rounded-lg font-medium transition-colors",
              isFirstStep
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Назад
          </button>
          
          {isLastStep ? (
            <button
              onClick={onSave}
              className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Сохранить профиль
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Далее
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepByStepHealthProfileForm;
