
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Heart, Activity, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useProfile } from '@/hooks/useProfile';

interface PersonalizedDashboardHeaderProps {
  userName: string;
}

const PersonalizedDashboardHeader: React.FC<PersonalizedDashboardHeaderProps> = ({ userName }) => {
  const isMobile = useIsMobile();
  const { healthProfile } = useHealthProfile();
  const { profileData } = useProfile();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  // Получаем никнейм из профиля как приоритетный вариант
  const displayName = profileData?.nickname || profileData?.first_name || userName || "Пользователь";

  // Рассчитываем реальные показатели на основе профиля здоровья
  const calculateHealthScore = () => {
    if (!healthProfile) return 50;
    
    let score = 100;
    
    // Физическая активность (0-20 баллов)
    const exerciseFreq = healthProfile.exerciseFrequency || 0;
    if (exerciseFreq >= 4) score += 0;
    else if (exerciseFreq >= 2) score -= 5;
    else score -= 15;
    
    // Сон (0-15 баллов)  
    const sleepHours = healthProfile.sleepHours || 8;
    if (sleepHours >= 7 && sleepHours <= 9) score += 0;
    else score -= 10;
    
    // Стресс (0-15 баллов)
    const stress = healthProfile.stressLevel || 5;
    if (stress <= 3) score += 0;
    else if (stress <= 6) score -= 5;
    else score -= 15;
    
    // Курение и алкоголь (0-20 баллов)
    if (healthProfile.smokingStatus === 'current_heavy') score -= 20;
    else if (healthProfile.smokingStatus === 'current_moderate') score -= 15;
    else if (healthProfile.smokingStatus === 'current_light') score -= 10;
    
    if (healthProfile.alcoholConsumption === 'daily') score -= 10;
    else if (healthProfile.alcoholConsumption === 'regularly') score -= 5;
    
    return Math.max(20, Math.min(100, score));
  };

  const calculateActivityLevel = () => {
    if (!healthProfile) return 5;
    const exerciseFreq = healthProfile.exerciseFrequency || 0;
    return Math.min(10, Math.max(1, Math.round(exerciseFreq * 1.5 + 2)));
  };

  const healthScore = calculateHealthScore();
  const activityLevel = calculateActivityLevel();

  return (
    <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-0 shadow-xl">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex flex-col space-y-4">
          {/* Main greeting */}
          <div className="text-center">
            <h1 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'} mb-2`}>
              {getGreeting()}, {displayName}!
            </h1>
            <p className={`text-blue-100 ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed px-2`}>
              Ваша персональная медицинская панель управления
            </p>
          </div>

          {/* Quick stats */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'} mt-6`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Heart className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-red-300 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mb-1`}>Здоровье</div>
              <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>{healthScore}%</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Activity className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-green-300 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mb-1`}>Активность</div>
              <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>{activityLevel}/10</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Brain className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-purple-300 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mb-1`}>ИИ консультации</div>
              <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>0</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Users className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-orange-300 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mb-1`}>Специалисты</div>
              <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>0</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedDashboardHeader;
