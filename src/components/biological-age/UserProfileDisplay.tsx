
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { HealthProfileData } from '@/types/healthProfile';

interface UserProfileDisplayProps {
  healthProfile: HealthProfileData;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({ healthProfile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Данные из профиля здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Возраст:</span> {healthProfile.age} лет
          </div>
          <div>
            <span className="font-medium">Пол:</span> {
              healthProfile.gender === 'male' ? 'Мужской' : 
              healthProfile.gender === 'female' ? 'Женский' : 'Другой'
            }
          </div>
          <div>
            <span className="font-medium">Рост:</span> {healthProfile.height} см
          </div>
          <div>
            <span className="font-medium">Вес:</span> {healthProfile.weight} кг
          </div>
          <div>
            <span className="font-medium">Курение:</span> {
              healthProfile.smokingStatus === 'never' ? 'Не курю' :
              healthProfile.smokingStatus === 'former' ? 'Бросил' : 'Курю'
            }
          </div>
          <div>
            <span className="font-medium">Алкоголь:</span> {
              healthProfile.alcoholConsumption === 'never' ? 'Не употребляю' :
              healthProfile.alcoholConsumption === 'rarely' ? 'Редко' :
              healthProfile.alcoholConsumption === 'occasionally' ? 'Иногда' : 'Регулярно'
            }
          </div>
          <div>
            <span className="font-medium">Сон:</span> {healthProfile.sleepHours} часов
          </div>
          <div>
            <span className="font-medium">Упражнения:</span> {healthProfile.exerciseFrequency} раз/неделю
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileDisplay;
