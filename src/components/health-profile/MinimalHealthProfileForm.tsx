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
      <div className="container-adaptive py-adaptive-xl">
        {/* Header */}
        <div className="text-center mb-adaptive-2xl">
          <h1 className="text-adaptive-4xl font-bold text-black mb-adaptive-md">
            Создание профиля здоровья
          </h1>
          <p className="text-adaptive-lg text-gray-600">
            Настройте ваши цели для персонализированных рекомендаций
          </p>
        </div>

        {/* Progress */}
        <div className="mb-adaptive-2xl">
          <div className="flex justify-between items-center mb-adaptive-sm">
            <span className="text-adaptive-sm text-gray-600">Шаг {currentStep} из 7</span>
            <span className="text-adaptive-sm text-gray-600">{Math.round((currentStep / 7) * 100)}%</span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Health Goals */}
        {currentStep === 1 && (
          <div className="space-adaptive-xl">
            <div className="text-center mb-adaptive-xl">
              <h2 className="text-adaptive-3xl font-bold text-black mb-adaptive-sm">
                Ваши цели здоровья
              </h2>
              <p className="text-adaptive-base text-gray-600">
                Выберите основные направления для улучшения здоровья
              </p>
            </div>
            
            <div className="grid-adaptive grid-adaptive-2 mb-adaptive-xl">
              {HEALTH_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                
                return (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`p-adaptive-lg border cursor-pointer transition-colors touch-target ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-adaptive-md">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleGoalToggle(goal.id)}
                        className="w-5 h-5 text-blue-600 border-gray-300 mt-1 touch-target"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-adaptive-sm mb-adaptive-sm">
                          <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <h3 className={`text-adaptive-base font-medium break-words ${isSelected ? 'text-blue-600' : 'text-black'}`}>
                            {goal.title}
                          </h3>
                        </div>
                        <p className="text-adaptive-sm text-gray-600 break-words">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Goal */}
            <div className="border-t border-gray-200 pt-adaptive-xl">
              {!showCustomGoal ? (
                <button
                  onClick={() => setShowCustomGoal(true)}
                  className="flex items-center gap-adaptive-sm text-blue-600 hover:text-blue-700 touch-target"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-adaptive-sm">Добавить свою цель</span>
                </button>
              ) : (
                <div className="space-adaptive-md">
                  <div>
                    <Label className="text-adaptive-sm text-gray-600 mb-adaptive-sm block">Ваша цель</Label>
                    <Input
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      className="border-0 border-b border-gray-200 px-0 focus:border-blue-600 touch-target"
                      placeholder="Введите вашу цель здоровья"
                    />
                  </div>
                  <div className="flex gap-adaptive-sm">
                    <button
                      onClick={handleAddCustomGoal}
                      className="px-adaptive-md py-adaptive-sm bg-blue-600 text-white hover:bg-blue-700 touch-target text-adaptive-sm"
                    >
                      Добавить
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomGoal(false);
                        setCustomGoal('');
                      }}
                      className="px-adaptive-md py-adaptive-sm text-gray-600 hover:text-black touch-target text-adaptive-sm"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-adaptive-xs text-gray-500 mt-adaptive-xl text-center">
              Это поможет нам дать вам точные рекомендации
            </p>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {currentStep === 2 && (
          <div className="space-adaptive-xl">
            <div className="text-center mb-adaptive-xl">
              <h2 className="text-adaptive-3xl font-bold text-black mb-adaptive-sm">
                Базовая информация
              </h2>
              <p className="text-adaptive-base text-gray-600">
                Основные данные о вашем здоровье
              </p>
            </div>
            
            <div className="space-adaptive-xl max-w-2xl mx-auto">
              <div className="grid-adaptive grid-adaptive-2">
                <div>
                  <Label className="text-adaptive-sm text-gray-600 mb-adaptive-sm block font-medium">Возраст</Label>
                  <Input
                    type="number"
                    value={healthProfile.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="border-0 border-b-2 border-gray-200 px-0 py-adaptive-sm text-adaptive-base focus:border-blue-600 touch-target"
                    placeholder="Введите ваш возраст"
                  />
                </div>
                <div>
                  <Label className="text-adaptive-sm text-gray-600 mb-adaptive-sm block font-medium">Пол</Label>
                  <select
                    value={healthProfile.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full border-0 border-b-2 border-gray-200 px-0 py-adaptive-sm text-adaptive-base focus:border-blue-600 bg-white touch-target"
                  >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                    <option value="other">Другой</option>
                  </select>
                </div>
              </div>
              
              <div className="grid-adaptive grid-adaptive-2">
                <div>
                  <Label className="text-adaptive-sm text-gray-600 mb-adaptive-sm block font-medium">Рост (см)</Label>
                  <Input
                    type="number"
                    value={healthProfile.height || ''}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                    className="border-0 border-b-2 border-gray-200 px-0 py-adaptive-sm text-adaptive-base focus:border-blue-600 touch-target"
                    placeholder="Введите ваш рост"
                  />
                </div>
                <div>
                  <Label className="text-adaptive-sm text-gray-600 mb-adaptive-sm block font-medium">Вес (кг)</Label>
                  <Input
                    type="number"
                    value={healthProfile.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                    className="border-0 border-b-2 border-gray-200 px-0 py-adaptive-sm text-adaptive-base focus:border-blue-600 touch-target"
                    placeholder="Введите ваш вес"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Physical Health */}
        {currentStep === 3 && (
          <div className="space-adaptive-xl">
            <div className="text-center mb-adaptive-xl">
              <h2 className="text-adaptive-3xl font-bold text-black mb-adaptive-sm">
                Физическое здоровье
              </h2>
              <p className="text-adaptive-base text-gray-600">
                Ваш уровень активности и физические показатели
              </p>
            </div>

            <div className="space-adaptive-xl max-w-3xl mx-auto">
              <div>
                <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium">Уровень физической активности</Label>
                <div className="grid-adaptive grid-adaptive-2 lg:grid-cols-3">
                  {[
                    { value: 'sedentary', label: 'Малоподвижный', desc: 'Сидячая работа, мало движения' },
                    { value: 'moderate', label: 'Умеренный', desc: 'Легкие упражнения 1-3 раза в неделю' },
                    { value: 'active', label: 'Активный', desc: 'Регулярные тренировки 3-5 раз в неделю' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-adaptive-sm cursor-pointer p-adaptive-md border border-gray-200 hover:border-gray-300 touch-target">
                      <input
                        type="radio"
                        name="activity"
                        value={option.value}
                        checked={healthProfile.physicalActivity === option.value}
                        onChange={(e) => handleInputChange('physicalActivity', e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-black text-adaptive-sm mb-1 break-words">{option.label}</div>
                        <div className="text-adaptive-xs text-gray-600 break-words">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium">
                  Частота упражнений (раз в неделю): {healthProfile.exerciseFrequency || 0}
                </Label>
                <input
                  type="range"
                  min="0"
                  max="7"
                  value={healthProfile.exerciseFrequency || 0}
                  onChange={(e) => handleInputChange('exerciseFrequency', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 cursor-pointer touch-target"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Mental Health */}
        {currentStep === 4 && (
          <div className="space-adaptive-xl">
            <div className="text-center mb-adaptive-xl">
              <h2 className="text-adaptive-3xl font-bold text-black mb-adaptive-sm">
                Психическое здоровье
              </h2>
              <p className="text-adaptive-base text-gray-600 mb-adaptive-sm">
                Ваше эмоциональное состояние и уровень стресса
              </p>
            </div>

            <div className="space-adaptive-xl max-w-3xl mx-auto">
              <div className="space-adaptive-xl">
                <div>
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">
                    Уровень стресса (1-10): {healthProfile.stressLevel || 5}
                  </Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={healthProfile.stressLevel || 5}
                    onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 cursor-pointer touch-target"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Низкий</span>
                    <span>Высокий</span>
                  </div>
                </div>

                <div>
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">
                    Уровень тревожности (1-10): {healthProfile.anxietyLevel || 5}
                  </Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={healthProfile.anxietyLevel || 5}
                    onChange={(e) => handleInputChange('anxietyLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 cursor-pointer touch-target"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Низкий</span>
                    <span>Высокий</span>
                  </div>
                </div>

                <div>
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">Качество сна</Label>
                  <div className="grid-adaptive grid-adaptive-2 gap-adaptive-md">
                    {[
                      { value: 'poor', label: 'Плохое' },
                      { value: 'fair', label: 'Удовлетворительное' },
                      { value: 'good', label: 'Хорошее' },
                      { value: 'excellent', label: 'Отличное' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-adaptive-sm cursor-pointer">
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
          </div>
        )}

        {/* Step 5: Lifestyle */}
        {currentStep === 5 && (
          <div className="space-adaptive-xl">
            <div className="text-center mb-adaptive-xl">
              <h2 className="text-adaptive-3xl font-bold text-black mb-adaptive-sm">
                Образ жизни
              </h2>
              <p className="text-adaptive-base text-gray-600 mb-adaptive-sm">
                Ваши привычки и образ жизни
              </p>
            </div>

            <div className="space-adaptive-xl max-w-3xl mx-auto">
              <div className="space-adaptive-xl">
                <div>
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">Курение</Label>
                  <div className="grid-adaptive grid-adaptive-2 gap-adaptive-md">
                    {[
                      { value: 'never', label: 'Никогда не курил' },
                      { value: 'former', label: 'Бросил курить' },
                      { value: 'current_light', label: 'Курю редко' },
                      { value: 'current_heavy', label: 'Курю регулярно' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-adaptive-sm cursor-pointer">
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
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">Употребление алкоголя</Label>
                  <div className="grid-adaptive grid-adaptive-2 gap-adaptive-md">
                    {[
                      { value: 'never', label: 'Не употребляю' },
                      { value: 'rarely', label: 'Редко' },
                      { value: 'occasionally', label: 'Иногда' },
                      { value: 'regularly', label: 'Регулярно' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-adaptive-sm cursor-pointer">
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
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">
                    Потребление воды (стаканов в день): {healthProfile.waterIntake || 6}
                  </Label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={healthProfile.waterIntake || 6}
                    onChange={(e) => handleInputChange('waterIntake', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 cursor-pointer touch-target"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Medical History */}
        {currentStep === 6 && (
          <div className="space-adaptive-xl">
            <div className="text-center mb-adaptive-xl">
              <h2 className="text-adaptive-3xl font-bold text-black mb-adaptive-sm">
                Медицинская история
              </h2>
              <p className="text-adaptive-base text-gray-600 mb-adaptive-sm">
                Заболевания, лекарства и аллергии
              </p>
            </div>

            <div className="space-adaptive-xl max-w-3xl mx-auto">
              <div className="space-adaptive-xl">
                <div>
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">Хронические заболевания</Label>
                  <div className="grid-adaptive grid-adaptive-2 gap-adaptive-md mb-adaptive-lg">
                    {COMMON_CONDITIONS.map((condition) => (
                      <label key={condition} className="flex items-center gap-adaptive-sm cursor-pointer p-adaptive-md border border-gray-200 hover:border-gray-300 touch-target">
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
                    <Label className="text-adaptive-lg text-gray-600 mb-adaptive-sm block">Другие заболевания</Label>
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
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">Принимаемые лекарства</Label>
                  <div className="grid-adaptive grid-adaptive-2 gap-adaptive-md mb-adaptive-lg">
                    {COMMON_MEDICATIONS.map((medication) => (
                      <label key={medication} className="flex items-center gap-adaptive-sm cursor-pointer p-adaptive-md border border-gray-200 hover:border-gray-300 touch-target">
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
                    <Label className="text-adaptive-lg text-gray-600 mb-adaptive-sm block">Другие лекарства</Label>
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
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">Аллергии</Label>
                  <Input
                    value={healthProfile.allergies?.join(', ') || ''}
                    onChange={(e) => handleInputChange('allergies', e.target.value.split(', ').filter(Boolean))}
                    className="border-0 border-b-2 border-gray-200 px-0 py-3 focus:border-blue-600"
                    placeholder="Перечислите аллергии через запятую"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Lab Results & Biomarkers */}
        {currentStep === 7 && (
          <div className="space-adaptive-xl">
            <div className="text-center mb-adaptive-xl">
              <h2 className="text-adaptive-3xl font-bold text-black mb-adaptive-sm">
                Анализы и биомаркеры
              </h2>
              <p className="text-adaptive-base text-gray-600 mb-adaptive-sm">
                Результаты последних лабораторных исследований
              </p>
            </div>

            <div className="space-adaptive-xl max-w-3xl mx-auto">
              <div className="space-adaptive-xl">
                <div>
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">Отслеживаемые биомаркеры</Label>
                  <div className="grid-adaptive grid-adaptive-2 gap-adaptive-md mb-adaptive-lg">
                    {COMMON_BIOMARKERS.map((biomarker) => (
                      <label key={biomarker} className="flex items-center gap-adaptive-sm cursor-pointer p-adaptive-md border border-gray-200 hover:border-gray-300 touch-target">
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

                <div className="grid-adaptive grid-adaptive-2 gap-adaptive-md">
                  <div>
                    <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium">Дата последних анализов</Label>
                    <Input
                      type="date"
                      value={healthProfile.labResults?.testDate || ''}
                      onChange={(e) => handleInputChange('labResults', { 
                        ...healthProfile.labResults, 
                        testDate: e.target.value 
                      })}
                      className="border-0 border-b-2 border-gray-200 px-0 py-adaptive-sm focus:border-blue-600 touch-target"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-adaptive-lg text-gray-600 mb-adaptive-lg block font-medium text-lg">Дополнительные сведения</Label>
                  <Textarea
                    placeholder="Укажите дополнительную медицинскую информацию, особенности здоровья или цели лечения"
                    className="border border-gray-200 focus:border-blue-600 p-4"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-adaptive-md mt-adaptive-2xl pt-adaptive-xl border-t border-gray-100">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-black transition-colors text-adaptive-base touch-target px-adaptive-sm py-adaptive-xs"
              >
                ← Назад
              </button>
            )}
          </div>
          
          <div className="flex gap-adaptive-lg w-full sm:w-auto">
            <button
              onClick={onCancel}
              className="flex-1 sm:flex-none px-adaptive-xl py-adaptive-sm text-gray-600 hover:text-black transition-colors text-adaptive-base touch-target"
            >
              Отменить
            </button>
            
            {currentStep < 7 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 sm:flex-none px-adaptive-xl py-adaptive-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-adaptive-base font-medium touch-target"
              >
                Продолжить
              </Button>
            ) : (
              <Button
                onClick={onSave}
                className="flex-1 sm:flex-none px-adaptive-xl py-adaptive-sm bg-blue-600 text-white hover:bg-blue-700 text-adaptive-base font-medium touch-target"
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
