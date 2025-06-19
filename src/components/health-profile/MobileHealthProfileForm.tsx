
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import PersonalInfoSection from "./PersonalInfoSection";
import PhysicalHealthSection from "./PhysicalHealthSection";
import MentalHealthSection from "./MentalHealthSection";
import LifestyleSection from "./LifestyleSection";
import SleepSection from "./SleepSection";
import LabResultsSection from "./LabResultsSection";
import RecommendationSettingsSection from "./RecommendationSettingsSection";
import MedicalHistorySection from "./MedicalHistorySection";

interface MobileHealthProfileFormProps {
  healthProfile: HealthProfileData;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const MobileHealthProfileForm: React.FC<MobileHealthProfileFormProps> = ({
  healthProfile,
  onSave,
  onCancel,
  onChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Личная информация",
      icon: "👤",
      component: <PersonalInfoSection data={healthProfile} onChange={onChange} />
    },
    {
      title: "Физическое здоровье",
      icon: "💪",
      component: <PhysicalHealthSection data={healthProfile} onChange={onChange} />
    },
    {
      title: "Психическое здоровье",
      icon: "🧠",
      component: <MentalHealthSection data={healthProfile} onChange={onChange} />
    },
    {
      title: "Образ жизни",
      icon: "🏃",
      component: <LifestyleSection data={healthProfile} onChange={onChange} />
    },
    {
      title: "Сон",
      icon: "😴",
      component: <SleepSection data={healthProfile} onChange={onChange} />
    },
    {
      title: "Анализы",
      icon: "🔬",
      component: <LabResultsSection labResults={healthProfile.labResults || {}} onChange={(labResults) => onChange({ labResults })} />
    },
    {
      title: "Медицинская история",
      icon: "📋",
      component: <MedicalHistorySection data={healthProfile} onChange={onChange} />
    },
    {
      title: "Рекомендации",
      icon: "⚙️",
      component: <RecommendationSettingsSection data={healthProfile} onChange={onChange} />
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Профиль здоровья</h1>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Шаг {currentStep + 1} из {steps.length}</span>
            <span className="text-blue-600 font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
          <span className="text-2xl">{steps[currentStep].icon}</span>
          <div>
            <h2 className="font-semibold text-gray-900">{steps[currentStep].title}</h2>
            <p className="text-sm text-gray-500">Заполните информацию о себе</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4">
          {steps[currentStep].component}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex-1"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Назад
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button onClick={onSave} className="flex-1">
            <Save className="h-4 w-4 mr-1" />
            Сохранить
          </Button>
        ) : (
          <Button onClick={nextStep} className="flex-1">
            Далее
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mt-6">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStep ? 'bg-blue-600' : 
              index < currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileHealthProfileForm;
