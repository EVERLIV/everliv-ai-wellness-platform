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
        <div className="space-y-6">
          {/* Основные показатели */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Основная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-0">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{healthProfile.age}</div>
                  <div className="text-sm text-blue-600">лет</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{healthProfile.height}</div>
                  <div className="text-sm text-green-600">см</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{healthProfile.weight}</div>
                  <div className="text-sm text-purple-600">кг</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{bmi.toFixed(1)}</div>
                  <div className="text-sm text-orange-600">ИМТ</div>
                </div>
              </CardContent>
            </Card>

            {/* Последние показатели */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Последние показатели
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {dailyMetrics.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {dailyMetrics[0].steps && (
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="text-lg font-bold text-blue-700">{dailyMetrics[0].steps}</div>
                        <div className="text-xs text-blue-600">шагов</div>
                      </div>
                    )}
                    {dailyMetrics[0].weight && (
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="text-lg font-bold text-purple-700">{dailyMetrics[0].weight}</div>
                        <div className="text-xs text-purple-600">кг</div>
                      </div>
                    )}
                    {dailyMetrics[0].sleep_hours && (
                      <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                        <div className="text-lg font-bold text-indigo-700">{dailyMetrics[0].sleep_hours}</div>
                        <div className="text-xs text-indigo-600">часов сна</div>
                      </div>
                    )}
                    {dailyMetrics[0].exercise_minutes && (
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="text-lg font-bold text-green-700">{dailyMetrics[0].exercise_minutes}</div>
                        <div className="text-xs text-green-600">мин тренировок</div>
                      </div>
                    )}
                    {dailyMetrics[0].water_intake && (
                      <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
                        <div className="text-lg font-bold text-cyan-700">{dailyMetrics[0].water_intake}</div>
                        <div className="text-xs text-cyan-600">л воды</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Начните отслеживать показатели</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Личная информация детально */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Детальная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-0">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Возраст</p>
                <p className="text-lg font-semibold">{healthProfile.age} лет</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Пол</p>
                <p className="text-lg font-semibold">{translateValue('gender', healthProfile.gender)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Рост</p>
                <p className="text-lg font-semibold">{healthProfile.height} см</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Базовый вес</p>
                <p className="text-lg font-semibold">{healthProfile.weight} кг</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">ИМТ</p>
                <p className="text-lg font-semibold">{bmi.toFixed(1)} ({getBMICategory(bmi)})</p>
              </div>
            </CardContent>
          </Card>

          {/* Медицинская история */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Медицинская история
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Хронические заболевания
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {healthProfile.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-sm px-3 py-1">{condition}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {healthProfile.allergies && healthProfile.allergies.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Аллергии
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {healthProfile.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-sm px-3 py-1">{allergy}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {healthProfile.familyHistory && healthProfile.familyHistory.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Семейный анамнез
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {healthProfile.familyHistory.map((history, index) => (
                      <Badge key={index} variant="outline" className="text-sm px-3 py-1">{history}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Цели здоровья из профиля */}
          {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Цели здоровья из профиля
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {translateHealthGoals(healthProfile.healthGoals).map((goal, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{goal}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Лекарства */}
          {healthProfile.medications && healthProfile.medications.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Лекарства
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {translateMedications(healthProfile.medications).map((medication, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{medication}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Результаты анализов */}
          {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Результаты анализов
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-0">
                {Object.entries(healthProfile.labResults).map(([key, value]) => {
                  if (value !== undefined && value !== null && value !== '') {
                    return (
                      <div key={key} className="space-y-2">
                        <p className="text-sm text-muted-foreground">{translateLabResultKey(key)}</p>
                        <p className="text-lg font-semibold">{formatLabResultValue(key, value)}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Заголовок */}
      <div className="text-center mb-8 pt-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Профиль здоровья
          </h1>
          <Button onClick={onEdit} variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Редактировать
          </Button>
        </div>
        <p className="text-muted-foreground">Управляйте своим здоровьем с помощью персонализированного профиля</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <ModernTabs tabs={tabs} defaultTab="goals" />
      </div>
    </div>
  );
};

export default EnhancedHealthProfileDisplay;