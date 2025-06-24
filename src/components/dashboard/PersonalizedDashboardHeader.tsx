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
  CheckCircle,
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
    <div className="space-y-6 mb-8">
      {/* Главная приветственная карточка - обновленный дизайн */}
      <Card className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 border-0 shadow-2xl shadow-blue-100/20 backdrop-blur-sm">
        <CardContent className="p-6 sm:p-8">
          {/* Верхняя часть с улучшенным дизайном */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-blue-200/50 flex-shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {getGreeting()}, {userName}!
                  </h2>
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{currentDate} • {currentTime}</span>
                </div>
              </div>
            </div>
            <Badge className={`px-4 py-2 text-sm font-medium rounded-full border-0 shadow-lg flex-shrink-0 ${getHealthStatusColor(healthStatus)}`}>
              {healthStatus === 'не определен' ? 'Анализируем данные' : `Риск: ${healthStatus}`}
            </Badge>
          </div>
          
          {/* Статус подписки с улучшенным дизайном */}
          <div className="flex items-center justify-between mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  Персональный центр здоровья
                </p>
                <p className="text-sm text-gray-600">Управляйте здоровьем с ИИ</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border shadow-sm flex-shrink-0 ${getSubscriptionColor()}`}>
              {getSubscriptionIcon()}
              <span className="font-medium">{currentPlan}</span>
            </div>
          </div>

          {/* Общий балл здоровья с новым дизайном */}
          {healthScore && (
            <div className="mb-6 p-6 bg-gradient-to-r from-white/80 to-blue-50/50 rounded-2xl border border-white/50 shadow-lg backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 via-pink-500 to-red-600 rounded-2xl shadow-lg shadow-red-200/40">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-red-400 flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-red-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Общий балл здоровья
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
                        {healthScore.toFixed(1)}
                      </span>
                      <span className="text-xl text-gray-400 font-semibold">/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-700 font-medium shadow-sm"
                    onClick={() => navigate('/analytics')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Детальный анализ
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={Math.min(100, Math.max(0, healthScore))} 
                  className="h-3 bg-gray-200/50"
                />
              </div>
            </div>
          )}
          
          {/* Биологический возраст с обновленным дизайном */}
          {biologicalAge && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 rounded-xl border border-indigo-200/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Биологический возраст</span>
                    <p className="text-xs text-gray-500">Рассчитан на основе ваших данных</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {biologicalAge}
                  </span>
                  <span className="text-lg text-gray-600 ml-1">лет</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Дисклеймер с обновленным дизайном */}
          <div className="text-xs text-gray-500 bg-gradient-to-r from-gray-50/80 to-blue-50/30 rounded-xl px-4 py-3 border border-gray-200/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">β</span>
              </div>
              <p className="text-center sm:text-left">
                Сервис находится в альфа-разработке, спасибо за поддержку! 
                <a 
                  href="/contact" 
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium ml-1 transition-colors"
                >
                  Сообщить о проблеме
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия для мобильных с новым дизайном */}
      <Card className="bg-gradient-to-br from-emerald-50/80 to-green-50/30 border-0 shadow-xl shadow-emerald-100/20 sm:hidden backdrop-blur-sm">
        <CardContent className="p-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            Быстрые действия
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-700 shadow-sm"
              onClick={() => navigate('/lab-analyses')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Анализы
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-700 shadow-sm"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Аналитика
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия для десктопа с обновленным дизайном */}
      <div className="hidden sm:block">
        <Card className="bg-gradient-to-br from-emerald-50/80 to-green-50/30 border-0 shadow-xl shadow-emerald-100/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">Быстрые действия</span>
            </h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-700 shadow-sm group"
                onClick={() => navigate('/lab-analyses')}
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-3" />
                  Добавить анализы
                </div>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-700 shadow-sm group"
                onClick={() => navigate('/analytics')}
              >
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Посмотреть аналитику
                </div>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
