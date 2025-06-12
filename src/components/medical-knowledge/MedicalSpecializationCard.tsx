
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DoctorSpecialization } from '@/types/medical';
import { UserCheck, GraduationCap } from 'lucide-react';

interface MedicalSpecializationCardProps {
  specialization: DoctorSpecialization;
}

const MedicalSpecializationCard: React.FC<MedicalSpecializationCardProps> = ({
  specialization
}) => {
  return (
    <Card className="border-0 bg-white h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-lg">
            {specialization.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {specialization.description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {specialization.description}
          </p>
        )}

        {specialization.required_education && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">Образование</span>
            </div>
            <p className="text-xs text-gray-600 pl-6">
              {specialization.required_education}
            </p>
          </div>
        )}

        {specialization.common_conditions && specialization.common_conditions.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-800">Специализируется на:</span>
            <div className="flex flex-wrap gap-1">
              {specialization.common_conditions.map((condition, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalSpecializationCard;
