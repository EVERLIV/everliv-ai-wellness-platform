import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Activity, 
  Target, 
  Pill, 
  FileText,
  Edit,
  Bell
} from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateValue } from "@/utils/healthProfileTranslations";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";
import { useDailyHealthMetrics } from "@/hooks/useDailyHealthMetrics";
import DynamicHealthMetrics from "./DynamicHealthMetrics";

interface MobileHealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const MobileHealthProfileDisplay: React.FC<MobileHealthProfileDisplayProps> = ({
  healthProfile,
  onEdit
}) => {
  const { user } = useAuth();
  const { goals } = useHealthGoalsManager();
  const { metrics, isLoading: metricsLoading, saveMetrics } = useDailyHealthMetrics();

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

  const bmi = calculateBMI(healthProfile.weight, healthProfile.height);
  const healthGoals = goals || [];

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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Профиль здоровья</h1>
              <p className="text-sm text-muted-foreground mt-1">Управление и мониторинг вашего здоровья</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={onEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Редактировать</span>
                <span className="sm:hidden">Изменить</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{healthProfile.age}</div>
              <div className="text-sm text-muted-foreground">Возраст</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{healthProfile.gender === 'male' ? 'М' : 'Ж'}</div>
              <div className="text-sm text-muted-foreground">Пол</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{healthProfile.height}</div>
              <div className="text-sm text-muted-foreground">Рост (см)</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{healthProfile.weight}</div>
              <div className="text-sm text-muted-foreground">Вес (кг)</div>
            </div>
          </div>

          {/* BMI Display */}
          <div className="mt-4 sm:mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-medium">Индекс массы тела (ИМТ)</h3>
                <p className="text-sm text-muted-foreground mt-1">Расчет на основе роста и веса</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl sm:text-2xl font-bold text-primary">{bmi.toFixed(1)}</div>
                <div className="text-sm text-primary/80">{getBMICategory(bmi)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Метрики здоровья
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicHealthMetrics 
            metrics={metrics}
            isLoading={metricsLoading}
            onMetricsUpdate={() => {}}
          />
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Цели здоровья
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthGoals.length > 0 ? (
            <div className="grid gap-3 sm:gap-4">
              {healthGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{goal.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {getPriorityText(goal.priority)}
                      </span>
                      <span className="text-xs text-muted-foreground">{getCategoryText(goal.category)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-lg font-semibold">{goal.progress_percentage || 0}%</div>
                      <div className="w-full sm:w-20 bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Target className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Нет активных целей</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">Создайте цели для отслеживания прогресса здоровья</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
                Добавить цель
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-orange-600" />
            Медицинская информация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium mb-2">Показатели здоровья</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Уровень стресса</div>
                  <div className="text-lg font-semibold">{healthProfile.stressLevel}/10</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Часы сна</div>
                  <div className="text-lg font-semibold">{healthProfile.sleepHours}ч</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Частота упражнений</div>
                  <div className="text-lg font-semibold">{healthProfile.exerciseFrequency}/нед</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Потребление воды</div>
                  <div className="text-lg font-semibold">{healthProfile.waterIntake} ст.</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileHealthProfileDisplay;