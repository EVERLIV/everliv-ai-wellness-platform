
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Heart, Activity, Brain, Apple, Moon, Stethoscope } from "lucide-react";
import { HealthProfileData } from "@/hooks/useHealthProfile";

interface HealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const HealthProfileDisplay: React.FC<HealthProfileDisplayProps> = ({
  healthProfile,
  onEdit
}) => {
  const calculateBMI = () => {
    const bmi = healthProfile.weight / ((healthProfile.height / 100) ** 2);
    return bmi.toFixed(1);
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return { text: "Недостаточный вес", color: "bg-blue-100 text-blue-700" };
    if (bmi < 25) return { text: "Нормальный вес", color: "bg-green-100 text-green-700" };
    if (bmi < 30) return { text: "Избыточный вес", color: "bg-yellow-100 text-yellow-700" };
    return { text: "Ожирение", color: "bg-red-100 text-red-700" };
  };

  const bmiStatus = getBMIStatus();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ваш профиль здоровья</h2>
        <Button onClick={onEdit} className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Редактировать
        </Button>
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
              <div className="text-sm text-gray-500">Возраст</div>
              <div className="font-medium">{healthProfile.age} лет</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Пол</div>
              <div className="font-medium">
                {healthProfile.gender === 'male' ? 'Мужской' : 'Женский'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Рост</div>
              <div className="font-medium">{healthProfile.height} см</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Вес</div>
              <div className="font-medium">{healthProfile.weight} кг</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ИМТ:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{calculateBMI()}</span>
                <Badge className={bmiStatus.color}>{bmiStatus.text}</Badge>
              </div>
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
              <div className="text-sm text-gray-500">Физическая активность</div>
              <div className="font-medium">{healthProfile.physicalActivity || 'Не указано'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Частота тренировок</div>
              <div className="font-medium">{healthProfile.exerciseFrequency} раз в неделю</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Уровень физической подготовки</div>
              <div className="font-medium">{healthProfile.fitnessLevel || 'Не указано'}</div>
            </div>
          </div>
          {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">Хронические заболевания</div>
              <div className="flex flex-wrap gap-2">
                {healthProfile.chronicConditions.map((condition, index) => (
                  <Badge key={index} variant="outline">{condition}</Badge>
                ))}
              </div>
            </div>
          )}
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
              <div className="text-sm text-gray-500">Уровень стресса</div>
              <div className="font-medium">{healthProfile.stressLevel}/10</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Уровень тревожности</div>
              <div className="font-medium">{healthProfile.anxietyLevel}/10</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Изменения настроения</div>
              <div className="font-medium">{healthProfile.moodChanges || 'Не указано'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Поддержка</div>
              <div className="font-medium">{healthProfile.mentalHealthSupport || 'Не указано'}</div>
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
              <div className="text-sm text-gray-500">Курение</div>
              <div className="font-medium">{healthProfile.smokingStatus || 'Не указано'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Алкоголь</div>
              <div className="font-medium">{healthProfile.alcoholConsumption || 'Не указано'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Тип питания</div>
              <div className="font-medium">{healthProfile.dietType || 'Не указано'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Потребление воды</div>
              <div className="font-medium">{healthProfile.waterIntake} стаканов/день</div>
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
              <div className="text-sm text-gray-500">Часы сна</div>
              <div className="font-medium">{healthProfile.sleepHours} часов</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Качество сна</div>
              <div className="font-medium">{healthProfile.sleepQuality || 'Не указано'}</div>
            </div>
          </div>
          {healthProfile.sleepIssues && healthProfile.sleepIssues.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">Проблемы со сном</div>
              <div className="flex flex-wrap gap-2">
                {healthProfile.sleepIssues.map((issue, index) => (
                  <Badge key={index} variant="outline">{issue}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthProfileDisplay;
