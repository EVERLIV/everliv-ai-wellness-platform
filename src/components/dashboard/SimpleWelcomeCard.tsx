
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';

interface SimpleWelcomeCardProps {
  userName: string;
}

const SimpleWelcomeCard: React.FC<SimpleWelcomeCardProps> = ({ userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  console.log('🔧 SimpleWelcomeCard: Received userName:', userName);

  // Используем имя пользователя, переданное из Dashboard (уже с правильной приоритетностью)
  const displayName = userName;

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
