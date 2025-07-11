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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ваш профиль здоровья</h1>
          <p className="text-gray-600">Отслеживайте свое здоровье и прогресс</p>
        </div>
        <Button onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Редактировать профиль
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="static">Статические данные</TabsTrigger>
          <TabsTrigger value="dynamic">Динамические показатели</TabsTrigger>
          <TabsTrigger value="medical">Медицинские данные</TabsTrigger>
        </TabsList>

        {/* Обзор */}
        <TabsContent value="overview" className="space-y-6">
          {/* Основные показатели */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Основные показатели
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{healthProfile.age}</div>
                <div className="text-sm text-blue-700">лет</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{healthProfile.height}</div>
                <div className="text-sm text-green-700">см</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{healthProfile.weight}</div>
                <div className="text-sm text-purple-700">кг</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{bmi.toFixed(1)}</div>
                <div className="text-sm text-orange-700">ИМТ</div>
              </div>
            </CardContent>
          </Card>

          {/* Последние динамические показатели */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Последние показатели
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dailyMetrics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {dailyMetrics[0].steps && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-600">{dailyMetrics[0].steps}</div>
                      <div className="text-xs text-blue-700">шагов</div>
                    </div>
                  )}
                  {dailyMetrics[0].weight && (
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-semibold text-purple-600">{dailyMetrics[0].weight}</div>
                      <div className="text-xs text-purple-700">кг</div>
                    </div>
                  )}
                  {dailyMetrics[0].sleep_hours && (
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <div className="text-lg font-semibold text-indigo-600">{dailyMetrics[0].sleep_hours}</div>
                      <div className="text-xs text-indigo-700">часов сна</div>
                    </div>
                  )}
                  {dailyMetrics[0].exercise_minutes && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-600">{dailyMetrics[0].exercise_minutes}</div>
                      <div className="text-xs text-green-700">мин тренировок</div>
                    </div>
                  )}
                  {dailyMetrics[0].water_intake && (
                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                      <div className="text-lg font-semibold text-cyan-600">{dailyMetrics[0].water_intake}</div>
                      <div className="text-xs text-cyan-700">л воды</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Начните отслеживать ваши ежедневные показатели</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Статические данные */}
        <TabsContent value="static" className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Личная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <HealthProfileValueDisplay
                label="Возраст"
                value={`${healthProfile.age} лет`}
              />
              <HealthProfileValueDisplay
                label="Пол"
                value={translateValue('gender', healthProfile.gender)}
              />
              <HealthProfileValueDisplay
                label="Рост"
                value={`${healthProfile.height} см`}
              />
              <HealthProfileValueDisplay
                label="Базовый вес"
                value={`${healthProfile.weight} кг`}
              />
              <HealthProfileValueDisplay
                label="ИМТ"
                value={`${bmi.toFixed(1)} (${getBMICategory(bmi)})`}
              />
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Медицинская история
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Хронические заболевания
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {healthProfile.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="outline">{condition}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {healthProfile.allergies && healthProfile.allergies.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Аллергии
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {healthProfile.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">{allergy}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {healthProfile.familyHistory && healthProfile.familyHistory.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Семейный анамнез
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {healthProfile.familyHistory.map((history, index) => (
                      <Badge key={index} variant="outline">{history}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Динамические показатели */}
        <TabsContent value="dynamic" className="space-y-6">
          <DynamicHealthMetrics 
            metrics={dailyMetrics}
            isLoading={isLoadingMetrics}
            onMetricsUpdate={fetchDailyMetrics}
          />
        </TabsContent>

        {/* Медицинские данные */}
        <TabsContent value="medical" className="space-y-6">
          {/* Medications */}
          {healthProfile.medications && healthProfile.medications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Принимаемые лекарства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {translateMedications(healthProfile.medications).map((medication, index) => (
                    <Badge key={index} variant="secondary">{medication}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lab Results */}
          {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Результаты анализов
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(healthProfile.labResults).map(([key, value]) => {
                  if (value !== undefined && value !== null && value !== '') {
                    return (
                      <HealthProfileValueDisplay
                        key={key}
                        label={translateLabResultKey(key)}
                        value={formatLabResultValue(key, value)}
                      />
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>
          )}

          {/* Health Goals */}
          {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Цели здоровья
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {translateHealthGoals(healthProfile.healthGoals).map((goal, index) => (
                    <Badge key={index} variant="secondary">{goal}</Badge>
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