
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HealthProfileData } from '@/types/healthProfile';
import { 
  Target, 
  TrendingDown, 
  TrendingUp, 
  Moon, 
  Shield, 
  Zap, 
  Heart, 
  Activity 
} from 'lucide-react';

interface MinimalHealthProfileFormProps {
  healthProfile: HealthProfileData;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const HEALTH_GOALS = [
  {
    id: 'weight_loss',
    icon: TrendingDown,
    title: 'Похудение',
    description: 'Достижение и поддержание здорового веса'
  },
  {
    id: 'muscle_gain',
    icon: TrendingUp,
    title: 'Набор мышечной массы',
    description: 'Увеличение силы и мышечного тонуса'
  },
  {
    id: 'better_sleep',
    icon: Moon,
    title: 'Улучшение сна',
    description: 'Качественный и восстанавливающий отдых'
  },
  {
    id: 'stress_reduction',
    icon: Shield,
    title: 'Снижение стресса',
    description: 'Управление стрессом и эмоциональным состоянием'
  },
  {
    id: 'energy_boost',
    icon: Zap,
    title: 'Повышение энергии',
    description: 'Больше энергии для ежедневных задач'
  },
  {
    id: 'digestion',
    icon: Heart,
    title: 'Улучшение пищеварения',
    description: 'Здоровье желудочно-кишечного тракта'
  },
  {
    id: 'immunity',
    icon: Shield,
    title: 'Укрепление иммунитета',
    description: 'Защита от заболеваний и инфекций'
  },
  {
    id: 'diabetes_control',
    icon: Activity,
    title: 'Контроль диабета',
    description: 'Управление уровнем сахара в крови'
  }
];

const MinimalHealthProfileForm: React.FC<MinimalHealthProfileFormProps> = ({
  healthProfile,
  onSave,
  onCancel,
  onChange
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(healthProfile.healthGoals || []);

  const handleGoalToggle = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    
    setSelectedGoals(newGoals);
    onChange({ healthGoals: newGoals });
  };

  const handleInputChange = (field: keyof HealthProfileData, value: any) => {
    onChange({ [field]: value });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedGoals.length > 0;
      case 2:
        return healthProfile.age && healthProfile.gender && healthProfile.height && healthProfile.weight;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-2">
            Создание профиля здоровья
          </h1>
          <p className="text-gray-600 text-base">
            Настройте ваши цели для персонализированных рекомендаций
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Шаг {currentStep} из 4</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full h-0.5 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Health Goals */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-8">
              Ваши цели здоровья
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {HEALTH_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                
                return (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`p-4 border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleGoalToggle(goal.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <h3 className={`font-medium ${isSelected ? 'text-blue-600' : 'text-black'}`}>
                            {goal.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">
              Это поможет нам дать вам точные рекомендации
            </p>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-8">
              Базовая информация
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Возраст</Label>
                  <Input
                    type="number"
                    value={healthProfile.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-600 focus:ring-0"
                    placeholder="Введите ваш возраст"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Пол</Label>
                  <select
                    value={healthProfile.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:border-blue-600 focus:outline-none bg-white"
                  >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                    <option value="other">Другой</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Рост (см)</Label>
                  <Input
                    type="number"
                    value={healthProfile.height || ''}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                    className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-600 focus:ring-0"
                    placeholder="Введите ваш рост"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Вес (кг)</Label>
                  <Input
                    type="number"
                    value={healthProfile.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                    className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-600 focus:ring-0"
                    placeholder="Введите ваш вес"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-8">
              Образ жизни
            </h2>
            <div className="space-y-8">
              <div>
                <Label className="text-sm text-gray-600 mb-4 block">Уровень активности</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'sedentary', label: 'Малоподвижный' },
                    { value: 'moderate', label: 'Умеренный' },
                    { value: 'active', label: 'Активный' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="activity"
                        value={option.value}
                        checked={healthProfile.physicalActivity === option.value}
                        onChange={(e) => handleInputChange('physicalActivity', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-black">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-4 block">
                  Качество сна (1-10): {healthProfile.sleepHours || 7}
                </Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={healthProfile.sleepHours || 7}
                  onChange={(e) => handleInputChange('sleepHours', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider:bg-blue-600"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-4 block">
                  Уровень стресса (1-10): {healthProfile.stressLevel || 5}
                </Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={healthProfile.stressLevel || 5}
                  onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Medical Information */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-8">
              Медицинская информация
            </h2>
            <div className="space-y-6">
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Хронические заболевания</Label>
                <Textarea
                  value={healthProfile.chronicConditions?.join(', ') || ''}
                  onChange={(e) => handleInputChange('chronicConditions', e.target.value.split(', ').filter(Boolean))}
                  className="border border-gray-200 rounded-none focus:border-blue-600 focus:ring-0"
                  placeholder="Перечислите через запятую"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Принимаемые лекарства</Label>
                <Input
                  value={healthProfile.medications?.join(', ') || ''}
                  onChange={(e) => handleInputChange('medications', e.target.value.split(', ').filter(Boolean))}
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-600 focus:ring-0"
                  placeholder="Перечислите через запятую"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Аллергии</Label>
                <Input
                  value={healthProfile.allergies?.join(', ') || ''}
                  onChange={(e) => handleInputChange('allergies', e.target.value.split(', ').filter(Boolean))}
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-600 focus:ring-0"
                  placeholder="Перечислите через запятую"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-black transition-colors"
              >
                ← Назад
              </button>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 hover:text-black transition-colors"
            >
              Отменить
            </button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-8 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 rounded-none"
              >
                Продолжить
              </Button>
            ) : (
              <Button
                onClick={onSave}
                className="px-8 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-none"
              >
                Сохранить профиль
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalHealthProfileForm;
