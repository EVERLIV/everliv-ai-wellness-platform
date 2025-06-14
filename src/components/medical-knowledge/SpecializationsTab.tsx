
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {specializations.map((specialization) => (
        <MedicalSpecializationCard
          key={specialization.id}
          specialization={specialization}
        />
      ))}
    </div>
  );
};

export default SpecializationsTab;
