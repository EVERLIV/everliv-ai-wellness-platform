
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  
  console.log('🔧 SimpleWelcomeCard: Display name logic:', {
    profileNickname: profileData?.nickname,
    profileFirstName: profileData?.first_name,
    passedUserName: userName,
    finalDisplayName: displayName,
    hasProfileData: !!profileData,
    fullProfileData: profileData
  });

  return (
    <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="text-center">
          <h1 className="font-bold text-white text-2xl lg:text-3xl mb-2">
            {getGreeting()}, {displayName}!
          </h1>
          <p className="text-blue-100 text-base leading-relaxed px-2">
            Добро пожаловать в вашу персональную медицинскую панель управления
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleWelcomeCard;
