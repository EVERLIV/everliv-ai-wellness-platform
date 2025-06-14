
import React from 'react';
import BaseCard from './BaseCard';
import { Badge } from '@/components/ui/badge';
import { DoctorSpecialization } from '@/types/medical';
import { Users, Clock } from 'lucide-react';

interface MedicalSpecializationCardProps {
  specialization: DoctorSpecialization;
  onSelect?: (specializationId: string) => void;
}

const MedicalSpecializationCard: React.FC<MedicalSpecializationCardProps> = ({
  specialization,
  onSelect
}) => {
  return (
    <BaseCard
      title={specialization.name}
      description={specialization.description}
      icon={Users}
      iconColor="text-green-600"
      iconBgColor="bg-green-50"
      onClick={onSelect ? () => onSelect(specialization.id) : undefined}
    >
      {specialization.required_education && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Образование:</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{specialization.required_education}</p>
        </div>
      )}
      
      {specialization.common_conditions && specialization.common_conditions.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Основные заболевания:</h4>
          <div className="flex flex-wrap gap-1">
            {specialization.common_conditions.slice(0, 2).map((condition, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {condition}
              </Badge>
            ))}
            {specialization.common_conditions.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{specialization.common_conditions.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
        {specialization.avg_consultation_duration && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{specialization.avg_consultation_duration} мин</span>
          </div>
        )}
        {specialization.specialists_count !== undefined && (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{specialization.specialists_count} врачей</span>
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default MedicalSpecializationCard;
