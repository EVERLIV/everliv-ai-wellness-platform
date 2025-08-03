import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Activity, 
  Target, 
  Heart,
  Edit,
  TrendingUp,
  Droplets,
  Moon,
  Zap,
  Scale,
  Coffee
} from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateHealthGoal } from "@/utils/goalTranslations";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";
import { useDailyHealthMetrics } from "@/hooks/useDailyHealthMetrics";

interface HealthProfileDashboardProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const HealthProfileDashboard: React.FC<HealthProfileDashboardProps> = ({
  healthProfile,
  onEdit
}) => {
  const { user } = useAuth();
  const { goals } = useHealthGoalsManager();
  const { metrics, isLoading: metricsLoading } = useDailyHealthMetrics();

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
  
  // Объединяем цели из базы данных и из профиля
  const databaseGoals = goals || [];
  const profileGoals = healthProfile.healthGoals || [];
  
  // Преобразуем цели из профиля в формат для отображения с переводом
  const convertedProfileGoals = profileGoals.map((goal, index) => ({
    id: `profile-${index}`,
    title: translateHealthGoal(goal),
    description: '',
    category: 'health',
    priority: 'medium' as const
  }));
  
  const allGoals = [...databaseGoals, ...convertedProfileGoals];

  const healthMetrics = [
    {
      icon: Droplets,
      label: "Вода",
      value: `${healthProfile.waterIntake} ст.`,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Moon,
      label: "Сон",
      value: `${healthProfile.sleepHours}ч`,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Zap,
      label: "Стресс",
      value: `${healthProfile.stressLevel}/10`,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      icon: Coffee,
      label: "Кофеин",
      value: `${healthProfile.caffeineIntake} чаш.`,
      color: "amber",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Профиль здоровья</h1>
              <p className="text-gray-600">Управление и мониторинг вашего здоровья</p>
            </div>
            <Button
              onClick={onEdit}
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Edit className="h-5 w-5 mr-2" />
              Редактировать
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <Card className="bg-white rounded-3xl shadow-lg border border-green-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-2xl">
                <User className="h-6 w-6 text-green-600" />
              </div>
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-2xl font-bold text-green-800">{healthProfile.age}</div>
                <div className="text-sm text-green-600 font-medium">Возраст</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-2xl font-bold text-green-800">{healthProfile.gender === 'male' ? 'М' : 'Ж'}</div>
                <div className="text-sm text-green-600 font-medium">Пол</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-2xl font-bold text-green-800">{healthProfile.height}</div>
                <div className="text-sm text-green-600 font-medium">Рост (см)</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-2xl font-bold text-green-800">{healthProfile.weight}</div>
                <div className="text-sm text-green-600 font-medium">Вес (кг)</div>
              </div>
            </div>

            {/* BMI Display */}
            <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border border-green-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-200 rounded-2xl">
                    <Scale className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900">Индекс массы тела (ИМТ)</h3>
                    <p className="text-sm text-green-700">Расчет на основе роста и веса</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-3xl font-bold text-green-800">{bmi.toFixed(1)}</div>
                  <div className="text-sm font-medium text-green-700">{getBMICategory(bmi)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Metrics */}
        <Card className="bg-white rounded-3xl shadow-lg border border-green-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-2xl">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              Ежедневные показатели
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {healthMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className={`p-4 ${metric.bgColor} rounded-2xl border border-opacity-20`}>
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className={`h-5 w-5 ${metric.iconColor}`} />
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-800">Активность</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{healthProfile.exerciseFrequency} раз/нед</div>
              <div className="text-sm text-gray-600">Частота упражнений</div>
            </div>
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card className="bg-white rounded-3xl shadow-lg border border-green-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-100 rounded-2xl">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              Цели здоровья
              <span className="ml-auto text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {allGoals.length} {allGoals.length === 1 ? 'цель' : allGoals.length < 5 ? 'цели' : 'целей'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allGoals.length > 0 ? (
              <div className="grid gap-4">
                {allGoals.slice(0, 6).map((goal) => (
                  <div key={goal.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
                            {goal.category === 'health' ? 'Здоровье' : goal.category}
                          </span>
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            {goal.priority === 'high' ? 'Высокий' : goal.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-purple-200 rounded-xl ml-4">
                        <Target className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет активных целей</h3>
                <p className="text-gray-600 mb-6">Создайте цели для отслеживания прогресса здоровья</p>
                <Button 
                  onClick={onEdit}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 py-3"
                >
                  Добавить цель
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Summary */}
        <Card className="bg-white rounded-3xl shadow-lg border border-green-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-red-100 rounded-2xl">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              Общее состояние здоровья
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100">
                <h3 className="font-semibold text-red-900 mb-2">Уровень тревожности</h3>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-red-800">{healthProfile.anxietyLevel}</div>
                  <span className="text-sm text-red-600">/10</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(healthProfile.anxietyLevel / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <h3 className="font-semibold text-green-900 mb-2">Общий балл здоровья</h3>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-800">
                    {Math.round((10 - healthProfile.stressLevel + healthProfile.sleepHours + healthProfile.exerciseFrequency) / 3 * 10)}
                  </div>
                  <span className="text-sm text-green-600">/100</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((10 - healthProfile.stressLevel + healthProfile.sleepHours + healthProfile.exerciseFrequency) / 3 * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthProfileDashboard;