
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
  Activity,
  Plus,
  X
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

const COMMON_MEDICATIONS = [
  'Аспирин', 'Ибупрофен', 'Парацетамол', 'Витамин D', 'Омега-3', 
  'Магний', 'Метформин', 'Лизиноприл', 'Симвастатин', 'Левотироксин'
];

const COMMON_CONDITIONS = [
  'Гипертония', 'Диабет 2 типа', 'Астма', 'Аллергический ринит', 
  'Мигрень', 'Остеохондроз', 'Гастрит', 'Анемия'
];

const COMMON_BIOMARKERS = [
  'Холестерин общий', 'ЛПНП', 'ЛПВП', 'Триглицериды', 'Глюкоза',
  'Гемоглобин', 'Ферритин', 'Витамин B12', 'Витамин D', 'ТТГ',
  'Креатинин', 'АЛТ', 'АСТ', 'С-реактивный белок'
];

const MinimalHealthProfileForm: React.FC<MinimalHealthProfileFormProps> = ({
  healthProfile,
  onSave,
  onCancel,
  onChange
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(healthProfile.healthGoals || []);
  const [customGoal, setCustomGoal] = useState('');
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState<string[]>(healthProfile.medications || []);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(healthProfile.chronicConditions || []);
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>([]);

  const handleGoalToggle = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    
    setSelectedGoals(newGoals);
    onChange({ healthGoals: newGoals });
  };

  const handleAddCustomGoal = () => {
    if (customGoal.trim()) {
      const newGoals = [...selectedGoals, customGoal.trim()];
      setSelectedGoals(newGoals);
      onChange({ healthGoals: newGoals });
      setCustomGoal('');
      setShowCustomGoal(false);
    }
  };

  const handleMedicationToggle = (medication: string) => {
    const newMedications = selectedMedications.includes(medication)
      ? selectedMedications.filter(m => m !== medication)
      : [...selectedMedications, medication];
    
    setSelectedMedications(newMedications);
    onChange({ medications: newMedications });
  };

  const handleConditionToggle = (condition: string) => {
    const newConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter(c => c !== condition)
      : [...selectedConditions, condition];
    
    setSelectedConditions(newConditions);
    onChange({ chronicConditions: newConditions });
  };

  const handleInputChange = (field: keyof HealthProfileData, value: any) => {
    onChange({ [field]: value });
  };

  const handleNext = () => {
    if (currentStep < 7) {
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
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-white minimal-health-profile">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">
            Создание профиля здоровья
          </h1>
          <p className="text-gray-600 text-lg">
            Настройте ваши цели для персонализированных рекомендаций
          </p>
        </div>

        {/* Progress */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Шаг {currentStep} из 7</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / 7) * 100)}%</span>
          </div>
          <div className="w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Health Goals */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Ваши цели здоровья
              </h2>
              <p className="text-gray-600 mb-12">
                Выберите основные направления для улучшения здоровья
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HEALTH_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                
                return (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`p-6 border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleGoalToggle(goal.id)}
                        className="w-5 h-5 text-blue-600 border-gray-300 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <h3 className={`text-lg font-medium ${isSelected ? 'text-blue-600' : 'text-black'}`}>
                            {goal.title}
                          </h3>
                        </div>
                        <p className="text-gray-600">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Goal */}
            <div className="border-t border-gray-200 pt-8">
              {!showCustomGoal ? (
                <button
                  onClick={() => setShowCustomGoal(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Добавить свою цель
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600 mb-2 block">Ваша цель</Label>
                    <Input
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      className="border-0 border-b border-gray-200 px-0 focus:border-blue-600"
                      placeholder="Введите вашу цель здоровья"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddCustomGoal}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Добавить
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomGoal(false);
                        setCustomGoal('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-black"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-8">
              Это поможет нам дать вам точные рекомендации
            </p>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {currentStep === 2 && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Базовая информация
              </h2>
              <p className="text-gray-600 mb-12">
                Основные данные о вашем здоровье
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-gray-600 mb-3 block font-medium">Возраст</Label>
                  <Input
                    type="number"
                    value={healthProfile.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="border-0 border-b-2 border-gray-200 px-0 py-3 text-lg focus:border-blue-600"
                    placeholder="Введите ваш возраст"
                  />
                </div>
                <div>
                  <Label className="text-gray-600 mb-3 block font-medium">Пол</Label>
                  <select
                    value={healthProfile.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full border-0 border-b-2 border-gray-200 px-0 py-3 text-lg focus:border-blue-600 bg-white"
                  >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                    <option value="other">Другой</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-gray-600 mb-3 block font-medium">Рост (см)</Label>
                  <Input
                    type="number"
                    value={healthProfile.height || ''}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                    className="border-0 border-b-2 border-gray-200 px-0 py-3 text-lg focus:border-blue-600"
                    placeholder="Введите ваш рост"
                  />
                </div>
                <div>
                  <Label className="text-gray-600 mb-3 block font-medium">Вес (кг)</Label>
                  <Input
                    type="number"
                    value={healthProfile.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                    className="border-0 border-b-2 border-gray-200 px-0 py-3 text-lg focus:border-blue-600"
                    placeholder="Введите ваш вес"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Physical Health */}
        {currentStep === 3 && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Физическое здоровье
              </h2>
              <p className="text-gray-600 mb-12">
                Ваш уровень активности и физические показатели
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">Уровень физической активности</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'sedentary', label: 'Малоподвижный', desc: 'Сидячая работа, мало движения' },
                    { value: 'moderate', label: 'Умеренный', desc: 'Легкие упражнения 1-3 раза в неделю' },
                    { value: 'active', label: 'Активный', desc: 'Регулярные тренировки 3-5 раз в неделю' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 hover:border-gray-300">
                      <input
                        type="radio"
                        name="activity"
                        value={option.value}
                        checked={healthProfile.physicalActivity === option.value}
                        onChange={(e) => handleInputChange('physicalActivity', e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-black">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">
                  Частота упражнений (раз в неделю): {healthProfile.exerciseFrequency || 0}
                </Label>
                <input
                  type="range"
                  min="0"
                  max="7"
                  value={healthProfile.exerciseFrequency || 0}
                  onChange={(e) => handleInputChange('exerciseFrequency', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Mental Health */}
        {currentStep === 4 && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Психическое здоровье
              </h2>
              <p className="text-gray-600 mb-12">
                Ваше эмоциональное состояние и уровень стресса
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">
                  Уровень стресса (1-10): {healthProfile.stressLevel || 5}
                </Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={healthProfile.stressLevel || 5}
                  onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Низкий</span>
                  <span>Высокий</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">
                  Уровень тревожности (1-10): {healthProfile.anxietyLevel || 5}
                </Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={healthProfile.anxietyLevel || 5}
                  onChange={(e) => handleInputChange('anxietyLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Низкий</span>
                  <span>Высокий</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">Качество сна</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'poor', label: 'Плохое' },
                    { value: 'fair', label: 'Удовлетворительное' },
                    { value: 'good', label: 'Хорошее' },
                    { value: 'excellent', label: 'Отличное' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sleepQuality"
                        value={option.value}
                        checked={healthProfile.sleepQuality === option.value}
                        onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-black">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Lifestyle */}
        {currentStep === 5 && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Образ жизни
              </h2>
              <p className="text-gray-600 mb-12">
                Ваши привычки и образ жизни
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">Курение</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'never', label: 'Никогда не курил' },
                    { value: 'former', label: 'Бросил курить' },
                    { value: 'current_light', label: 'Курю редко' },
                    { value: 'current_heavy', label: 'Курю регулярно' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="smoking"
                        value={option.value}
                        checked={healthProfile.smokingStatus === option.value}
                        onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-black">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">Употребление алкоголя</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'never', label: 'Не употребляю' },
                    { value: 'rarely', label: 'Редко' },
                    { value: 'occasionally', label: 'Иногда' },
                    { value: 'regularly', label: 'Регулярно' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="alcohol"
                        value={option.value}
                        checked={healthProfile.alcoholConsumption === option.value}
                        onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-black">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">
                  Потребление воды (стаканов в день): {healthProfile.waterIntake || 6}
                </Label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={healthProfile.waterIntake || 6}
                  onChange={(e) => handleInputChange('waterIntake', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Medical History */}
        {currentStep === 6 && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Медицинская история
              </h2>
              <p className="text-gray-600 mb-12">
                Заболевания, лекарства и аллергии
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">Хронические заболевания</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {COMMON_CONDITIONS.map((condition) => (
                    <label key={condition} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 hover:border-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => handleConditionToggle(condition)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-black">{condition}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <Label className="text-gray-600 mb-2 block">Другие заболевания</Label>
                  <Textarea
                    value={healthProfile.chronicConditions?.filter(c => !COMMON_CONDITIONS.includes(c)).join(', ') || ''}
                    onChange={(e) => {
                      const others = e.target.value.split(', ').filter(Boolean);
                      const all = [...selectedConditions, ...others];
                      handleInputChange('chronicConditions', all);
                    }}
                    className="border border-gray-200 focus:border-blue-600 p-4"
                    placeholder="Перечислите через запятую"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">Принимаемые лекарства</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {COMMON_MEDICATIONS.map((medication) => (
                    <label key={medication} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 hover:border-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedMedications.includes(medication)}
                        onChange={() => handleMedicationToggle(medication)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-black">{medication}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <Label className="text-gray-600 mb-2 block">Другие лекарства</Label>
                  <Input
                    value={healthProfile.medications?.filter(m => !COMMON_MEDICATIONS.includes(m)).join(', ') || ''}
                    onChange={(e) => {
                      const others = e.target.value.split(', ').filter(Boolean);
                      const all = [...selectedMedications, ...others];
                      handleInputChange('medications', all);
                    }}
                    className="border-0 border-b-2 border-gray-200 px-0 py-3 focus:border-blue-600"
                    placeholder="Перечислите через запятую"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-600 mb-3 block font-medium text-lg">Аллергии</Label>
                <Input
                  value={healthProfile.allergies?.join(', ') || ''}
                  onChange={(e) => handleInputChange('allergies', e.target.value.split(', ').filter(Boolean))}
                  className="border-0 border-b-2 border-gray-200 px-0 py-3 focus:border-blue-600"
                  placeholder="Перечислите аллергии через запятую"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Lab Results & Biomarkers */}
        {currentStep === 7 && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Анализы и биомаркеры
              </h2>
              <p className="text-gray-600 mb-12">
                Результаты последних лабораторных исследований
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <Label className="text-gray-600 mb-6 block font-medium text-lg">Отслеживаемые биомаркеры</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {COMMON_BIOMARKERS.map((biomarker) => (
                    <label key={biomarker} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 hover:border-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedBiomarkers.includes(biomarker)}
                        onChange={() => {
                          const newBiomarkers = selectedBiomarkers.includes(biomarker)
                            ? selectedBiomarkers.filter(b => b !== biomarker)
                            : [...selectedBiomarkers, biomarker];
                          setSelectedBiomarkers(newBiomarkers);
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-black">{biomarker}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-gray-600 mb-3 block font-medium">Дата последних анализов</Label>
                  <Input
                    type="date"
                    value={healthProfile.labResults?.testDate || ''}
                    onChange={(e) => handleInputChange('labResults', { 
                      ...healthProfile.labResults, 
                      testDate: e.target.value 
                    })}
                    className="border-0 border-b-2 border-gray-200 px-0 py-3 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-600 mb-3 block font-medium text-lg">Дополнительные сведения</Label>
                <Textarea
                  placeholder="Укажите дополнительную медицинскую информацию, особенности здоровья или цели лечения"
                  className="border border-gray-200 focus:border-blue-600 p-4"
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-100">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-black transition-colors text-lg"
              >
                ← Назад
              </button>
            )}
          </div>
          
          <div className="flex gap-6">
            <button
              onClick={onCancel}
              className="px-8 py-3 text-gray-600 hover:text-black transition-colors text-lg"
            >
              Отменить
            </button>
            
            {currentStep < 7 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-12 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-lg font-medium"
              >
                Продолжить
              </Button>
            ) : (
              <Button
                onClick={onSave}
                className="px-12 py-3 bg-blue-600 text-white hover:bg-blue-700 text-lg font-medium"
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
