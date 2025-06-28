import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  User, 
  TrendingUp,
  ChevronRight,
  Target,
  Crown,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  Plus
} from "lucide-react";

interface PersonalizedDashboardHeaderProps {
  userName: string;
}

const PersonalizedDashboardHeader: React.FC<PersonalizedDashboardHeaderProps> = ({ userName }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { profileData } = useProfile();
  const { healthProfile, isLoading: profileLoading } = useHealthProfile();
  const { statistics, loadingHistory: analysesLoading } = useLabAnalysesData();
  const { isPremiumActive } = useSubscription();

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

  // Получаем никнейм из профиля как приоритетный вариант
  const displayName = profileData?.nickname || profileData?.first_name || userName || "Пользователь";

  // Перевод целей на русский язык - расширенный список
  const translateGoal = (goal: string): string => {
    const translations: Record<string, string> = {
      'cognitive': 'Улучшение когнитивных функций',
      'cardiovascular': 'Здоровье сердечно-сосудистой системы',
      'weight_loss': 'Снижение веса',
      'muscle_gain': 'Набор мышечной массы',
      'energy_boost': 'Повышение энергии',
      'sleep_improvement': 'Улучшение сна',
      'stress_reduction': 'Снижение стресса',
      'immunity_boost': 'Укрепление иммунитета',
      'longevity': 'Увеличение продолжительности жизни',
      'hormonal_balance': 'Гормональный баланс',
      'digestive_health': 'Здоровье пищеварения',
      'skin_health': 'Здоровье кожи',
      'biological_age': 'Биологический возраст',
      'metabolic_health': 'Метаболическое здоровье',
      'bone_health': 'Здоровье костей',
      'mental_health': 'Психическое здоровье',
      'detox': 'Детоксикация организма',
      'athletic_performance': 'Спортивные результаты'
    };
    return translations[goal] || goal;
  };

  // Мобильная версия с заполненным профилем
  const renderMobileFilledProfile = () => {
    const healthGoals = healthProfile?.healthGoals || [];
    
    return (
      <div className="space-y-2 mobile-compact">
        {/* Компактный заголовок */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center adaptive-gap-sm min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-adaptive-sm font-bold text-gray-900 mobile-text-wrap">
                {getGreeting()}, {displayName}!
              </h2>
              <div className="flex items-center adaptive-gap-sm text-adaptive-xs text-gray-500">
                <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                <span className="mobile-text-wrap">{currentDate}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 rounded text-adaptive-xs flex-shrink-0">
            {isPremiumActive ? 
              <Crown className="h-2.5 w-2.5 text-yellow-500" /> : 
              <CheckCircle className="h-2.5 w-2.5 text-gray-500" />
            }
            <span className="font-medium text-gray-600">
              {isPremiumActive ? 'Pro' : 'Free'}
            </span>
          </div>
        </div>

        {/* Компактные цели */}
        {healthGoals.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-2 border border-purple-100/50">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center adaptive-gap-sm">
                <Target className="h-3 w-3 text-purple-600 flex-shrink-0" />
                <span className="text-adaptive-xs font-semibold text-gray-900">Мои цели</span>
              </div>
              <Button 
                variant="ghost" 
                size="xs"
                onClick={() => navigate('/health-profile')}
                className="text-adaptive-xs text-purple-600 hover:text-purple-700 p-1"
              >
                Изменить
              </Button>
            </div>
            
            <div className="space-y-1">
              {healthGoals.slice(0, 2).map((goal, index) => (
                <div 
                  key={index}
                  className="flex items-center adaptive-gap-sm p-1 bg-white/70 rounded border border-white/50"
                >
                  <div className="w-1 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex-shrink-0"></div>
                  <span className="text-adaptive-xs font-medium text-gray-800 mobile-text-wrap truncate">
                    {translateGoal(goal)}
                  </span>
                </div>
              ))}
              
              {healthGoals.length > 2 && (
                <Button 
                  variant="ghost" 
                  size="xs" 
                  className="w-full text-adaptive-xs text-purple-600 hover:text-purple-700 p-1"
                  onClick={() => navigate('/health-profile')}
                >
                  +{healthGoals.length - 2} еще
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Компактная статистика */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-1.5 rounded border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-adaptive-sm font-bold text-emerald-600">{statistics.totalAnalyses}</div>
                <div className="text-adaptive-xs text-gray-600">Анализы</div>
              </div>
              <FileText className="h-3 w-3 text-emerald-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1.5 rounded border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-adaptive-sm font-bold text-blue-600">Онлайн</div>
                <div className="text-adaptive-xs text-gray-600">Статус</div>
              </div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
            </div>
          </div>
        </div>

        {/* Компактные действия */}
        <div className="grid grid-cols-2 gap-1.5">
          <Button 
            variant="outline" 
            size="xs"
            className="text-adaptive-xs border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => navigate('/lab-analyses')}
          >
            <FileText className="h-2.5 w-2.5 mr-1 flex-shrink-0" />
            <span className="mobile-text-wrap">Анализы</span>
          </Button>
          <Button 
            variant="outline" 
            size="xs" 
            className="text-adaptive-xs border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => navigate('/analytics')}
          >
            <TrendingUp className="h-2.5 w-2.5 mr-1 flex-shrink-0" />
            <span className="mobile-text-wrap">Аналитика</span>
          </Button>
        </div>
      </div>
    );
  };

  // Мобильная версия для новых пользователей
  const renderMobileEmptyProfile = () => (
    <div className="text-center py-3 mobile-compact">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
        <User className="h-4 w-4 text-white" />
      </div>
      <h2 className="text-adaptive-base font-bold text-gray-900 mb-1 mobile-text-wrap">Начните путь к здоровью!</h2>
      <p className="text-adaptive-xs text-gray-600 mb-2 mobile-text-wrap">
        Заполните профиль для персональных рекомендаций
      </p>
      
      <div className="grid grid-cols-3 gap-1 mb-3">
        <div className="text-center p-1.5 bg-purple-50 rounded">
          <Target className="h-3 w-3 text-purple-600 mx-auto mb-0.5" />
          <div className="text-adaptive-xs text-gray-600">Цели</div>
        </div>
        <div className="text-center p-1.5 bg-purple-50 rounded">
          <TrendingUp className="h-3 w-3 text-purple-600 mx-auto mb-0.5" />
          <div className="text-adaptive-xs text-gray-600">Прогресс</div>
        </div>
        <div className="text-center p-1.5 bg-purple-50 rounded">
          <FileText className="h-3 w-3 text-purple-600 mx-auto mb-0.5" />
          <div className="text-adaptive-xs text-gray-600">Анализ</div>
        </div>
      </div>
      
      <Button 
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-adaptive-xs"
        onClick={() => navigate('/health-profile')}
      >
        <span className="mobile-text-wrap">Заполнить профиль</span>
        <ChevronRight className="h-3 w-3 ml-1 flex-shrink-0" />
      </Button>
    </div>
  );

  // Десктоп версия (сокращенная для краткости)
  const renderDesktopVersion = () => {
    if (!isProfileComplete) {
      return renderMobileEmptyProfile();
    }
    
    const healthGoals = healthProfile?.healthGoals || [];
    
    return (
      <div className="space-y-3">
        {/* Приветственный блок */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h2 className="text-base font-bold text-gray-900 truncate">
                  {getGreeting()}, {displayName}!
                </h2>
                <Sparkles className="h-3 w-3 text-yellow-500" />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{currentDate} • {currentTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
            {isPremiumActive ? 
              <Crown className="h-3 w-3 text-yellow-500" /> : 
              <CheckCircle className="h-3 w-3 text-gray-500" />
            }
            <span className="text-xs font-medium text-gray-600">
              {isPremiumActive ? 'Premium' : 'Basic'}
            </span>
          </div>
        </div>

        {/* Мои цели - главный фокус */}
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl p-3 border border-purple-100/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="h-3 w-3 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Мои цели</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/health-profile')}
              className="text-xs px-2 py-1 h-5 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
            >
              Изменить
            </Button>
          </div>
          
          {healthGoals.length === 0 ? (
            <div className="text-center py-3">
              <div className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Установите цели для персонализированных рекомендаций
              </p>
              <Button 
                size="sm"
                onClick={() => navigate('/health-profile')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs px-3 py-1 h-6"
              >
                <Plus className="h-3 w-3 mr-1" />
                Добавить цели
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-1">
                {healthGoals.slice(0, 3).map((goal, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 bg-white/70 rounded-lg border border-white/50 backdrop-blur-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex-shrink-0"></div>
                    <span className="text-xs font-medium text-gray-800 truncate">
                      {translateGoal(goal)}
                    </span>
                  </div>
                ))}
              </div>
              
              {healthGoals.length > 3 && (
                <div className="pt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs h-5 text-purple-600 hover:text-purple-700 hover:bg-white/50"
                    onClick={() => navigate('/health-profile')}
                  >
                    Показать все ({healthGoals.length})
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Краткая статистика */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-2 rounded-lg border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-emerald-600">{statistics.totalAnalyses}</div>
                <div className="text-xs text-gray-600">Анализы</div>
              </div>
              <FileText className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-xs text-emerald-600 mt-1">загружено</div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-blue-600">Активен</div>
                <div className="text-xs text-gray-600">Статус</div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-xs text-blue-600 mt-1">онлайн</div>
          </div>
        </div>

        {/* Компактные быстрые действия */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-xs h-7 border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => navigate('/lab-analyses')}
          >
            <FileText className="h-3 w-3 mr-1" />
            Добавить анализы
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs h-7 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => navigate('/analytics')}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Анализ и рекомендации
          </Button>
        </div>
      </div>
    );
  };

  if (profileLoading || analysesLoading) {
    return (
      <div className={`animate-pulse space-y-2 ${isMobile ? 'mobile-compact' : ''}`}>
        <div className="flex items-center gap-2">
          <div className={`${isMobile ? 'w-6 h-6' : 'w-10 h-10'} bg-gray-200 rounded-xl`}></div>
          <div className="space-y-1 flex-1">
            <div className={`${isMobile ? 'h-2' : 'h-3'} bg-gray-200 rounded w-3/4`}></div>
            <div className={`${isMobile ? 'h-1.5' : 'h-2'} bg-gray-200 rounded w-1/2`}></div>
          </div>
        </div>
        <div className={`${isMobile ? 'h-12' : 'h-16'} bg-gray-200 rounded-xl`}></div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map(i => (
            <div key={i} className={`${isMobile ? 'h-8' : 'h-12'} bg-gray-200 rounded-lg`}></div>
          ))}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return isProfileComplete ? renderMobileFilledProfile() : renderMobileEmptyProfile();
  }

  return renderDesktopVersion();
};

export default PersonalizedDashboardHeader;
