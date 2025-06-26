
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, X, User, Activity, Brain, Apple, Moon, FileText, Stethoscope, Target } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import PersonalInfoSection from "./PersonalInfoSection";
import PhysicalHealthSection from "./PhysicalHealthSection";
import MentalHealthSection from "./MentalHealthSection";
import LifestyleSection from "./LifestyleSection";
import SleepSection from "./SleepSection";
import LabResultsSection from "./LabResultsSection";
import MedicalHistorySection from "./MedicalHistorySection";
import HealthGoalsSection from "./HealthGoalsSection";

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

  const steps = [
    {
      id: 'personal',
      title: "Личная информация",
      subtitle: "Основные данные о вас",
      icon: User,
      component: <PersonalInfoSection data={healthProfile} onChange={onChange} />
    },
    {
      id: 'physical',
      title: "Физическое здоровье",
      subtitle: "Активность и физические показатели",
      icon: Activity,
      component: <PhysicalHealthSection data={healthProfile} onChange={onChange} />
    },
    {
      id: 'mental',
      title: "Психическое здоровье",
      subtitle: "Стресс и эмоциональное состояние",
      icon: Brain,
      component: <MentalHealthSection data={healthProfile} onChange={onChange} />
    },
    {
      id: 'lifestyle',
      title: "Образ жизни",
      subtitle: "Питание и привычки",
      icon: Apple,
      component: <LifestyleSection data={healthProfile} onChange={onChange} />
    },
    {
      id: 'sleep',
      title: "Сон и отдых",
      subtitle: "Качество и продолжительность сна",
      icon: Moon,
      component: <SleepSection data={healthProfile} onChange={onChange} />
    },
    {
      id: 'goals',
      title: "Цели здоровья",
      subtitle: "Ваши планы и задачи",
      icon: Target,
      component: <HealthGoalsSection healthProfile={healthProfile} isEditMode={true} onUpdate={onChange} />
    },
    {
      id: 'medical',
      title: "Медицинская история",
      subtitle: "Заболевания и лечение",
      icon: FileText,
      component: <MedicalHistorySection data={healthProfile} onChange={onChange} />
    },
    {
      id: 'lab',
      title: "Анализы",
      subtitle: "Результаты лабораторных исследований",
      icon: Stethoscope,
      component: <LabResultsSection labResults={healthProfile.labResults || {}} onChange={(labResults) => onChange({ labResults })} />
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Отмена</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Профиль здоровья
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Заполните информацию для персональных рекомендаций
                </p>
              </div>
            </div>
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
      </div>

      {/* Current step content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <currentStepData.icon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStepData.title}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {currentStepData.subtitle}
            </p>
          </CardHeader>
          
          <CardContent className="px-6 pb-8">
            {currentStepData.component}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-6 gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="gap-2 min-w-[120px]"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>

          <div className="flex gap-2">
            {!isLastStep ? (
              <Button
                onClick={handleNext}
                className="gap-2 min-w-[120px] bg-blue-600 hover:bg-blue-700"
              >
                Далее
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={onSave}
                className="gap-2 min-w-[140px] bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                Сохранить профиль
              </Button>
            )}
          </div>
        </div>

        {/* Step dots for mobile */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-blue-600 w-6'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepByStepHealthProfileForm;
