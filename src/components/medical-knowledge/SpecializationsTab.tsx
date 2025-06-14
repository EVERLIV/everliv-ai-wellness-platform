
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

  // Дополнительная фильтрация уникальных специализаций на уровне компонента
  const uniqueSpecializations = specializations.filter((specialization, index, self) => 
    index === self.findIndex(s => s.id === specialization.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {uniqueSpecializations.map((specialization) => (
        <MedicalSpecializationCard
          key={specialization.id}
          specialization={specialization}
        />
      ))}
    </div>
  );
};

export default SpecializationsTab;
