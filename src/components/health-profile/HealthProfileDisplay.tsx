
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, User, Activity, Brain, Heart, Moon, FileText, Target, Flask } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto space-y-8 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">
            Профиль здоровья
          </h1>
          <p className="text-gray-600 text-lg">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
        <Button onClick={onEdit} className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 gap-3">
          <Edit2 className="h-5 w-5" />
          Редактировать
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-black">Личная информация</h2>
          </div>
          
          <div className="space-y-4 pl-9">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Возраст:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.age)} лет</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Пол:</span>
              <span className="text-black font-medium">{getGenderLabel(healthProfile.gender)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Рост:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.height)} см</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Вес:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.weight)} кг</span>
            </div>
          </div>
        </div>

        {/* Health Goals */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-black">Цели здоровья</h2>
          </div>
          
          <div className="pl-9">
            {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 ? (
              <div className="space-y-3">
                {healthProfile.healthGoals.map((goal, index) => (
                  <div key={index} className="py-2 px-4 bg-blue-50 border-l-4 border-blue-600">
                    <span className="text-black font-medium">{goal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Цели не указаны</p>
            )}
          </div>
        </div>

        {/* Physical Health */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-black">Физическое здоровье</h2>
          </div>
          
          <div className="space-y-4 pl-9">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Физическая активность:</span>
              <span className="text-black font-medium">{getActivityLabel(healthProfile.physicalActivity || '')}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Упражнения в неделю:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.exerciseFrequency)} раз</span>
            </div>
          </div>
        </div>

        {/* Mental Health */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-black">Психическое здоровье</h2>
          </div>
          
          <div className="space-y-4 pl-9">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Уровень стресса:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.stressLevel)}/10</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Уровень тревожности:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.anxietyLevel)}/10</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Качество сна:</span>
              <span className="text-black font-medium">{getQualityLabel(healthProfile.sleepQuality || '')}</span>
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-black">Образ жизни</h2>
          </div>
          
          <div className="space-y-4 pl-9">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Курение:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.smokingStatus)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Алкоголь:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.alcoholConsumption)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Потребление воды:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.waterIntake)} стаканов/день</span>
            </div>
          </div>
        </div>

        {/* Sleep */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-black">Сон и отдых</h2>
          </div>
          
          <div className="space-y-4 pl-9">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Часы сна:</span>
              <span className="text-black font-medium">{formatValue(healthProfile.sleepHours)} часов</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Качество сна:</span>
              <span className="text-black font-medium">{getQualityLabel(healthProfile.sleepQuality || '')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History - Full Width */}
      <div className="space-y-6 border-t border-gray-100 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-black">Медицинская история</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pl-9">
          <div>
            <h3 className="text-lg font-medium text-black mb-4">Хронические заболевания</h3>
            {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 ? (
              <div className="space-y-2">
                {healthProfile.chronicConditions.map((condition, index) => (
                  <div key={index} className="py-2 px-3 bg-red-50 border-l-4 border-red-200">
                    <span className="text-black">{condition}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Не указаны</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-black mb-4">Принимаемые лекарства</h3>
            {healthProfile.medications && healthProfile.medications.length > 0 ? (
              <div className="space-y-2">
                {healthProfile.medications.map((medication, index) => (
                  <div key={index} className="py-2 px-3 bg-green-50 border-l-4 border-green-200">
                    <span className="text-black">{medication}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Не указаны</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-black mb-4">Аллергии</h3>
            {healthProfile.allergies && healthProfile.allergies.length > 0 ? (
              <div className="space-y-2">
                {healthProfile.allergies.map((allergy, index) => (
                  <div key={index} className="py-2 px-3 bg-yellow-50 border-l-4 border-yellow-200">
                    <span className="text-black">{allergy}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Не указаны</p>
            )}
          </div>
        </div>
      </div>

      {/* Lab Results */}
      {healthProfile.labResults && (
        <div className="space-y-6 border-t border-gray-100 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <Flask className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-black">Результаты анализов</h2>
          </div>
          
          <div className="pl-9">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Дата анализов:</span>
              <span className="text-black font-medium">
                {healthProfile.labResults.testDate 
                  ? new Date(healthProfile.labResults.testDate).toLocaleDateString('ru-RU')
                  : 'Не указана'
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthProfileDisplay;
