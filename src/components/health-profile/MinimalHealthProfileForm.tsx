
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { HealthProfileData } from '@/types/healthProfile';
import { User, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MinimalHealthProfileFormProps {
  healthProfile: HealthProfileData;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const MinimalHealthProfileForm: React.FC<MinimalHealthProfileFormProps> = ({
  healthProfile,
  onSave,
  onCancel,
  onChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useIsMobile();

  const steps = [
    {
      title: 'Основная информация',
      fields: ['age', 'gender', 'height', 'weight']
    },
    {
      title: 'Образ жизни',
      fields: ['physicalActivity', 'exerciseFrequency', 'smokingStatus', 'alcoholConsumption']
    },
    {
      title: 'Здоровье и сон',
      fields: ['sleepHours', 'stressLevel', 'waterIntake']
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-semibold text-gray-700">
                  Возраст *
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Введите ваш возраст"
                  value={healthProfile.age || ''}
                  onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
                  className="h-12 text-base border-2 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                  Пол *
                </Label>
                <Select 
                  value={healthProfile.gender || ''} 
                  onValueChange={(value) => onChange({ gender: value as 'male' | 'female' | 'other' })}
                >
                  <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500">
                    <SelectValue placeholder="Выберите пол" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Мужской</SelectItem>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="other">Другой</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-semibold text-gray-700">
                  Рост (см) *
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Введите рост в см"
                  value={healthProfile.height || ''}
                  onChange={(e) => onChange({ height: parseInt(e.target.value) || 0 })}
                  className="h-12 text-base border-2 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-semibold text-gray-700">
                  Вес (кг) *
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Введите вес в кг"
                  value={healthProfile.weight || ''}
                  onChange={(e) => onChange({ weight: parseInt(e.target.value) || 0 })}
                  className="h-12 text-base border-2 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Физическая активность
                </Label>
                <Select 
                  value={healthProfile.physicalActivity || ''} 
                  onValueChange={(value) => onChange({ physicalActivity: value as 'sedentary' | 'moderate' | 'active' })}
                >
                  <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500">
                    <SelectValue placeholder="Уровень активности" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Малоподвижный</SelectItem>
                    <SelectItem value="moderate">Умеренный</SelectItem>
                    <SelectItem value="active">Активный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Тренировки в неделю
                </Label>
                <Input
                  type="number"
                  placeholder="Количество тренировок"
                  value={healthProfile.exerciseFrequency || ''}
                  onChange={(e) => onChange({ exerciseFrequency: parseInt(e.target.value) || 0 })}
                  className="h-12 text-base border-2 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Курение
                </Label>
                <Select 
                  value={healthProfile.smokingStatus || ''} 
                  onValueChange={(value) => onChange({ smokingStatus: value })}
                >
                  <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500">
                    <SelectValue placeholder="Статус курения" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Никогда не курил</SelectItem>
                    <SelectItem value="former">Бросил курить</SelectItem>
                    <SelectItem value="current">Курю</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Потребление алкоголя
                </Label>
                <Select 
                  value={healthProfile.alcoholConsumption || ''} 
                  onValueChange={(value) => onChange({ alcoholConsumption: value })}
                >
                  <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500">
                    <SelectValue placeholder="Частота употребления" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Не употребляю</SelectItem>
                    <SelectItem value="rarely">Редко</SelectItem>
                    <SelectItem value="moderate">Умеренно</SelectItem>
                    <SelectItem value="frequent">Часто</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Часы сна в сутки
                </Label>
                <Input
                  type="number"
                  placeholder="Обычное количество часов сна"
                  value={healthProfile.sleepHours || ''}
                  onChange={(e) => onChange({ sleepHours: parseInt(e.target.value) || 0 })}
                  className="h-12 text-base border-2 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Уровень стресса (1-10)
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Оцените от 1 до 10"
                  value={healthProfile.stressLevel || ''}
                  onChange={(e) => onChange({ stressLevel: parseInt(e.target.value) || 5 })}
                  className="h-12 text-base border-2 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Потребление воды (стаканов в день)
                </Label>
                <Input
                  type="number"
                  placeholder="Количество стаканов воды"
                  value={healthProfile.waterIntake || ''}
                  onChange={(e) => onChange({ waterIntake: parseInt(e.target.value) || 0 })}
                  className="h-12 text-base border-2 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${isMobile ? 'px-4 py-6' : 'px-6 py-8'}`}>
      <div className={`max-w-4xl mx-auto ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        {/* Header */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className={isMobile ? 'p-4' : 'p-6'}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
                    Создание профиля здоровья
                  </CardTitle>
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 mt-1`}>
                    Шаг {currentStep + 1} из {steps.length}: {steps[currentStep].title}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Прогресс заполнения</span>
                <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Form Content */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className={isMobile ? 'p-4' : 'p-8'}>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className={isMobile ? 'p-4' : 'p-6'}>
            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'}`}>
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`${isMobile ? 'w-full' : ''} h-12 px-6 border-2 hover:bg-gray-50 text-gray-700 font-medium`}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              
              <div className={`${isMobile ? 'flex justify-center' : ''}`}>
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 rounded-full transition-colors ${
                        index === currentStep ? 'bg-blue-600' : 
                        index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={onSave}
                  className={`${isMobile ? 'w-full' : ''} h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить профиль
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className={`${isMobile ? 'w-full' : ''} h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  Далее
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinimalHealthProfileForm;
