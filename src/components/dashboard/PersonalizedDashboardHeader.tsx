
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  User, 
  Heart, 
  TrendingUp,
  ChevronRight,
  Target,
  Crown,
  CheckCircle,
  FileText,
  Calendar
} from "lucide-react";

// Import the new components
import WelcomeCard from "./header/WelcomeCard";
import SubscriptionStatusCard from "./header/SubscriptionStatusCard";
import HealthScoreCard from "./header/HealthScoreCard";
import BiologicalAgeCard from "./header/BiologicalAgeCard";
import QuickActionsCard from "./header/QuickActionsCard";
import DisclaimerCard from "./header/DisclaimerCard";

interface PersonalizedDashboardHeaderProps {
  userName: string;
}

const PersonalizedDashboardHeader: React.FC<PersonalizedDashboardHeaderProps> = ({ userName }) => {
  const navigate = useNavigate();
  const { healthProfile, isLoading: profileLoading } = useHealthProfile();
  const { statistics, loadingHistory: analysesLoading } = useLabAnalysesData();
  const { analytics, isLoading: analyticsLoading } = useAnalyticsData();
  const { currentPlan, isPremiumActive } = useSubscription();

  const isProfileComplete = !profileLoading && healthProfile && Object.keys(healthProfile).length > 5;
  
  // Helper functions
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Доброй ночи";
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  const currentTime = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const biologicalAge = analytics?.healthScore ? Math.round(35 + (100 - analytics.healthScore) * 0.3) : null;
  const healthStatus = analytics?.riskLevel || 'не определен';
  const healthScore = analytics?.healthScore || null;

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'низкий': return 'text-green-600 bg-green-50 border-green-200';
      case 'средний': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'высокий': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSubscriptionIcon = () => {
    if (isPremiumActive) return <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />;
    return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;
  };

  const getSubscriptionColor = () => {
    if (isPremiumActive) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Render for users with filled profile
  const renderFilledProfile = () => (
    <div className="space-y-6 mb-8">
      <WelcomeCard
        userName={userName}
        healthStatus={healthStatus}
        getGreeting={getGreeting}
        currentDate={currentDate}
        currentTime={currentTime}
        getHealthStatusColor={getHealthStatusColor}
      />
      
      <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
        <SubscriptionStatusCard
          currentPlan={currentPlan}
          getSubscriptionIcon={getSubscriptionIcon}
          getSubscriptionColor={getSubscriptionColor}
        />
      </div>

      {healthScore && (
        <HealthScoreCard
          healthScore={healthScore}
          getHealthScoreColor={getHealthScoreColor}
        />
      )}
      
      {biologicalAge && (
        <BiologicalAgeCard biologicalAge={biologicalAge} />
      )}
      
      <DisclaimerCard />

      {/* Mobile quick actions */}
      <div className="sm:hidden">
        <QuickActionsCard isMobile={true} />
      </div>

      {/* Desktop quick actions */}
      <div className="hidden sm:block">
        <QuickActionsCard isMobile={false} />
      </div>
    </div>
  );

  // Render for new users
  const renderEmptyProfile = () => (
    <Card className="mb-6 sm:mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
      <CardContent className="p-6 sm:p-8 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Начните свой путь к здоровью!</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
          Заполните профиль здоровья, чтобы получить персональные рекомендации, 
          отслеживать прогресс и улучшать свое самочувствие с помощью ИИ-анализа.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg border border-purple-100">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Персональный анализ</h3>
            <p className="text-xs sm:text-sm text-gray-600">Получите индивидуальные рекомендации</p>
          </div>
          <div className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg border border-purple-100">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Отслеживание прогресса</h3>
            <p className="text-xs sm:text-sm text-gray-600">Видите изменения в реальном времени</p>
          </div>
          <div className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg border border-purple-100">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Достижение целей</h3>
            <p className="text-xs sm:text-sm text-gray-600">Планы для улучшения здоровья</p>
          </div>
        </div>
        
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto"
          onClick={() => navigate('/health-profile')}
        >
          Заполнить профиль здоровья
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  // Progress indicators
  const renderProgressIndicators = () => (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-emerald-50/80 to-green-100/50 border-0 shadow-lg shadow-emerald-100/30 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {statistics.totalAnalyses}
            </span>
          </div>
          <h4 className="font-bold text-gray-900 text-sm mb-2">Анализы загружены</h4>
          <Progress 
            value={Math.min(statistics.totalAnalyses * 20, 100)} 
            className="h-2 mb-3 bg-emerald-100/50" 
          />
          <p className="text-xs text-gray-600">Результатов в системе</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50/80 to-amber-100/50 border-0 shadow-lg shadow-orange-100/30 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              0
            </span>
          </div>
          <h4 className="font-bold text-gray-900 text-sm mb-2">Питание</h4>
          <Progress value={0} className="h-2 mb-3 bg-orange-100/50" />
          <p className="text-xs text-gray-600">Дней записей</p>
        </CardContent>
      </Card>
    </div>
  );

  if (profileLoading || analysesLoading || analyticsLoading) {
    return (
      <div className="mb-6 sm:mb-8">
        <Card className="animate-pulse">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {isProfileComplete ? renderFilledProfile() : renderEmptyProfile()}
      {renderProgressIndicators()}
    </div>
  );
};

export default PersonalizedDashboardHeader;
