import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import PersonalInfoSection from './PersonalInfoSection';
import PhysicalHealthSection from './PhysicalHealthSection';
import MentalHealthSection from './MentalHealthSection';
import LifestyleSection from './LifestyleSection';
import SleepSection from './SleepSection';
import MedicalHistorySection from './MedicalHistorySection';
import LabResultsSection from './LabResultsSection';
import { HealthProfileData } from '@/types/healthProfile';
import HealthGoalsSection from './HealthGoalsSection';

interface HealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const HealthProfileDisplay: React.FC<HealthProfileDisplayProps> = ({ healthProfile, onEdit }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile completeness and edit button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Профиль здоровья</CardTitle>
              <CardDescription>
                Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
              </CardDescription>
            </div>
            <Button onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <PersonalInfoSection 
        healthProfile={healthProfile}
        onChange={() => {}}
        readOnly
      />

      {/* Physical Health */}
      <PhysicalHealthSection 
        healthProfile={healthProfile}
        onChange={() => {}}
        readOnly
      />

      {/* Mental Health */}
      <MentalHealthSection 
        healthProfile={healthProfile}
        onChange={() => {}}
        readOnly
      />

      {/* Lifestyle */}
      <LifestyleSection 
        healthProfile={healthProfile}
        onChange={() => {}}
        readOnly
      />

      {/* Sleep */}
      <SleepSection 
        healthProfile={healthProfile}
        onChange={() => {}}
        readOnly
      />

      {/* Health Goals */}
      <HealthGoalsSection 
        healthProfile={healthProfile}
        isEditMode={false}
        onUpdate={() => {}}
      />

      {/* Medical History */}
      <MedicalHistorySection 
        healthProfile={healthProfile}
        onChange={() => {}}
        readOnly
      />

      {/* Lab Results */}
      <LabResultsSection 
        healthProfile={healthProfile}
        onChange={() => {}}
        readOnly
      />
    </div>
  );
};

export default HealthProfileDisplay;
