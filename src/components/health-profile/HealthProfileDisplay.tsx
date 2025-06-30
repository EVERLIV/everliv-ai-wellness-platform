
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
    <div className="min-h-screen bg-gray-50">
      <div className="container-adaptive space-adaptive-lg">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-adaptive-lg border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-adaptive-md">
              <div className="space-adaptive-xs">
                <h1 className="text-adaptive-3xl font-bold text-black">
                  Профиль здоровья
                </h1>
                <p className="text-adaptive-base text-gray-600">
                  Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
                </p>
              </div>
              <Button 
                onClick={onEdit} 
                className="touch-target px-adaptive-lg py-adaptive-sm bg-blue-600 text-white hover:bg-blue-700 gap-adaptive-xs self-start sm:self-auto"
              >
                <Edit2 className="h-4 w-4" />
                <span className="text-adaptive-sm font-medium">Редактировать</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid-adaptive grid-adaptive-2 lg:grid-cols-2">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-adaptive-lg space-adaptive-lg">
              <div className="flex items-center gap-adaptive-sm mb-adaptive-lg">
                <div className="p-adaptive-xs bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-adaptive-xl font-bold text-black">Личная информация</h2>
              </div>
              
              <div className="space-adaptive-md">
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Возраст:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.age)} лет</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Пол:</span>
                  <span className="text-adaptive-sm text-black font-medium">{getGenderLabel(healthProfile.gender)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Рост:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.height)} см</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Вес:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.weight)} кг</span>
                </div>
              </div>
            </div>
          </div>

          {/* Health Goals */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-adaptive-lg space-adaptive-lg">
              <div className="flex items-center gap-adaptive-sm mb-adaptive-lg">
                <div className="p-adaptive-xs bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-adaptive-xl font-bold text-black">Цели здоровья</h2>
              </div>
              
              <div>
                {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 ? (
                  <div className="space-adaptive-sm">
                    {healthProfile.healthGoals.map((goal, index) => (
                      <div key={index} className="py-adaptive-sm px-adaptive-md bg-blue-50 border-l-4 border-blue-600">
                        <span className="text-adaptive-sm text-black font-medium">{goal}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-adaptive-sm text-gray-500 italic">Цели не указаны</p>
                )}
              </div>
            </div>
          </div>

          {/* Physical Health */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-adaptive-lg space-adaptive-lg">
              <div className="flex items-center gap-adaptive-sm mb-adaptive-lg">
                <div className="p-adaptive-xs bg-blue-100 rounded-full">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-adaptive-xl font-bold text-black">Физическое здоровье</h2>
              </div>
              
              <div className="space-adaptive-md">
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Физическая активность:</span>
                  <span className="text-adaptive-sm text-black font-medium">{getActivityLabel(healthProfile.physicalActivity || '')}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Упражнения в неделю:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.exerciseFrequency)} раз</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mental Health */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-adaptive-lg space-adaptive-lg">
              <div className="flex items-center gap-adaptive-sm mb-adaptive-lg">
                <div className="p-adaptive-xs bg-blue-100 rounded-full">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-adaptive-xl font-bold text-black">Психическое здоровье</h2>
              </div>
              
              <div className="space-adaptive-md">
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Уровень стресса:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.stressLevel)}/10</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Уровень тревожности:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.anxietyLevel)}/10</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Качество сна:</span>
                  <span className="text-adaptive-sm text-black font-medium">{getQualityLabel(healthProfile.sleepQuality || '')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-adaptive-lg space-adaptive-lg">
              <div className="flex items-center gap-adaptive-sm mb-adaptive-lg">
                <div className="p-adaptive-xs bg-blue-100 rounded-full">
                  <Heart className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-adaptive-xl font-bold text-black">Образ жизни</h2>
              </div>
              
              <div className="space-adaptive-md">
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Курение:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.smokingStatus)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Алкоголь:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.alcoholConsumption)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Потребление воды:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.waterIntake)} стаканов/день</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-adaptive-lg space-adaptive-lg">
              <div className="flex items-center gap-adaptive-sm mb-adaptive-lg">
                <div className="p-adaptive-xs bg-blue-100 rounded-full">
                  <Moon className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-adaptive-xl font-bold text-black">Сон и отдых</h2>
              </div>
              
              <div className="space-adaptive-md">
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Часы сна:</span>
                  <span className="text-adaptive-sm text-black font-medium">{formatValue(healthProfile.sleepHours)} часов</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Качество сна:</span>
                  <span className="text-adaptive-sm text-black font-medium">{getQualityLabel(healthProfile.sleepQuality || '')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical History - Full Width */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-adaptive-lg space-adaptive-lg">
            <div className="flex items-center gap-adaptive-sm mb-adaptive-lg">
              <div className="p-adaptive-xs bg-blue-100 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-adaptive-xl font-bold text-black">Медицинская история</h2>
            </div>
            
            <div className="grid-adaptive grid-adaptive-2 lg:grid-cols-3">
              <div className="space-adaptive-md">
                <h3 className="text-adaptive-lg font-medium text-black mb-adaptive-md">Хронические заболевания</h3>
                {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 ? (
                  <div className="space-adaptive-sm">
                    {healthProfile.chronicConditions.map((condition, index) => (
                      <div key={index} className="py-adaptive-sm px-adaptive-sm bg-red-50 border-l-4 border-red-200">
                        <span className="text-adaptive-sm text-black">{condition}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-adaptive-sm text-gray-500 italic">Не указаны</p>
                )}
              </div>

              <div className="space-adaptive-md">
                <h3 className="text-adaptive-lg font-medium text-black mb-adaptive-md">Принимаемые лекарства</h3>
                {healthProfile.medications && healthProfile.medications.length > 0 ? (
                  <div className="space-adaptive-sm">
                    {healthProfile.medications.map((medication, index) => (
                      <div key={index} className="py-adaptive-sm px-adaptive-sm bg-green-50 border-l-4 border-green-200">
                        <span className="text-adaptive-sm text-black">{medication}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-adaptive-sm text-gray-500 italic">Не указаны</p>
                )}
              </div>

              <div className="space-adaptive-md">
                <h3 className="text-adaptive-lg font-medium text-black mb-adaptive-md">Аллергии</h3>
                {healthProfile.allergies && healthProfile.allergies.length > 0 ? (
                  <div className="space-adaptive-sm">
                    {healthProfile.allergies.map((allergy, index) => (
                      <div key={index} className="py-adaptive-sm px-adaptive-sm bg-yellow-50 border-l-4 border-yellow-200">
                        <span className="text-adaptive-sm text-black">{allergy}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-adaptive-sm text-gray-500 italic">Не указаны</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lab Results */}
        {healthProfile.labResults && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-adaptive-lg space-adaptive-lg">
              <div className="flex items-center gap-adaptive-sm mb-adaptive-lg">
                <div className="p-adaptive-xs bg-blue-100 rounded-full">
                  <TestTube className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-adaptive-xl font-bold text-black">Результаты анализов</h2>
              </div>
              
              <div className="space-adaptive-md">
                <div className="flex flex-col sm:flex-row sm:justify-between py-adaptive-sm border-b border-gray-100">
                  <span className="text-adaptive-sm text-gray-600 font-medium mb-1 sm:mb-0">Дата анализов:</span>
                  <span className="text-adaptive-sm text-black font-medium">
                    {healthProfile.labResults.testDate 
                      ? new Date(healthProfile.labResults.testDate).toLocaleDateString('ru-RU')
                      : 'Не указана'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthProfileDisplay;
