
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Загрузка информации о специалистах...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
