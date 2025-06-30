
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Activity, Brain, Apple, Moon, FileText, Stethoscope, Target, Pill, Edit } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateValue, translateHealthGoals, translateMedications, translateLabResultKey, formatLabResultValue } from "@/utils/healthProfileTranslations";
import HealthProfileValueDisplay from "./HealthProfileValueDisplay";

interface HealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const HealthProfileDisplay: React.FC<HealthProfileDisplayProps> = ({
  healthProfile,
  onEdit
}) => {
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

  const bmi = calculateBMI(healthProfile.weight, healthProfile.height);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Профиль здоровья</h1>
          <p className="text-gray-600">Ваши персональные данные о здоровье</p>
        </div>
        <Button onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Редактировать
        </Button>
      </div>

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
            label="Вес"
            value={`${healthProfile.weight} кг`}
          />
          <HealthProfileValueDisplay
            label="ИМТ"
            value={`${bmi.toFixed(1)} (${getBMICategory(bmi)})`}
          />
        </CardContent>
      </Card>

      {/* Physical Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Физическое здоровье
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthProfile.physicalActivity && (
            <HealthProfileValueDisplay
              label="Физическая активность"
              value={translateValue('physicalActivity', healthProfile.physicalActivity)}
            />
          )}
          <HealthProfileValueDisplay
            label="Частота тренировок"
            value={`${healthProfile.exerciseFrequency} раз в неделю`}
          />
          {healthProfile.fitnessLevel && (
            <HealthProfileValueDisplay
              label="Уровень подготовки"
              value={translateValue('fitnessLevel', healthProfile.fitnessLevel)}
            />
          )}
        </CardContent>
      </Card>

      {/* Mental Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Психическое здоровье
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <HealthProfileValueDisplay
            label="Уровень стресса"
            value={`${healthProfile.stressLevel}/10`}
          />
          <HealthProfileValueDisplay
            label="Уровень тревожности"
            value={`${healthProfile.anxietyLevel}/10`}
          />
          {healthProfile.moodChanges && (
            <HealthProfileValueDisplay
              label="Изменения настроения"
              value={translateValue('moodChanges', healthProfile.moodChanges)}
            />
          )}
          {healthProfile.mentalHealthSupport && (
            <HealthProfileValueDisplay
              label="Поддержка психического здоровья"
              value={translateValue('mentalHealthSupport', healthProfile.mentalHealthSupport)}
            />
          )}
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            Образ жизни
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthProfile.smokingStatus && (
            <HealthProfileValueDisplay
              label="Курение"
              value={translateValue('smokingStatus', healthProfile.smokingStatus)}
            />
          )}
          {healthProfile.alcoholConsumption && (
            <HealthProfileValueDisplay
              label="Употребление алкоголя"
              value={translateValue('alcoholConsumption', healthProfile.alcoholConsumption)}
            />
          )}
          {healthProfile.dietType && (
            <HealthProfileValueDisplay
              label="Тип питания"
              value={translateValue('dietType', healthProfile.dietType)}
            />
          )}
          <HealthProfileValueDisplay
            label="Потребление воды"
            value={`${healthProfile.waterIntake} стаканов в день`}
          />
          <HealthProfileValueDisplay
            label="Потребление кофеина"
            value={`${healthProfile.caffeineIntake} чашек в день`}
          />
        </CardContent>
      </Card>

      {/* Sleep */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Сон и отдых
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <HealthProfileValueDisplay
            label="Часы сна"
            value={`${healthProfile.sleepHours} часов`}
          />
          {healthProfile.sleepQuality && (
            <HealthProfileValueDisplay
              label="Качество сна"
              value={translateValue('sleepQuality', healthProfile.sleepQuality)}
            />
          )}
          {healthProfile.sleepIssues && healthProfile.sleepIssues.length > 0 && (
            <div className="col-span-full">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Проблемы со сном
              </label>
              <div className="flex flex-wrap gap-2">
                {healthProfile.sleepIssues.map((issue, index) => (
                  <Badge key={index} variant="outline">{issue}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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

          {healthProfile.currentSymptoms && healthProfile.currentSymptoms.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Текущие симптомы
              </label>
              <div className="flex flex-wrap gap-2">
                {healthProfile.currentSymptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline">{symptom}</Badge>
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

          {healthProfile.previousSurgeries && healthProfile.previousSurgeries.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Перенесенные операции
              </label>
              <div className="flex flex-wrap gap-2">
                {healthProfile.previousSurgeries.map((surgery, index) => (
                  <Badge key={index} variant="outline">{surgery}</Badge>
                ))}
              </div>
            </div>
          )}

          {healthProfile.lastCheckup && (
            <HealthProfileValueDisplay
              label="Последний медосмотр"
              value={new Date(healthProfile.lastCheckup).toLocaleDateString('ru-RU')}
            />
          )}
        </CardContent>
      </Card>

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
    </div>
  );
};

export default HealthProfileDisplay;
