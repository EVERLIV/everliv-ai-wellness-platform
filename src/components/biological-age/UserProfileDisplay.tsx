
import React from 'react';
import { User } from 'lucide-react';
import { HealthProfileData } from '@/types/healthProfile';

interface UserProfileDisplayProps {
  healthProfile: HealthProfileData;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({ healthProfile }) => {
  return (
    <div className="border border-gray-200 bg-white">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <User className="h-3 w-3" />
          Данные из профиля здоровья
        </h3>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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
      </div>
    </div>
  );
};

export default UserProfileDisplay;
