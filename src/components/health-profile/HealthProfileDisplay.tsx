
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, User, Activity, Brain, Moon, TestTube, Microscope } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import HealthProfileValueDisplay from "./HealthProfileValueDisplay";

interface HealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const HealthProfileDisplay: React.FC<HealthProfileDisplayProps> = ({
  healthProfile,
  onEdit
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ваш профиль здоровья</h2>
        <Button onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Редактировать
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthProfileValueDisplay value={healthProfile.age} label="Возраст" />
          <HealthProfileValueDisplay value={healthProfile.gender} label="Пол" />
          <HealthProfileValueDisplay value={healthProfile.height} label="Рост (см)" />
          <HealthProfileValueDisplay value={healthProfile.weight} label="Вес (кг)" />
        </CardContent>
      </Card>

      {/* Physical Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Физическая активность
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthProfileValueDisplay value={healthProfile.exerciseFrequency} label="Частота тренировок (раз в неделю)" />
          <HealthProfileValueDisplay value={healthProfile.physicalActivity || 'Не указано'} label="Уровень активности" />
          <HealthProfileValueDisplay value={healthProfile.fitnessLevel || 'Не указан'} label="Уровень подготовки" />
        </CardContent>
      </Card>

      {/* Mental Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Психическое здоровье
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthProfileValueDisplay value={healthProfile.stressLevel} label="Уровень стресса (1-10)" />
          <HealthProfileValueDisplay value={healthProfile.anxietyLevel} label="Уровень тревожности (1-10)" />
          <HealthProfileValueDisplay value={healthProfile.mentalHealthSupport || 'Не указано'} label="Поддержка психического здоровья" />
        </CardContent>
      </Card>

      {/* Sleep */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-500" />
            Сон
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthProfileValueDisplay value={healthProfile.sleepHours} label="Часы сна" />
          <HealthProfileValueDisplay value={healthProfile.sleepQuality || 'Не указано'} label="Качество сна" />
          <HealthProfileValueDisplay value={healthProfile.sleepIssues || []} label="Проблемы со сном" type="array" />
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Образ жизни
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <HealthProfileValueDisplay value={healthProfile.waterIntake} label="Потребление воды (стаканов)" />
          <HealthProfileValueDisplay value={healthProfile.caffeineIntake} label="Кофеин (чашек)" />
          <HealthProfileValueDisplay value={healthProfile.smokingStatus || 'Не указано'} label="Курение" />
          <HealthProfileValueDisplay value={healthProfile.alcoholConsumption || 'Не указано'} label="Алкоголь" />
        </CardContent>
      </Card>

      {/* Lab Results */}
      {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-red-500" />
                Общий анализ крови
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {healthProfile.labResults.hemoglobin && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="text-sm font-medium text-red-700 mb-1">Гемоглобин</div>
                  <div className="text-lg font-semibold text-red-900">{healthProfile.labResults.hemoglobin} г/л</div>
                  <div className="text-xs text-red-600">Норма: М 130-160, Ж 120-150</div>
                </div>
              )}
              {healthProfile.labResults.erythrocytes && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="text-sm font-medium text-red-700 mb-1">Эритроциты</div>
                  <div className="text-lg font-semibold text-red-900">{healthProfile.labResults.erythrocytes} млн/мкл</div>
                  <div className="text-xs text-red-600">Норма: М 4.0-5.5, Ж 3.9-5.0</div>
                </div>
              )}
              {healthProfile.labResults.hematocrit && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="text-sm font-medium text-red-700 mb-1">Гематокрит</div>
                  <div className="text-lg font-semibold text-red-900">{healthProfile.labResults.hematocrit}%</div>
                  <div className="text-xs text-red-600">Норма: М 40-48, Ж 36-42</div>
                </div>
              )}
              {healthProfile.labResults.platelets && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="text-sm font-medium text-red-700 mb-1">Тромбоциты</div>
                  <div className="text-lg font-semibold text-red-900">{healthProfile.labResults.platelets} тыс/мкл</div>
                  <div className="text-xs text-red-600">Норма: 150-400</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5 text-blue-500" />
                Биохимические показатели
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthProfile.labResults.cholesterol && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-700 mb-1">Холестерин общий</div>
                  <div className="text-lg font-semibold text-blue-900">{healthProfile.labResults.cholesterol} ммоль/л</div>
                  <div className="text-xs text-blue-600">Норма: 3.0-5.2</div>
                </div>
              )}
              {healthProfile.labResults.bloodSugar && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-700 mb-1">Глюкоза крови</div>
                  <div className="text-lg font-semibold text-blue-900">{healthProfile.labResults.bloodSugar} ммоль/л</div>
                  <div className="text-xs text-blue-600">Норма: 3.9-6.1</div>
                </div>
              )}
              {healthProfile.labResults.ldh && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-700 mb-1">ЛДГ</div>
                  <div className="text-lg font-semibold text-blue-900">{healthProfile.labResults.ldh} Ед/л</div>
                  <div className="text-xs text-blue-600">Норма: 120-240</div>
                </div>
              )}
            </CardContent>
          </Card>

          {healthProfile.labResults.testDate && (
            <div className="text-sm text-gray-500 text-center">
              Дата анализов: {new Date(healthProfile.labResults.testDate).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>
      )}

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Медицинская история</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <HealthProfileValueDisplay value={healthProfile.chronicConditions || []} label="Хронические заболевания" type="array" />
          <HealthProfileValueDisplay value={healthProfile.allergies || []} label="Аллергии" type="array" />
          <HealthProfileValueDisplay value={healthProfile.medications || []} label="Принимаемые лекарства" type="array" />
          <HealthProfileValueDisplay value={healthProfile.familyHistory || []} label="Семейный анамнез" type="array" />
          <HealthProfileValueDisplay value={healthProfile.lastCheckup || 'Не указано'} label="Последний осмотр врача" />
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthProfileDisplay;
