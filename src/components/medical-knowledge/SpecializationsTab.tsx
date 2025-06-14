
import React from 'react';
import MedicalSpecializationCard from './MedicalSpecializationCard';
import LoadingState from './LoadingState';
import { DoctorSpecialization } from '@/types/medical';

interface SpecializationsTabProps {
  isLoading: boolean;
  specializations: DoctorSpecialization[];
}

const SpecializationsTab: React.FC<SpecializationsTabProps> = ({
  isLoading,
  specializations
}) => {
  if (isLoading) {
    return (
      <LoadingState 
        message="Загрузка специализаций..."
        size="md"
      />
    );
  }

  // Строгая фильтрация уникальных специализаций
  const uniqueSpecializations = specializations.reduce((acc, current) => {
    const existingIndex = acc.findIndex(item => item.id === current.id);
    if (existingIndex === -1) {
      acc.push(current);
    }
    return acc;
  }, [] as DoctorSpecialization[]);

  console.log('Specializations rendered:', uniqueSpecializations.length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {uniqueSpecializations.map((specialization) => (
        <MedicalSpecializationCard
          key={`spec-${specialization.id}`}
          specialization={specialization}
        />
      ))}
    </div>
  );
};

export default SpecializationsTab;
