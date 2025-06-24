
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
  Calendar,
  Activity,
  Clock,
  Sparkles
} from "lucide-react";

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
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const biologicalAge = analytics?.healthScore ? Math.round(35 + (100 - analytics.healthScore) * 0.3) : null;
  const healthStatus = analytics?.riskLevel || 'не определен';
  const healthScore = analytics?.healthScore || 85; // Демо значение

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'низкий': return 'text-green-600 bg-green-50';
      case 'средний': return 'text-yellow-600 bg-yellow-50';
      case 'высокий': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Render for users with filled profile
  const renderFilledProfile = () => (
    <div className="space-y-3">
      {/* Компактный приветственный блок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                {getGreeting()}, {userName}!
              </h2>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{currentDate} • {currentTime}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(healthStatus)}`}>
          {healthStatus === 'не определен' ? 'Анализируем' : `Риск: ${healthStatus}`}
        </div>
      </div>

      {/* Компактные ключевые метрики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-red-600">{healthScore}</div>
              <div className="text-xs text-gray-600">Общий балл</div>
            </div>
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <Progress value={healthScore} className="h-1.5 mt-2" />
        </div>

        {biologicalAge && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-indigo-600">{biologicalAge}</div>
                <div className="text-xs text-gray-600">Био возраст</div>
              </div>
              <Activity className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-xs text-indigo-600 mt-1">лет</div>
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-emerald-600">{statistics.totalAnalyses}</div>
              <div className="text-xs text-gray-600">Анализы</div>
            </div>
            <FileText className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-xs text-emerald-600 mt-1">загружено</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-purple-600">{isPremiumActive ? 'Premium' : 'Basic'}</div>
              <div className="text-xs text-gray-600">План</div>
            </div>
            {isPremiumActive ? 
              <Crown className="h-5 w-5 text-yellow-500" /> : 
              <CheckCircle className="h-5 w-5 text-gray-500" />
            }
          </div>
          <div className="text-xs text-purple-600 mt-1">активен</div>
        </div>
      </div>

      {/* Компактные быстрые действия */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-xs h-8"
          onClick={() => navigate('/lab-analyses')}
        >
          <FileText className="h-3 w-3 mr-1" />
          Добавить анализы
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs h-8"
          onClick={() => navigate('/analytics')}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Аналитика
        </Button>
      </div>
    </div>
  );

  // Render for new users
  const renderEmptyProfile = () => (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Начните свой путь к здоровью!</h2>
      <p className="text-sm text-gray-600 mb-4">
        Заполните профиль здоровья для персональных рекомендаций
      </p>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Heart className="h-6 w-6 text-purple-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Анализ</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Прогресс</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Target className="h-6 w-6 text-purple-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Цели</div>
        </div>
      </div>
      
      <Button 
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        onClick={() => navigate('/health-profile')}
      >
        Заполнить профиль здоровья
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );

  if (profileLoading || analysesLoading || analyticsLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return isProfileComplete ? renderFilledProfile() : renderEmptyProfile();
};

export default PersonalizedDashboardHeader;
