
import React from 'react';
import BaseCard from './BaseCard';
import { Badge } from '@/components/ui/badge';
import { DoctorSpecialization } from '@/types/medical';
import { Users } from 'lucide-react';

interface MedicalSpecializationCardProps {
  specialization: DoctorSpecialization;
}

const MedicalSpecializationCard: React.FC<MedicalSpecializationCardProps> = ({
  specialization
}) => {
  return (
    <BaseCard
      title={specialization.name}
      description={specialization.description}
      icon={Users}
      iconColor="text-green-600"
      iconBgColor="bg-green-50"
    >
      {specialization.required_education && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Образование:</h4>
          <p className="text-xs text-gray-600">{specialization.required_education}</p>
        </div>
      )}
      
      {specialization.common_conditions && specialization.common_conditions.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-2">Основные заболевания:</h4>
          <div className="flex flex-wrap gap-1">
            {specialization.common_conditions.slice(0, 3).map((condition, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {condition}
              </Badge>
            ))}
            {specialization.common_conditions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{specialization.common_conditions.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default MedicalSpecializationCard;
