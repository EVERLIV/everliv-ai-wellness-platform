import React from "react";
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
  TrendingUp
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
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="px-5 py-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Профиль здоровья
        </h1>
        <p className="text-gray-600 mb-5">
          Управление и мониторинг вашего здоровья
        </p>
        
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 border border-gray-200 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white border-none rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Изменить
          </button>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="mx-5 mb-5 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <span className="text-base font-semibold text-gray-900">Основная информация</span>
        </div>
        <div className="p-5 grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 leading-tight">{healthProfile.age}</div>
            <div className="text-sm text-gray-600 mt-1">Возраст</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 leading-tight">
              {healthProfile.gender === 'male' ? 'М' : 'Ж'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Пол</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 leading-tight">{healthProfile.height}</div>
            <div className="text-sm text-gray-600 mt-1">Рост (см)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 leading-tight">{healthProfile.weight}</div>
            <div className="text-sm text-gray-600 mt-1">Вес (кг)</div>
          </div>
        </div>
      </div>

      {/* BMI Section */}
      <div className="mx-5 mb-5 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5">
          <div className="text-base font-semibold text-gray-900 mb-1">Индекс массы тела (ИМТ)</div>
          <div className="text-sm text-gray-600 mb-4">Расчет на основе роста и веса</div>
          <div className={cn("text-4xl font-bold leading-tight mb-1", getBMIColor(bmi))}>
            {bmi.toFixed(1)}
          </div>
          <div className={cn("text-sm font-medium", getBMIColor(bmi))}>
            {getBMICategory(bmi)}
          </div>
        </div>
      </div>

      {/* Health Metrics Section */}
      <div className="mx-5 mb-5 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="text-base font-semibold text-gray-900">Метрики здоровья</span>
        </div>
        <div className="p-5">
          <DynamicHealthMetrics 
            metrics={metrics}
            isLoading={metricsLoading}
            onMetricsUpdate={() => {}}
          />
        </div>
      </div>

      {/* Health Goals Section */}
      <div className="mx-5 mb-5 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-base font-semibold text-gray-900">Цели здоровья</span>
          </div>
          <EditHealthGoalsModal
            healthProfile={healthProfile}
            onUpdate={updateHealthProfile}
            onSave={handleSaveHealthProfile}
          />
        </div>
        <div className="p-5">
          {allGoals.length > 0 ? (
            <div className="space-y-3">
              {allGoals.slice(0, 6).map((goal) => (
                <div key={goal.id} className="p-3 border border-gray-100 rounded-lg">
                  <h3 className="font-medium text-gray-900 text-sm">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{goal.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {getPriorityText(goal.priority)}
                    </span>
                    <span className="text-xs text-gray-500">{getCategoryText(goal.category)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Target className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base font-medium text-gray-900 mb-2">Нет активных целей</h3>
              <p className="text-sm text-gray-600 mb-4">Создайте цели для отслеживания прогресса здоровья</p>
              <button className="bg-purple-600 text-white border-none rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-700 transition-colors">
                Добавить цель
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Medical Information */}
      <div className="mx-5 mb-5 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Pill className="w-5 h-5 text-orange-600" />
          <span className="text-base font-semibold text-gray-900">Медицинская информация</span>
        </div>
        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Показатели здоровья</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Уровень стресса</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.stressLevel}/10</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Уровень тревоги</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.anxietyLevel}/10</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Часы сна</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.sleepHours}ч</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Упражнения/нед</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.exerciseFrequency}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Вода (стаканы)</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.waterIntake}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Кофеин (чашки)</div>
                <div className="text-lg font-semibold text-gray-900">{healthProfile.caffeineIntake}</div>
              </div>
            </div>
          </div>
          
          {/* Lab Results */}
          {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Результаты анализов</h3>
              <div className="space-y-2">
                {Object.entries(healthProfile.labResults).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">{key}</span>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernHealthProfileDisplay;