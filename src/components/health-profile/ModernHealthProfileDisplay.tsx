import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Activity, 
  Target, 
  Pill, 
  FileText,
  Edit,
  Bell,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Heart,
  Brain,
  Droplets,
  Coffee,
  Bed,
  Dumbbell
} from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateValue } from "@/utils/healthProfileTranslations";
import { translateGoalText, translateHealthGoal } from "@/utils/goalTranslations";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";
import { useDailyHealthMetrics } from "@/hooks/useDailyHealthMetrics";
import DynamicHealthMetrics from "./DynamicHealthMetrics";
import EditHealthGoalsModal from "./EditHealthGoalsModal";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { cn } from "@/lib/utils";

interface ModernHealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const ModernHealthProfileDisplay: React.FC<ModernHealthProfileDisplayProps> = ({
  healthProfile,
  onEdit
}) => {
  const { user } = useAuth();
  const { goals } = useHealthGoalsManager();
  const { metrics, isLoading: metricsLoading, saveMetrics } = useDailyHealthMetrics();
  const { updateHealthProfile, saveHealthProfile } = useHealthProfile();

  // Состояния для управления открытием секций
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isMedicalOpen, setIsMedicalOpen] = useState(false);

  const handleSaveHealthProfile = async (): Promise<void> => {
    await saveHealthProfile();
  };

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Недостаточный вес';
    if (bmi < 25) return 'Норма';
    if (bmi < 30) return 'Избыточный вес';
    return 'Ожирение';
  };

  const getBMIColor = (bmi: number): string => {
    if (bmi < 18.5) return 'text-orange-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const bmi = calculateBMI(healthProfile.weight, healthProfile.height);
  
  // Объединяем цели из базы данных и из профиля
  const databaseGoals = goals || [];
  const profileGoals = healthProfile.healthGoals || [];
  
  // Преобразуем цели из профиля в формат для отображения с переводом
  const convertedProfileGoals = profileGoals.map((goal, index) => ({
    id: `profile-${index}`,
    title: translateHealthGoal(goal), // Используем новую функцию перевода
    description: '',
    category: 'health',
    priority: 'medium' as const,
    progress_percentage: undefined // Убираем прогресс
  }));
  
  // Сначала свои цели, потом из профиля
  const allGoals = [
    ...databaseGoals.map(goal => ({ ...goal, progress_percentage: undefined })), // Убираем прогресс
    ...convertedProfileGoals
  ];

  const getPriorityColor = (priority: string | null | undefined) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string | null | undefined) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не указан';
    }
  };

  const getCategoryText = (category: string | null | undefined) => {
    const categories: Record<string, string> = {
      'fitness': 'Фитнес',
      'nutrition': 'Питание',
      'sleep': 'Сон',
      'stress': 'Стресс',
      'weight': 'Вес',
      'health': 'Здоровье',
      'lifestyle': 'Образ жизни',
      'other': 'Другое'
    };
    return categories[category || ''] || category;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Профиль здоровья
        </h1>
        <p className="text-sm text-gray-600 mb-3">
          Управление и мониторинг вашего здоровья
        </p>
        
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 border border-gray-200 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Bell className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white border-none rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-3 h-3" />
            Изменить
          </button>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="mx-4 mb-3 bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">Основная информация</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{healthProfile.age}</div>
            <div className="text-xs text-gray-600">Возраст</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {healthProfile.gender === 'male' ? 'М' : 'Ж'}
            </div>
            <div className="text-xs text-gray-600">Пол</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{healthProfile.height}</div>
            <div className="text-xs text-gray-600">Рост (см)</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{healthProfile.weight}</div>
            <div className="text-xs text-gray-600">Вес (кг)</div>
          </div>
        </div>
      </div>

      {/* BMI Section */}
      <div className="mx-4 mb-3 bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">ИМТ</div>
              <div className="text-xs text-gray-600">Индекс массы тела</div>
            </div>
            <div className="text-right">
              <div className={cn("text-2xl font-bold", getBMIColor(bmi))}>
                {bmi.toFixed(1)}
              </div>
              <div className={cn("text-xs font-medium", getBMIColor(bmi))}>
                {getBMICategory(bmi)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics Section */}
      <div className="mx-4 mb-3 bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <button 
          onClick={() => setIsMetricsOpen(!isMetricsOpen)}
          className="w-full px-4 py-3 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-900">Метрики здоровья</span>
          </div>
          {isMetricsOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {isMetricsOpen && (
          <div className="p-4">
            <DynamicHealthMetrics 
              metrics={metrics}
              isLoading={metricsLoading}
              onMetricsUpdate={() => {}}
            />
          </div>
        )}
      </div>

      {/* Health Goals Section */}
      <div className="mx-4 mb-3 bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <button 
          onClick={() => setIsGoalsOpen(!isGoalsOpen)}
          className="w-full px-4 py-3 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-900">Цели здоровья</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {allGoals.length}
            </span>
          </div>
          {isGoalsOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {isGoalsOpen && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-600">Активные цели</span>
              <EditHealthGoalsModal
                healthProfile={healthProfile}
                onUpdate={updateHealthProfile}
                onSave={handleSaveHealthProfile}
              />
            </div>
            {allGoals.length > 0 ? (
              <div className="space-y-2">
                {allGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 text-sm">{goal.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {getPriorityText(goal.priority)}
                      </span>
                      <span className="text-xs text-gray-500">{getCategoryText(goal.category)}</span>
                    </div>
                  </div>
                ))}
                {allGoals.length > 3 && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500">+{allGoals.length - 3} ещё</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-3">Нет активных целей</p>
                <button className="bg-purple-600 text-white border-none rounded-lg px-3 py-2 text-xs font-medium hover:bg-purple-700 transition-colors">
                  Добавить цель
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Medical Information */}
      <div className="mx-4 mb-3 bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <button 
          onClick={() => setIsMedicalOpen(!isMedicalOpen)}
          className="w-full px-4 py-3 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-gray-900">Показатели здоровья</span>
          </div>
          {isMedicalOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {isMedicalOpen && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <Brain className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Стресс</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.stressLevel}/10</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <Brain className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Тревога</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.anxietyLevel}/10</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <Bed className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Сон</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.sleepHours}ч</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <Dumbbell className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Спорт</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.exerciseFrequency}/нед</div>
              </div>
              <div className="p-3 bg-cyan-50 rounded-lg text-center">
                <Droplets className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Вода</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.waterIntake}</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <Coffee className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Кофеин</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.caffeineIntake}</div>
              </div>
            </div>
            
            {/* Lab Results */}
            {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  Результаты анализов
                </h3>
                <div className="space-y-2">
                  {Object.entries(healthProfile.labResults).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernHealthProfileDisplay;