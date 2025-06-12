
import React from 'react';
import MedicalSpecializationCard from './MedicalSpecializationCard';
import { DoctorSpecialization } from '@/types/medical';
import { Loader2 } from 'lucide-react';

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
      <div className="flex items-center justify-center py-12 md:py-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base md:text-lg text-gray-600">Загрузка информации о специалистах...</p>
        </div>
      </div>
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
