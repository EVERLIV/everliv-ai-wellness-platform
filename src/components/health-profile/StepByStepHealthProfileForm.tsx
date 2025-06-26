
import React, { useState } from "react";
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
import StepNavigation from "./StepNavigation";
import StepContent from "./StepContent";
import FormControls from "./FormControls";
import MobileStepDots from "./MobileStepDots";
import { StepConfig } from "./types";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import HealthProfilePageHeader from "./HealthProfilePageHeader";

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

  const steps: StepConfig[] = [
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
    <PageLayoutWithHeader
      headerComponent={<HealthProfilePageHeader />}
      fullWidth={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onCancel={onCancel}
        />

        <StepContent
          title={currentStepData.title}
          subtitle={currentStepData.subtitle}
          icon={currentStepData.icon}
        >
          {currentStepData.component}
        </StepContent>

        <div className="container mx-auto px-4 max-w-4xl">
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
            onStepClick={setCurrentStep}
          />
        </div>
      </div>
    </PageLayoutWithHeader>
  );
};

export default StepByStepHealthProfileForm;
