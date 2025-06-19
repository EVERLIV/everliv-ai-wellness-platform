
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";

interface RecommendationSettingsSectionProps {
  data: HealthProfileData;
  onChange: (data: HealthProfileData) => void;
}

const RecommendationSettingsSection: React.FC<RecommendationSettingsSectionProps> = ({
  data,
  onChange
}) => {
  const settings = data.recommendationSettings || {
    intermittentFasting: true,
    coldTherapy: true,
    breathingPractices: true,
    supplements: true,
    lifestyle: true,
    nutrition: true,
    exercise: true,
    stress: true,
  };

  const handleSettingChange = (setting: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [setting]: value };
    onChange({
      ...data,
      recommendationSettings: newSettings
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Настройки рекомендаций
        </CardTitle>
        <p className="text-sm text-gray-600">
          Выберите, какие типы рекомендаций вы хотите получать в аналитике здоровья
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Современные практики */}
        <div>
          <h4 className="font-medium mb-3 text-green-800">Современные практики здоровья</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="intermittent-fasting">Интервальное голодание</Label>
                <p className="text-xs text-gray-500">
                  Персональные рекомендации по интервальному голоданию
                </p>
              </div>
              <Switch
                id="intermittent-fasting"
                checked={settings.intermittentFasting}
                onCheckedChange={(value) => handleSettingChange('intermittentFasting', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cold-therapy">Практики с холодом</Label>
                <p className="text-xs text-gray-500">
                  Рекомендации по криотерапии и закаливанию
                </p>
              </div>
              <Switch
                id="cold-therapy"
                checked={settings.coldTherapy}
                onCheckedChange={(value) => handleSettingChange('coldTherapy', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="breathing-practices">Дыхательные практики</Label>
                <p className="text-xs text-gray-500">
                  Персональные дыхательные упражнения для здоровья
                </p>
              </div>
              <Switch
                id="breathing-practices"
                checked={settings.breathingPractices}
                onCheckedChange={(value) => handleSettingChange('breathingPractices', value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Классические рекомендации */}
        <div>
          <h4 className="font-medium mb-3 text-blue-800">Классические рекомендации</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nutrition">Питание</Label>
                <p className="text-xs text-gray-500">
                  Рекомендации по питанию и диете
                </p>
              </div>
              <Switch
                id="nutrition"
                checked={settings.nutrition}
                onCheckedChange={(value) => handleSettingChange('nutrition', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="supplements">Добавки и витамины</Label>
                <p className="text-xs text-gray-500">
                  Рекомендации по БАДам и витаминам
                </p>
              </div>
              <Switch
                id="supplements"
                checked={settings.supplements}
                onCheckedChange={(value) => handleSettingChange('supplements', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="exercise">Физические упражнения</Label>
                <p className="text-xs text-gray-500">
                  Рекомендации по физической активности
                </p>
              </div>
              <Switch
                id="exercise"
                checked={settings.exercise}
                onCheckedChange={(value) => handleSettingChange('exercise', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lifestyle">Образ жизни</Label>
                <p className="text-xs text-gray-500">
                  Общие рекомендации по образу жизни
                </p>
              </div>
              <Switch
                id="lifestyle"
                checked={settings.lifestyle}
                onCheckedChange={(value) => handleSettingChange('lifestyle', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="stress">Управление стрессом</Label>
                <p className="text-xs text-gray-500">
                  Рекомендации по снижению стресса и тревожности
                </p>
              </div>
              <Switch
                id="stress"
                checked={settings.stress}
                onCheckedChange={(value) => handleSettingChange('stress', value)}
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>Совет:</strong> Включите только те рекомендации, которые вам интересны. 
            Вы всегда можете изменить настройки позже.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationSettingsSection;
