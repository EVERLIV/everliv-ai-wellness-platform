
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
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
  BarChart3
} from "lucide-react";

interface PersonalizedDashboardHeaderProps {
  userName: string;
}

const PersonalizedDashboardHeader: React.FC<PersonalizedDashboardHeaderProps> = ({ userName }) => {
  const navigate = useNavigate();
  const { healthProfile, isLoading: profileLoading } = useHealthProfile();
  const { statistics, isLoading: analysesLoading } = useLabAnalysesData();
  const { analytics, isLoading: analyticsLoading } = useAnalyticsData();

  const isProfileComplete = !profileLoading && healthProfile && Object.keys(healthProfile).length > 5;
  const hasAnalyses = statistics.totalAnalyses > 0;
  
  // Рассчитываем процент заполненности профиля
  const calculateProfileCompleteness = () => {
    if (!healthProfile) return 0;
    const fields = ['age', 'gender', 'height', 'weight', 'physicalActivity', 'sleepHours'];
    const filledFields = fields.filter(field => healthProfile[field] !== undefined && healthProfile[field] !== null);
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const profileCompleteness = calculateProfileCompleteness();
  const biologicalAge = analytics?.healthScore ? Math.round(35 + (100 - analytics.healthScore) * 0.3) : null;
  const healthStatus = analytics?.riskLevel || 'не определен';

  // Определяем цвет статуса здоровья
  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'низкий': return 'text-green-600 bg-green-50 border-green-200';
      case 'средний': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'высокий': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Рендер для пользователей с заполненным профилем
  const renderFilledProfile = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Основная информация пользователя */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Добро пожаловать, {userName}!</h2>
                <p className="text-gray-600">Ваш персональный центр здоровья</p>
              </div>
            </div>
            <Badge className={`px-3 py-1 ${getHealthStatusColor(healthStatus)}`}>
              {healthStatus === 'не определен' ? 'Статус не определен' : `Риск: ${healthStatus}`}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Заполненность профиля</span>
                <span className="text-sm font-medium text-gray-900">{profileCompleteness}%</span>
              </div>
              <Progress value={profileCompleteness} className="h-2" />
            </div>
            
            {biologicalAge && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Биологический возраст</span>
                  <span className="text-lg font-bold text-indigo-600">{biologicalAge} лет</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Activity className="h-3 w-3" />
                  <span>На основе ваших данных</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия */}
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
  );

  // Рендер для новых пользователей
  const renderEmptyProfile = () => (
    <Card className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Начните свой путь к здоровью!</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Заполните профиль здоровья, чтобы получить персональные рекомендации, 
          отслеживать прогресс и улучшать свое самочувствие с помощью ИИ-анализа.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-purple-100">
            <Heart className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Персональный анализ</h3>
            <p className="text-sm text-gray-600">Получите индивидуальные рекомендации</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-purple-100">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Отслеживание прогресса</h3>
            <p className="text-sm text-gray-600">Видите изменения в реальном времени</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-purple-100">
            <Target className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Достижение целей</h3>
            <p className="text-sm text-gray-600">Планы для улучшения здоровья</p>
          </div>
        </div>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={() => navigate('/health-profile')}
        >
          Заполнить профиль здоровья
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  // Прогресс-индикаторы
  const renderProgressIndicators = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <User className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">{profileCompleteness}%</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">Профиль</h4>
          <Progress value={profileCompleteness} className="h-1 mb-2" />
          <p className="text-xs text-gray-600">Данные о здоровье</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span className="text-xs font-medium text-green-800">{statistics.totalAnalyses}</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">Анализы</h4>
          <Progress value={Math.min(statistics.totalAnalyses * 20, 100)} className="h-1 mb-2" />
          <p className="text-xs text-gray-600">Загружено результатов</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span className="text-xs font-medium text-orange-800">0</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">Питание</h4>
          <Progress value={0} className="h-1 mb-2" />
          <p className="text-xs text-gray-600">Дней записей</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-800">0%</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">Рекомендации</h4>
          <Progress value={0} className="h-1 mb-2" />
          <p className="text-xs text-gray-600">Выполнено советов</p>
        </CardContent>
      </Card>
    </div>
  );

  if (profileLoading || analysesLoading || analyticsLoading) {
    return (
      <div className="mb-8">
        <Card className="animate-pulse">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
