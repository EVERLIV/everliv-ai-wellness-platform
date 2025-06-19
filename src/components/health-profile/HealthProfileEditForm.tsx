import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Activity, Brain, Heart, Moon, FileText, Settings } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import PersonalInfoSection from "./PersonalInfoSection";
import PhysicalHealthSection from "./PhysicalHealthSection";
import MentalHealthSection from "./MentalHealthSection";
import LifestyleSection from "./LifestyleSection";
import SleepSection from "./SleepSection";
import LabResultsSection from "./LabResultsSection";
import RecommendationSettingsSection from "./RecommendationSettingsSection";
import NavigationControls from "./NavigationControls";

interface HealthProfileEditFormProps {
  healthProfile: HealthProfileData;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const HealthProfileEditForm: React.FC<HealthProfileEditFormProps> = ({
  healthProfile,
  onSave,
  onCancel,
  onChange
}) => {
  const handleArrayChange = (field: keyof HealthProfileData, value: string, checked: boolean) => {
    const currentArray = healthProfile[field] as string[];
    if (checked) {
      onChange({ [field]: [...currentArray, value] });
    } else {
      onChange({ [field]: currentArray.filter(item => item !== value) });
    }
  };

  const addToArray = (field: keyof HealthProfileData, value: string) => {
    if (!value.trim()) return;
    const currentArray = healthProfile[field] as string[];
    if (!currentArray.includes(value)) {
      onChange({ [field]: [...currentArray, value] });
    }
  };

  const removeFromArray = (field: keyof HealthProfileData, value: string) => {
    const currentArray = healthProfile[field] as string[];
    onChange({ [field]: currentArray.filter(item => item !== value) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Редактирование профиля здоровья</h2>
        <div className="flex gap-2">
          <Button onClick={onSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Отмена
          </Button>
        </div>
      </div>

      {/* Личная информация */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Личная информация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalInfoSection
            healthProfile={healthProfile}
            onChange={onChange}
          />
        </CardContent>
      </Card>

      {/* Физическое здоровье */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Физическое здоровье
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PhysicalHealthSection
            healthProfile={healthProfile}
            onChange={onChange}
          />
        </CardContent>
      </Card>

      {/* Психическое здоровье */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Психическое здоровье
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MentalHealthSection
            healthProfile={healthProfile}
            onChange={onChange}
          />
        </CardContent>
      </Card>

      {/* Образ жизни */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-green-500" />
            Образ жизни
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LifestyleSection
            healthProfile={healthProfile}
            onChange={onChange}
          />
        </CardContent>
      </Card>

      {/* Сон */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-500" />
            Сон
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SleepSection
            healthProfile={healthProfile}
            onChange={onChange}
          />
        </CardContent>
      </Card>

      {/* Лабораторные анализы */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-orange-500" />
            Лабораторные анализы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LabResultsSection
            labResults={healthProfile.labResults || {}}
            onChange={(labResults) => onChange({ labResults })}
          />
        </CardContent>
      </Card>

      {/* Медицинская история */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-red-500" />
            Медицинская история
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MedicalHistorySection
            data={healthProfile}
            onChange={onChange}
          />
        </CardContent>
      </Card>

      {/* Рекомендации */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            Рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecommendationSettingsSection
            healthProfile={healthProfile}
            onChange={onChange}
          />
        </CardContent>
      </Card>

      {/* Навигация */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            Навигация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NavigationControls
            healthProfile={healthProfile}
            onSave={onSave}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthProfileEditForm;
