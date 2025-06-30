
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, User, Activity, Brain, Heart, Moon, FileText, Target, TestTube } from 'lucide-react';
import { HealthProfileData } from '@/types/healthProfile';

interface HealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const HealthProfileDisplay: React.FC<HealthProfileDisplayProps> = ({ healthProfile, onEdit }) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'Не указано';
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Не указано';
    }
    if (typeof value === 'boolean') return value ? 'Да' : 'Нет';
    return String(value);
  };

  const getActivityLabel = (activity: string) => {
    const labels = {
      'sedentary': 'Малоподвижный',
      'moderate': 'Умеренный', 
      'active': 'Активный'
    };
    return labels[activity as keyof typeof labels] || activity;
  };

  const getQualityLabel = (quality: string) => {
    const labels = {
      'poor': 'Плохое',
      'fair': 'Удовлетворительное',
      'good': 'Хорошее', 
      'excellent': 'Отличное'
    };
    return labels[quality as keyof typeof labels] || quality;
  };

  const getGenderLabel = (gender: string) => {
    const labels = {
      'male': 'Мужской',
      'female': 'Женский',
      'other': 'Другой'
    };
    return labels[gender as keyof typeof labels] || gender;
  };

  return (
    <div className="health-profile">
      <div className="page-container section-spacing">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-spacing-sm">
                <h1 className="heading-responsive-lg text-black">
                  Профиль здоровья
                </h1>
                <p className="text-responsive text-gray-600">
                  Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
                </p>
              </div>
              <Button 
                onClick={onEdit} 
                className="touch-target bg-blue-600 text-white hover:bg-blue-700 gap-2 self-start sm:self-auto"
              >
                <Edit2 className="h-4 w-4" />
                <span className="text-sm font-medium">Редактировать</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Content Grid */}
        <div className="responsive-grid-2 lg:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-black">Личная информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="info-row">
                  <span className="info-label">Возраст:</span>
                  <span className="info-value">{formatValue(healthProfile.age)} лет</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Пол:</span>
                  <span className="info-value">{getGenderLabel(healthProfile.gender)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Рост:</span>
                  <span className="info-value">{formatValue(healthProfile.height)} см</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Вес:</span>
                  <span className="info-value">{formatValue(healthProfile.weight)} кг</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-black">Цели здоровья</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="content-padding-internal">
              {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 ? (
                <div className="text-spacing-sm">
                  {healthProfile.healthGoals.map((goal, index) => (
                    <div key={index} className="info-item border-l-4 border-blue-600 bg-blue-50">
                      <span className="text-sm text-black font-medium">{goal}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic content-padding-internal">Цели не указаны</p>
              )}
            </CardContent>
          </Card>

          {/* Physical Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-black">Физическое здоровье</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="info-row">
                  <span className="info-label">Физическая активность:</span>
                  <span className="info-value">{getActivityLabel(healthProfile.physicalActivity || '')}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Упражнения в неделю:</span>
                  <span className="info-value">{formatValue(healthProfile.exerciseFrequency)} раз</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mental Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-black">Психическое здоровье</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="info-row">
                  <span className="info-label">Уровень стресса:</span>
                  <span className="info-value">{formatValue(healthProfile.stressLevel)}/10</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Уровень тревожности:</span>
                  <span className="info-value">{formatValue(healthProfile.anxietyLevel)}/10</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Качество сна:</span>
                  <span className="info-value">{getQualityLabel(healthProfile.sleepQuality || '')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Heart className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-black">Образ жизни</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="info-row">
                  <span className="info-label">Курение:</span>
                  <span className="info-value">{formatValue(healthProfile.smokingStatus)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Алкоголь:</span>
                  <span className="info-value">{formatValue(healthProfile.alcoholConsumption)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Потребление воды:</span>
                  <span className="info-value">{formatValue(healthProfile.waterIntake)} стаканов/день</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sleep */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Moon className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-black">Сон и отдых</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="info-row">
                  <span className="info-label">Часы сна:</span>
                  <span className="info-value">{formatValue(healthProfile.sleepHours)} часов</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Качество сна:</span>
                  <span className="info-value">{getQualityLabel(healthProfile.sleepQuality || '')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical History - Full Width */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-lg font-bold text-black">Медицинская история</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="responsive-grid lg:grid-cols-3">
              <div className="content-padding-internal">
                <h3 className="section-title">Хронические заболевания</h3>
                {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 ? (
                  <div className="text-spacing-sm">
                    {healthProfile.chronicConditions.map((condition, index) => (
                      <div key={index} className="info-item border-l-4 border-red-200 bg-red-50">
                        <span className="text-sm text-black">{condition}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Не указаны</p>
                )}
              </div>

              <div className="content-padding-internal">
                <h3 className="section-title">Принимаемые лекарства</h3>
                {healthProfile.medications && healthProfile.medications.length > 0 ? (
                  <div className="text-spacing-sm">
                    {healthProfile.medications.map((medication, index) => (
                      <div key={index} className="info-item border-l-4 border-green-200 bg-green-50">
                        <span className="text-sm text-black">{medication}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Не указаны</p>
                )}
              </div>

              <div className="content-padding-internal">
                <h3 className="section-title">Аллергии</h3>
                {healthProfile.allergies && healthProfile.allergies.length > 0 ? (
                  <div className="text-spacing-sm">
                    {healthProfile.allergies.map((allergy, index) => (
                      <div key={index} className="info-item border-l-4 border-yellow-200 bg-yellow-50">
                        <span className="text-sm text-black">{allergy}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Не указаны</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lab Results */}
        {healthProfile.labResults && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <TestTube className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-black">Результаты анализов</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="info-row">
                <span className="info-label">Дата анализов:</span>
                <span className="info-value">
                  {healthProfile.labResults.testDate 
                    ? new Date(healthProfile.labResults.testDate).toLocaleDateString('ru-RU')
                    : 'Не указана'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthProfileDisplay;
