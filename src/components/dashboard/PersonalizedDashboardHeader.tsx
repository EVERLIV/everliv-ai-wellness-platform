import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  User, 
  Activity, 
  FileText, 
  TrendingUp, 
  Heart, 
  Zap,
  ChevronRight,
  Calendar,
  Target,
  BarChart3,
  Clock,
  Crown,
  CheckCircle
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
  const hasAnalyses = statistics.totalAnalyses > 0;
  
  // Функция для определения времени суток и соответствующего приветствия
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

  // Определяем цвет статуса здоровья
  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'низкий': return 'text-green-600 bg-green-50 border-green-200';
      case 'средний': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'высокий': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Определяем цвет балла здоровья
  const getHealthScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Получаем иконку подписки
  const getSubscriptionIcon = () => {
    if (isPremiumActive) return <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />;
    return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;
  };

  // Цвет подписки
  const getSubscriptionColor = () => {
    if (isPremiumActive) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Рендер для пользователей с заполненным профилем
  const renderFilledProfile = () => (
    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
      {/* Главная карточка приветствия - мобильно адаптированная */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-4 sm:p-6">
          {/* Верхняя часть - информация о времени и приветствие */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {getGreeting()}, {userName}!
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{currentDate} • {currentTime}</span>
                </div>
              </div>
            </div>
            <Badge className={`px-2 py-1 text-xs sm:text-sm flex-shrink-0 ${getHealthStatusColor(healthStatus)}`}>
              {healthStatus === 'не определен' ? 'Статус не определен' : `Риск: ${healthStatus}`}
            </Badge>
          </div>
          
          {/* Подписка статус */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm sm:text-base text-gray-600">
              Ваш персональный центр здоровья
            </p>
            <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full border flex-shrink-0 ${getSubscriptionColor()}`}>
              {getSubscriptionIcon()}
              <span>{currentPlan}</span>
            </div>
          </div>

          {/* Общий балл здоровья - новый блок */}
          {healthScore && (
            <div className="mb-4 p-3 sm:p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex-shrink-0">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-1">
                      Общий балл здоровья
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
                        {healthScore.toFixed(1)}
                      </span>
                      <span className="text-lg sm:text-xl text-gray-400 font-medium">/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs sm:text-sm bg-white hover:bg-blue-50 border-blue-200"
                    onClick={() => navigate('/analytics')}
                  >
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Подробнее
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <Progress 
                  value={Math.min(100, Math.max(0, healthScore))} 
                  className="h-2"
                />
              </div>
            </div>
          )}
          
          {/* Биологический возраст - адаптированный для мобильных */}
          {biologicalAge && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Биологический возраст</span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600">{biologicalAge} лет</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Activity className="h-3 w-3" />
                <span>На основе ваших данных</span>
              </div>
            </div>
          )}
          
          {/* Дисклеймер - адаптированный */}
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-center sm:text-left">
              Сервис находится в альфа-разработке, спасибо за поддержку! 
              <a 
                href="/contact" 
                className="text-primary hover:underline font-medium ml-1"
              >
                Рассказать о баге
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия - отдельная карточка для мобильных */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 sm:hidden">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" />
            Быстрые действия
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white hover:bg-green-50 text-xs"
              onClick={() => navigate('/lab-analyses')}
            >
              <FileText className="h-3 w-3 mr-1" />
              Анализы
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white hover:bg-green-50 text-xs"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Аналитика
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия для десктопа */}
      <div className="hidden sm:block">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Быстрые действия
            </h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start bg-white hover:bg-green-50"
                onClick={() => navigate('/lab-analyses')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Добавить анализы
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start bg-white hover:bg-green-50"
                onClick={() => navigate('/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Посмотреть аналитику
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Рендер для новых пользователей
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
        
        {/* Преимущества - адаптированные для мобильных */}
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

  // Прогресс-индикаторы - убираем заполненность профиля
  const renderProgressIndicators = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="text-base sm:text-lg font-bold text-green-800">{statistics.totalAnalyses}</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Анализы</h4>
          <Progress value={Math.min(statistics.totalAnalyses * 20, 100)} className="h-1 mb-2" />
          <p className="text-xs text-gray-600">Загружено результатов</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            <span className="text-base sm:text-lg font-bold text-orange-800">0</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Питание</h4>
          <Progress value={0} className="h-1 mb-2" />
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
