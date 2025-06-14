
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DoctorSpecialization } from '@/types/medical';
import { ArrowLeft, Clock, Users, BookOpen, Activity } from 'lucide-react';

interface SpecializationDetailProps {
  specialization: DoctorSpecialization;
  onBack: () => void;
  onFindSpecialists: (specializationId: string) => void;
}

const SpecializationDetail: React.FC<SpecializationDetailProps> = ({
  specialization,
  onBack,
  onFindSpecialists
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к специализациям
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-600" />
                {specialization.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {specialization.detailed_description || specialization.description}
              </p>

              {specialization.required_education && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Требования к образованию
                  </h4>
                  <p className="text-gray-600">{specialization.required_education}</p>
                </div>
              )}

              {specialization.avg_consultation_duration && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Средняя продолжительность консультации: {specialization.avg_consultation_duration} минут
                </div>
              )}
            </CardContent>
          </Card>

          {specialization.health_areas && specialization.health_areas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Области здоровья</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {specialization.health_areas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {specialization.treatment_methods && specialization.treatment_methods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Методы лечения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {specialization.treatment_methods.map((method, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <Activity className="h-3 w-3 text-green-600" />
                      {method}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {specialization.specialists_count !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {specialization.specialists_count}
                  </div>
                  <div className="text-sm text-gray-600">Специалистов в Москве</div>
                </div>
              )}
              
              <Button 
                onClick={() => onFindSpecialists(specialization.id)}
                className="w-full"
              >
                Найти специалистов
              </Button>
            </CardContent>
          </Card>

          {specialization.common_conditions && specialization.common_conditions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Основные заболевания</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {specialization.common_conditions.map((condition, index) => (
                    <div key={index} className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                      {condition}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {specialization.typical_consultations && specialization.typical_consultations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Типичные консультации</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {specialization.typical_consultations.map((consultation, index) => (
                    <div key={index} className="text-sm text-gray-700 p-2 bg-blue-50 rounded">
                      {consultation}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecializationDetail;
