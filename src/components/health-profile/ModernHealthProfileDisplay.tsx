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
          <div className="text-base font-semibold text-gray-900 mb-2">Динамические показатели</div>
          <div className="text-sm text-gray-600 mb-4">
            Добавьте измерения для отслеживания показателей здоровья
          </div>
          <button className="bg-blue-600 text-white border-none rounded-lg px-5 py-3 text-sm font-medium w-full hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Добавить данные
          </button>
        </div>
      </div>

      {/* Health Indicators */}
      <div className="mx-5 mb-5 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span className="text-base font-semibold text-gray-900">Показатели здоровья</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{healthProfile.stressLevel}</div>
              <div className="text-xs text-gray-600 mt-1">Стресс (1-10)</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{healthProfile.sleepHours}ч</div>
              <div className="text-xs text-gray-600 mt-1">Сон</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{healthProfile.exerciseFrequency}</div>
              <div className="text-xs text-gray-600 mt-1">Спорт/неделя</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{healthProfile.waterIntake}</div>
              <div className="text-xs text-gray-600 mt-1">Вода (стаканы)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHealthProfileDisplay;