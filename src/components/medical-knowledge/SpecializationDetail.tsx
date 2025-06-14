
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleFindSpecialists = () => {
    // Навигация на страницу специалистов с параметром специализации
    navigate(`/moscow-clinics?specialization=${specialization.id}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="outline" onClick={onBack} size="sm" className="text-xs sm:text-sm">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Назад к специализациям</span>
          <span className="sm:hidden">Назад</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl flex-col sm:flex-row">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                <span className="break-words">{specialization.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {specialization.detailed_description || specialization.description}
              </p>

              {specialization.required_education && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    Требования к образованию
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">{specialization.required_education}</p>
                </div>
              )}

              {specialization.avg_consultation_duration && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Средняя продолжительность консультации: {specialization.avg_consultation_duration} минут</span>
                </div>
              )}
            </CardContent>
          </Card>

          {specialization.health_areas && specialization.health_areas.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Области здоровья</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {specialization.health_areas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs sm:text-sm break-words">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {specialization.treatment_methods && specialization.treatment_methods.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Методы лечения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {specialization.treatment_methods.map((method, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                      <Activity className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span className="break-words">{method}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Боковая панель */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {specialization.specialists_count !== undefined && (
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {specialization.specialists_count}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Специалистов в Москве</div>
                </div>
              )}
              
              <Button 
                onClick={handleFindSpecialists}
                className="w-full text-sm sm:text-base"
                size="sm"
              >
                Найти специалистов
              </Button>
            </CardContent>
          </Card>

          {specialization.common_conditions && specialization.common_conditions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Основные заболевания</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {specialization.common_conditions.map((condition, index) => (
                    <div key={index} className="text-xs sm:text-sm text-gray-700 p-2 bg-gray-50 rounded break-words">
                      {condition}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {specialization.typical_consultations && specialization.typical_consultations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Типичные консультации</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {specialization.typical_consultations.map((consultation, index) => (
                    <div key={index} className="text-xs sm:text-sm text-gray-700 p-2 bg-blue-50 rounded break-words">
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
