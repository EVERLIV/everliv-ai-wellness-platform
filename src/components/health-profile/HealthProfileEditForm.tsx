
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, X, Heart, Activity, Brain, Apple, Moon, Stethoscope } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import MedicalHistorySection from "./MedicalHistorySection";
import LabResultsSection from "./LabResultsSection";

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="age">Возраст</Label>
              <Input
                id="age"
                type="number"
                value={healthProfile.age}
                onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="gender">Пол</Label>
              <Select value={healthProfile.gender} onValueChange={(value) => onChange({ gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пол" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="height">Рост (см)</Label>
              <Input
                id="height"
                type="number"
                value={healthProfile.height}
                onChange={(e) => onChange({ height: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="weight">Вес (кг)</Label>
              <Input
                id="weight"
                type="number"
                value={healthProfile.weight}
                onChange={(e) => onChange({ weight: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Физическая активность</Label>
              <Select value={healthProfile.physicalActivity} onValueChange={(value) => onChange({ physicalActivity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень активности" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Сидячий образ жизни</SelectItem>
                  <SelectItem value="light">Легкая активность</SelectItem>
                  <SelectItem value="moderate">Умеренная активность</SelectItem>
                  <SelectItem value="active">Активный</SelectItem>
                  <SelectItem value="very_active">Очень активный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exerciseFrequency">Частота тренировок (раз в неделю)</Label>
              <Input
                id="exerciseFrequency"
                type="number"
                value={healthProfile.exerciseFrequency}
                onChange={(e) => onChange({ exerciseFrequency: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Уровень физической подготовки</Label>
              <Select value={healthProfile.fitnessLevel} onValueChange={(value) => onChange({ fitnessLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Начинающий</SelectItem>
                  <SelectItem value="intermediate">Средний</SelectItem>
                  <SelectItem value="advanced">Продвинутый</SelectItem>
                  <SelectItem value="athlete">Спортсмен</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Уровень стресса: {healthProfile.stressLevel}/10</Label>
              <Slider
                value={[healthProfile.stressLevel]}
                onValueChange={(value) => onChange({ stressLevel: value[0] })}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Уровень тревожности: {healthProfile.anxietyLevel}/10</Label>
              <Slider
                value={[healthProfile.anxietyLevel]}
                onValueChange={(value) => onChange({ anxietyLevel: value[0] })}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Изменения настроения</Label>
              <Select value={healthProfile.moodChanges} onValueChange={(value) => onChange({ moodChanges: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stable">Стабильное настроение</SelectItem>
                  <SelectItem value="minor_fluctuations">Незначительные колебания</SelectItem>
                  <SelectItem value="moderate_fluctuations">Умеренные колебания</SelectItem>
                  <SelectItem value="significant_fluctuations">Значительные колебания</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Поддержка психического здоровья</Label>
              <Select value={healthProfile.mentalHealthSupport} onValueChange={(value) => onChange({ mentalHealthSupport: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Не получаю поддержку</SelectItem>
                  <SelectItem value="family_friends">Поддержка семьи и друзей</SelectItem>
                  <SelectItem value="therapy">Психотерапия</SelectItem>
                  <SelectItem value="medication">Медикаментозное лечение</SelectItem>
                  <SelectItem value="both">Терапия и медикаменты</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Курение</Label>
              <Select value={healthProfile.smokingStatus} onValueChange={(value) => onChange({ smokingStatus: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Никогда не курил(а)</SelectItem>
                  <SelectItem value="former">Бросил(а) курить</SelectItem>
                  <SelectItem value="occasional">Курю изредка</SelectItem>
                  <SelectItem value="regular">Курю регулярно</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Алкоголь</Label>
              <Select value={healthProfile.alcoholConsumption} onValueChange={(value) => onChange({ alcoholConsumption: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Не употребляю</SelectItem>
                  <SelectItem value="rarely">Редко</SelectItem>
                  <SelectItem value="occasionally">Иногда</SelectItem>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="daily">Ежедневно</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Тип питания</Label>
              <Select value={healthProfile.dietType} onValueChange={(value) => onChange({ dietType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="omnivore">Всеядное</SelectItem>
                  <SelectItem value="vegetarian">Вегетарианское</SelectItem>
                  <SelectItem value="vegan">Веганское</SelectItem>
                  <SelectItem value="keto">Кетогенное</SelectItem>
                  <SelectItem value="paleo">Палео</SelectItem>
                  <SelectItem value="mediterranean">Средиземноморское</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="waterIntake">Потребление воды (стаканов/день)</Label>
              <Input
                id="waterIntake"
                type="number"
                value={healthProfile.waterIntake}
                onChange={(e) => onChange({ waterIntake: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="caffeineIntake">Потребление кофеина (чашек/день)</Label>
              <Input
                id="caffeineIntake"
                type="number"
                value={healthProfile.caffeineIntake}
                onChange={(e) => onChange({ caffeineIntake: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sleepHours">Часы сна</Label>
              <Input
                id="sleepHours"
                type="number"
                value={healthProfile.sleepHours}
                onChange={(e) => onChange({ sleepHours: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Качество сна</Label>
              <Select value={healthProfile.sleepQuality} onValueChange={(value) => onChange({ sleepQuality: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Плохое</SelectItem>
                  <SelectItem value="fair">Удовлетворительное</SelectItem>
                  <SelectItem value="good">Хорошее</SelectItem>
                  <SelectItem value="excellent">Отличное</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
    </div>
  );
};

export default HealthProfileEditForm;
