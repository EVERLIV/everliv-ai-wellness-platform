import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Activity, 
  Target, 
  Pill, 
  Stethoscope, 
  FileText,
  Edit,
  Settings,
  Home,
  Calendar,
  BarChart3,
  Heart
} from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateValue, translateHealthGoals, translateMedications, translateLabResultKey, formatLabResultValue } from "@/utils/healthProfileTranslations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";

interface EnhancedHealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

interface DailyMetric {
  id: string;
  date: string;
  steps?: number;
  exercise_minutes?: number;
  weight?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  stress_level?: number;
  mood_level?: number;
  water_intake?: number;
  notes?: string;
}

const EnhancedHealthProfileDisplay: React.FC<EnhancedHealthProfileDisplayProps> = ({
  healthProfile,
  onEdit
}) => {
  const { user } = useAuth();
  const { goals } = useHealthGoalsManager();
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetric[]>([]);

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Недостаточный вес";
    if (bmi < 25) return "Нормальный вес";
    if (bmi < 30) return "Избыточный вес";
    return "Ожирение";
  };

  const fetchDailyMetrics = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setDailyMetrics(data || []);
    } catch (error) {
      console.error('Error fetching daily metrics:', error);
    }
  };

  useEffect(() => {
    fetchDailyMetrics();
  }, [user]);

  const bmi = calculateBMI(healthProfile.weight, healthProfile.height);

  const menuItems = [
    { icon: Home, label: 'Дашборд', active: false },
    { icon: User, label: 'Профиль здоровья', active: true },
    { icon: Activity, label: 'Метрики', active: false },
    { icon: Target, label: 'Цели', active: false },
    { icon: Calendar, label: 'Анализы', active: false },
    { icon: Heart, label: 'Рекомендации', active: false },
    { icon: BarChart3, label: 'Отчеты', active: false },
    { icon: Settings, label: 'Настройки', active: false },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Боковое меню */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
            <span className="text-lg font-medium">HealthApp</span>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1">
        {/* Хедер */}
        <div className="border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-gray-900">Профиль здоровья</h1>
              <p className="text-sm text-gray-500">Управление личной информацией и показателями здоровья</p>
            </div>
            <Button onClick={onEdit} variant="outline" size="sm" className="border-gray-300">
              <Edit className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
          </div>
        </div>

        {/* Контент */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Основная информация */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-4">Основная информация</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Имя</label>
                      <div className="text-sm text-gray-900">{user?.user_metadata?.full_name || 'Не указано'}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email</label>
                      <div className="text-sm text-gray-900">{user?.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Возраст</label>
                      <div className="text-sm text-gray-900">{healthProfile.age} лет</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Пол</label>
                      <div className="text-sm text-gray-900">{translateValue('gender', healthProfile.gender)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Рост</label>
                      <div className="text-sm text-gray-900">{healthProfile.height} см</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Вес</label>
                      <div className="text-sm text-gray-900">{healthProfile.weight} кг</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">ИМТ</label>
                      <div className="text-sm text-gray-900">{bmi.toFixed(1)}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Категория ИМТ</label>
                      <div className="text-sm text-gray-900">{getBMICategory(bmi)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-4">Показатели активности</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Уровень стресса</label>
                      <div className="text-sm text-gray-900">{healthProfile.stressLevel}/10</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Часы сна</label>
                      <div className="text-sm text-gray-900">{healthProfile.sleepHours} часов</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Частота упражнений</label>
                      <div className="text-sm text-gray-900">{healthProfile.exerciseFrequency} раз в неделю</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Потребление воды</label>
                      <div className="text-sm text-gray-900">{healthProfile.waterIntake} стаканов</div>
                    </div>
                  </div>
                  {dailyMetrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Последние шаги</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].steps?.toLocaleString() || 'Нет данных'}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Тренировки (мин)</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].exercise_minutes || 'Нет данных'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Медицинская информация */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-medium text-gray-900 mb-4">Медицинская история</h2>
                  <div className="space-y-4">
                    {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Хронические заболевания</label>
                        <div className="text-sm text-gray-900">
                          {healthProfile.chronicConditions.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {healthProfile.allergies && healthProfile.allergies.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Аллергии</label>
                        <div className="text-sm text-gray-900">
                          {healthProfile.allergies.join(', ')}
                        </div>
                      </div>
                    )}

                    {healthProfile.familyHistory && healthProfile.familyHistory.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Семейный анамнез</label>
                        <div className="text-sm text-gray-900">
                          {healthProfile.familyHistory.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-900 mb-4">Лекарства и добавки</h2>
                  <div className="space-y-4">
                    {healthProfile.medications && healthProfile.medications.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Текущие лекарства</label>
                        <div className="text-sm text-gray-900">
                          {translateMedications(healthProfile.medications).join(', ')}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Потребление кофеина</label>
                      <div className="text-sm text-gray-900">{healthProfile.caffeineIntake} чашек в день</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Цели и анализы */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-medium text-gray-900 mb-4">Цели здоровья</h2>
                  <div className="space-y-4">
                    {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Цели из профиля</label>
                        <div className="text-sm text-gray-900">
                          {translateHealthGoals(healthProfile.healthGoals).join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {goals.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Пользовательские цели</label>
                        <div className="text-sm text-gray-900">
                          {goals.map(goal => goal.title).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-900 mb-4">Результаты анализов</h2>
                  <div className="space-y-4">
                    {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(healthProfile.labResults).map(([key, value]) => {
                          if (value !== undefined && value !== null && value !== '') {
                            return (
                              <div key={key} className="grid grid-cols-2 gap-2">
                                <div className="text-xs text-gray-500">{translateLabResultKey(key)}</div>
                                <div className="text-sm text-gray-900">{formatLabResultValue(key, value)}</div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Результаты анализов не добавлены</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHealthProfileDisplay;