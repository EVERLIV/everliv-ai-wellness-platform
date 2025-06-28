
import React, { useState, useCallback } from "react";
import { User, Activity, Brain, Apple, Moon, FileText, Stethoscope, Target, X, ChevronLeft, ChevronRight } from "lucide-react";
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
      {/* Modern Compact Progress Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Настройка профиля
            </h2>
            <p className="text-gray-600 text-sm">Шаг {currentStep + 1} из {steps.length}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span className="font-medium">{currentStepData.title}</span>
            <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        {/* Step Indicators - Desktop */}
        <div className="hidden lg:flex justify-between mt-6 px-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                index === currentStep 
                  ? 'text-blue-600 bg-blue-50' 
                  : index < currentStep 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                index === currentStep 
                  ? 'border-blue-600 bg-blue-600 text-white' 
                  : index < currentStep 
                  ? 'border-green-600 bg-green-600 text-white' 
                  : 'border-gray-300'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 border-b border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <currentStepData.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentStepData.title}</h3>
              <p className="text-gray-600">{currentStepData.subtitle}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {currentStepData.component}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-6">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </Button>

          <div className="flex-1 text-center">
            <span className="text-sm text-gray-500">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {isLastStep ? (
            <Button onClick={onSave} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
              Сохранить профиль
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg flex items-center gap-2"
            >
              Далее
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Mobile Step Dots */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentStep 
                  ? 'bg-blue-600 scale-125' 
                  : index < currentStep 
                  ? 'bg-green-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepByStepHealthProfileForm;
