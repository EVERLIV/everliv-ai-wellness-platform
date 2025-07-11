import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Moon as SleepIcon
} from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateValue, translateHealthGoals, translateMedications, translateLabResultKey, formatLabResultValue } from "@/utils/healthProfileTranslations";
import HealthProfileValueDisplay from "./HealthProfileValueDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import DynamicHealthMetrics from "./DynamicHealthMetrics";

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

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 md:p-6">
      {/* Компактный Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Профиль здоровья</h1>
          <p className="text-sm text-gray-500">Мониторинг состояния здоровья</p>
        </div>
        <Button onClick={onEdit} variant="outline" size="sm" className="text-xs">
          <Edit className="h-3 w-3 mr-1" />
          Редактировать
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="grid grid-cols-4 w-full min-w-max md:min-w-0 h-9 mb-4">
            <TabsTrigger value="overview" className="text-xs px-2">Обзор</TabsTrigger>
            <TabsTrigger value="static" className="text-xs px-2">Статические</TabsTrigger>
            <TabsTrigger value="dynamic" className="text-xs px-2">Динамические</TabsTrigger>
            <TabsTrigger value="medical" className="text-xs px-2">Медицинские</TabsTrigger>
          </TabsList>
        </div>

        {/* Обзор */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Основные показатели */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 pt-0">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-lg font-semibold text-blue-700">{healthProfile.age}</div>
                  <div className="text-xs text-blue-600">лет</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-lg font-semibold text-green-700">{healthProfile.height}</div>
                  <div className="text-xs text-green-600">см</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="text-lg font-semibold text-purple-700">{healthProfile.weight}</div>
                  <div className="text-xs text-purple-600">кг</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="text-lg font-semibold text-orange-700">{bmi.toFixed(1)}</div>
                  <div className="text-xs text-orange-600">ИМТ</div>
                </div>
              </CardContent>
            </Card>

            {/* Цели здоровья */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Цели здоровья</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 ? (
                  <div className="space-y-2">
                    {translateHealthGoals(healthProfile.healthGoals).slice(0, 4).map((goal, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded border text-sm">
                        {goal}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Target className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Цели здоровья не установлены</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Последние показатели */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Последние показатели</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {dailyMetrics.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {dailyMetrics[0].steps && (
                    <div className="text-center p-3 bg-blue-50 rounded border border-blue-100">
                      <div className="text-sm font-semibold text-blue-700">{dailyMetrics[0].steps}</div>
                      <div className="text-xs text-blue-600">шагов</div>
                    </div>
                  )}
                  {dailyMetrics[0].weight && (
                    <div className="text-center p-3 bg-purple-50 rounded border border-purple-100">
                      <div className="text-sm font-semibold text-purple-700">{dailyMetrics[0].weight}</div>
                      <div className="text-xs text-purple-600">кг</div>
                    </div>
                  )}
                  {dailyMetrics[0].sleep_hours && (
                    <div className="text-center p-3 bg-indigo-50 rounded border border-indigo-100">
                      <div className="text-sm font-semibold text-indigo-700">{dailyMetrics[0].sleep_hours}</div>
                      <div className="text-xs text-indigo-600">часов сна</div>
                    </div>
                  )}
                  {dailyMetrics[0].exercise_minutes && (
                    <div className="text-center p-3 bg-green-50 rounded border border-green-100">
                      <div className="text-sm font-semibold text-green-700">{dailyMetrics[0].exercise_minutes}</div>
                      <div className="text-xs text-green-600">мин тренировок</div>
                    </div>
                  )}
                  {dailyMetrics[0].water_intake && (
                    <div className="text-center p-3 bg-cyan-50 rounded border border-cyan-100">
                      <div className="text-sm font-semibold text-cyan-700">{dailyMetrics[0].water_intake}</div>
                      <div className="text-xs text-cyan-600">л воды</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Начните отслеживать показатели</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Статические данные */}
        <TabsContent value="static" className="space-y-3 mt-3">
          {/* Personal Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Личная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-0">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Возраст</p>
                <p className="text-xs font-medium">{healthProfile.age} лет</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Пол</p>
                <p className="text-xs font-medium">{translateValue('gender', healthProfile.gender)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Рост</p>
                <p className="text-xs font-medium">{healthProfile.height} см</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Базовый вес</p>
                <p className="text-xs font-medium">{healthProfile.weight} кг</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">ИМТ</p>
                <p className="text-xs font-medium">{bmi.toFixed(1)} ({getBMICategory(bmi)})</p>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                Медицинская история
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Хронические заболевания
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {healthProfile.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">{condition}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {healthProfile.allergies && healthProfile.allergies.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Аллергии
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {healthProfile.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs px-1 py-0">{allergy}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {healthProfile.familyHistory && healthProfile.familyHistory.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Семейный анамнез
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {healthProfile.familyHistory.map((history, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">{history}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Динамические показатели */}
        <TabsContent value="dynamic" className="space-y-3 mt-3">
          <DynamicHealthMetrics 
            metrics={dailyMetrics}
            isLoading={isLoadingMetrics}
            onMetricsUpdate={fetchDailyMetrics}
          />
        </TabsContent>

        {/* Медицинские данные */}
        <TabsContent value="medical" className="space-y-3 mt-3">
          {/* Medications */}
          {healthProfile.medications && healthProfile.medications.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Pill className="h-4 w-4" />
                  Лекарства
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {translateMedications(healthProfile.medications).map((medication, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-1 py-0">{medication}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lab Results */}
          {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Stethoscope className="h-4 w-4" />
                  Результаты анализов
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-0">
                {Object.entries(healthProfile.labResults).map(([key, value]) => {
                  if (value !== undefined && value !== null && value !== '') {
                    return (
                      <div key={key} className="space-y-1">
                        <p className="text-xs text-muted-foreground">{translateLabResultKey(key)}</p>
                        <p className="text-xs font-medium">{formatLabResultValue(key, value)}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>
          )}

          {/* Health Goals */}
          {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4" />
                  Цели здоровья
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {translateHealthGoals(healthProfile.healthGoals).map((goal, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-1 py-0">{goal}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedHealthProfileDisplay;