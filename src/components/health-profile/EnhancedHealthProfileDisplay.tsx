import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Activity, 
  Brain, 
  Apple, 
  Moon, 
  FileText, 
  Stethoscope, 
  Target, 
  Pill, 
  Edit,
  Plus,
  TrendingUp,
  Calendar,
  Weight,
  Moon as SleepIcon,
  ArrowLeft
} from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateValue, translateHealthGoals, translateMedications, translateLabResultKey, formatLabResultValue } from "@/utils/healthProfileTranslations";
import HealthProfileValueDisplay from "./HealthProfileValueDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import DynamicHealthMetrics from "./DynamicHealthMetrics";
import ModernTabs from "@/components/ui/modern-tabs";
import UserHealthGoalsTab from "./UserHealthGoalsTab";

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
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetric[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

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
    
    setIsLoadingMetrics(true);
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
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchDailyMetrics();
  }, [user]);

  const bmi = calculateBMI(healthProfile.weight, healthProfile.height);

  const tabs = [
    {
      id: 'goals',
      label: 'Мои цели',
      icon: Target,
      content: <UserHealthGoalsTab healthProfile={healthProfile} />
    },
    {
      id: 'profile',
      label: 'Профиль',
      icon: User,
      content: (
        <div className="space-y-8">
          {/* Основная информация */}
          <div className="bg-white">
            <h2 className="text-base font-medium text-gray-900 mb-4">Основная информация</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Возраст</p>
                <p className="text-base font-medium text-gray-900">{healthProfile.age} лет</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Пол</p>
                <p className="text-base font-medium text-gray-900">{translateValue('gender', healthProfile.gender)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Рост</p>
                <p className="text-base font-medium text-gray-900">{healthProfile.height} см</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Вес</p>
                <p className="text-base font-medium text-gray-900">{healthProfile.weight} кг</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">ИМТ</p>
                <p className="text-base font-medium text-gray-900">{bmi.toFixed(1)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Категория</p>
                <p className="text-base font-medium text-gray-900">{getBMICategory(bmi)}</p>
              </div>
            </div>
          </div>

          {/* Последние показатели */}
          {dailyMetrics.length > 0 && (
            <div className="bg-white border-t border-gray-100 pt-8">
              <h2 className="text-base font-medium text-gray-900 mb-4">Последние показатели</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dailyMetrics[0].steps && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Шаги</p>
                    <p className="text-base font-medium text-gray-900">{dailyMetrics[0].steps.toLocaleString()}</p>
                  </div>
                )}
                {dailyMetrics[0].sleep_hours && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Сон</p>
                    <p className="text-base font-medium text-gray-900">{dailyMetrics[0].sleep_hours} ч</p>
                  </div>
                )}
                {dailyMetrics[0].exercise_minutes && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Тренировки</p>
                    <p className="text-base font-medium text-gray-900">{dailyMetrics[0].exercise_minutes} мин</p>
                  </div>
                )}
                {dailyMetrics[0].water_intake && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Вода</p>
                    <p className="text-base font-medium text-gray-900">{dailyMetrics[0].water_intake} л</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Медицинская история */}
          {(healthProfile.chronicConditions?.length > 0 || healthProfile.allergies?.length > 0 || healthProfile.familyHistory?.length > 0) && (
            <div className="bg-white border-t border-gray-100 pt-8">
              <h2 className="text-base font-medium text-gray-900 mb-4">Медицинская история</h2>
              <div className="space-y-4">
                {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Хронические заболевания</p>
                    <div className="flex flex-wrap gap-2">
                      {healthProfile.chronicConditions.map((condition, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {healthProfile.allergies && healthProfile.allergies.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Аллергии</p>
                    <div className="flex flex-wrap gap-2">
                      {healthProfile.allergies.map((allergy, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-red-50 text-red-800">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {healthProfile.familyHistory && healthProfile.familyHistory.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Семейный анамнез</p>
                    <div className="flex flex-wrap gap-2">
                      {healthProfile.familyHistory.map((history, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-800">
                          {history}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Лекарства */}
          {healthProfile.medications && healthProfile.medications.length > 0 && (
            <div className="bg-white border-t border-gray-100 pt-8">
              <h2 className="text-base font-medium text-gray-900 mb-4">Лекарства</h2>
              <div className="flex flex-wrap gap-2">
                {translateMedications(healthProfile.medications).map((medication, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-50 text-green-800">
                    {medication}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Результаты анализов */}
          {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
            <div className="bg-white border-t border-gray-100 pt-8">
              <h2 className="text-base font-medium text-gray-900 mb-4">Результаты анализов</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(healthProfile.labResults).map(([key, value]) => {
                  if (value !== undefined && value !== null && value !== '') {
                    return (
                      <div key={key} className="space-y-1">
                        <p className="text-sm text-gray-500">{translateLabResultKey(key)}</p>
                        <p className="text-base font-medium text-gray-900">{formatLabResultValue(key, value)}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {/* Цели здоровья из профиля */}
          {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 && (
            <div className="bg-white border-t border-gray-100 pt-8">
              <h2 className="text-base font-medium text-gray-900 mb-4">Цели здоровья</h2>
              <div className="flex flex-wrap gap-2">
                {translateHealthGoals(healthProfile.healthGoals).map((goal, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-50 text-purple-800">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'metrics',
      label: 'Метрики',
      icon: Activity,
      content: (
        <DynamicHealthMetrics 
          metrics={dailyMetrics}
          isLoading={isLoadingMetrics}
          onMetricsUpdate={fetchDailyMetrics}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Минималистичный заголовок */}
      <div className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">Профиль здоровья</h1>
          <Button onClick={onEdit} variant="outline" size="sm" className="text-sm">
            Редактировать
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <ModernTabs tabs={tabs} defaultTab="goals" />
      </div>
    </div>
  );
};

export default EnhancedHealthProfileDisplay;