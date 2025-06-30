
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Activity, Users, MessageSquare } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface SimpleWelcomeCardProps {
  userName: string;
}

const SimpleWelcomeCard: React.FC<SimpleWelcomeCardProps> = ({ userName }) => {
  const { profileData } = useProfile();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  // Получаем никнейм из профиля как приоритетный вариант
  const displayName = profileData?.nickname || profileData?.first_name || userName || "Пользователь";

  return (
    <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Main greeting */}
          <div className="text-center">
            <h1 className="font-bold text-white text-2xl lg:text-3xl mb-2">
              {getGreeting()}, {displayName}!
            </h1>
            <p className="text-blue-100 text-base leading-relaxed px-2">
              Добро пожаловать в вашу персональную медицинскую панель управления
            </p>
          </div>

          {/* Static stats without real data */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Heart className="h-6 w-6 text-red-300 mx-auto mb-2" />
              <div className="text-sm text-blue-100 mb-1">Здоровье</div>
              <div className="text-lg font-semibold text-white">80%</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Activity className="h-6 w-6 text-green-300 mx-auto mb-2" />
              <div className="text-sm text-blue-100 mb-1">Активность</div>
              <div className="text-lg font-semibold text-white">8/10</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <MessageSquare className="h-6 w-6 text-purple-300 mx-auto mb-2" />
              <div className="text-sm text-blue-100 mb-1">ИИ консультации</div>
              <div className="text-lg font-semibold text-white">0</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Users className="h-6 w-6 text-orange-300 mx-auto mb-2" />
              <div className="text-sm text-blue-100 mb-1">Специалисты</div>
              <div className="text-lg font-semibold text-white">0</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleWelcomeCard;
