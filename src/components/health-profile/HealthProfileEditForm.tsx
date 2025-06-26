import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Activity, Brain, Heart, Moon, FileText, Settings, Save, X, Apple, Stethoscope, Target } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import PersonalInfoSection from "./PersonalInfoSection";
import PhysicalHealthSection from "./PhysicalHealthSection";
import MentalHealthSection from "./MentalHealthSection";
import LifestyleSection from "./LifestyleSection";
import SleepSection from "./SleepSection";
import LabResultsSection from "./LabResultsSection";
import RecommendationSettingsSection from "./RecommendationSettingsSection";
import NavigationControls from "./NavigationControls";
import MedicalHistorySection from "./MedicalHistorySection";
import HealthGoalsSection from "./HealthGoalsSection";
import SectionNavigation from "./SectionNavigation";

interface HealthProfileEditFormProps {
  healthProfile: HealthProfileData;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const HealthProfileEditForm: React.FC<HealthProfileEditFormProps> = ({
  healthProfile,
  onSave,
  onCancel,
  onChange
}) => {
  const [currentSection, setCurrentSection] = useState('personal');
  const [completedSections, setCompletedSections] = useState(['personal']);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionNavigation 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection}
        completedSections={completedSections}
      />

      {currentSection === 'personal' && (
        <PersonalInfoSection 
          healthProfile={healthProfile}
          onChange={onChange}
        />
      )}

      {currentSection === 'physical' && (
        <PhysicalHealthSection 
          healthProfile={healthProfile}
          onChange={onChange}
        />
      )}

      {currentSection === 'mental' && (
        <MentalHealthSection 
          healthProfile={healthProfile}
          onChange={onChange}
        />
      )}

      {currentSection === 'lifestyle' && (
        <LifestyleSection 
          healthProfile={healthProfile}
          onChange={onChange}
        />
      )}

      {currentSection === 'sleep' && (
        <SleepSection 
          healthProfile={healthProfile}
          onChange={onChange}
        />
      )}

      {currentSection === 'medical' && (
        <MedicalHistorySection 
          healthProfile={healthProfile}
          onChange={onChange}
        />
      )}

      {currentSection === 'goals' && (
        <HealthGoalsSection 
          healthProfile={healthProfile}
          isEditMode={true}
          onUpdate={onChange}
        />
      )}

      {currentSection === 'lab' && (
        <LabResultsSection 
          healthProfile={healthProfile}
          onChange={onChange}
        />
      )}

      <NavigationControls
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default HealthProfileEditForm;
