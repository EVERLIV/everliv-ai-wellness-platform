
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Heart, Activity, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PersonalizedDashboardHeaderProps {
  userName: string;
}

const PersonalizedDashboardHeader: React.FC<PersonalizedDashboardHeaderProps> = ({ userName }) => {
  const isMobile = useIsMobile();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-0 shadow-xl">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex flex-col space-y-4">
          {/* Main greeting */}
          <div className="text-center">
            <h1 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'} mb-2`}>
              {getGreeting()}, {userName}!
            </h1>
            <p className={`text-blue-100 ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed px-2`}>
              Добро пожаловать в вашу персональную медицинскую панель управления
            </p>
          </div>

          {/* Quick stats */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'} mt-6`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Heart className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-red-300 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mb-1`}>Здоровье</div>
              <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>85%</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Activity className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-green-300 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mb-1`}>Активность</div>
              <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>7/10</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Brain className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-purple-300 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mb-1`}>ИИ чаты</div>
              <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>12</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Users className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-orange-300 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mb-1`}>Эксперты</div>
              <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>3</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedDashboardHeader;
