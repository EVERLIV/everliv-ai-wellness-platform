
import React, { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import Header from "@/components/Header";
import PersonalizedDashboardHeader from "@/components/dashboard/PersonalizedDashboardHeader";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import DashboardHealthCharts from "@/components/dashboard/DashboardHealthCharts";
import PersonalizedHealthTips from "@/components/dashboard/PersonalizedHealthTips";
import MinimalFooter from "@/components/MinimalFooter";
import MyGoalsSection from "@/components/dashboard/health-goals/MyGoalsSection";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { isDevelopmentMode } from "@/utils/devMode";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  FileText,
  Stethoscope,
  BarChart3,
  Utensils,
  Plus,
  ChevronRight
} from "lucide-react";

const Dashboard = () => {
  const { user, isLoading } = useSmartAuth();
  const { healthProfile } = useHealthProfile();
  const { activities } = useActivityFeed();
  const { analytics } = useAnalyticsData();
  const [isLoaded, setIsLoaded] = useState(false);
  const isDevMode = isDevelopmentMode();
  const navigate = useNavigate();

  console.log('🔧 Dashboard: Auth state check', {
    user: user?.email,
    isLoading,
    isDevMode,
    hasUser: !!user
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // В dev режиме не показываем загрузку так долго
  if (!isLoaded || (isLoading && !isDevMode)) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-lg"></div>
            <p className="text-gray-500 font-medium">
              {isDevMode ? 'Инициализация dev режима...' : 'Загрузка панели управления...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // В dev режиме создаем фиктивного пользователя если его нет
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.nickname || "Пользователь";
  const healthScore = analytics?.healthScore || 85;
  const biologicalAge = analytics?.healthScore ? Math.round(35 + (100 - analytics.healthScore) * 0.3) : 42;

  console.log('🔧 Dashboard: Rendering with user:', userName);

  // Детализированные быстрые действия с описаниями
  const quickActions = [
    { 
      icon: <FileText className="h-5 w-5" />, 
      label: "Анализы крови", 
      description: "Загружайте результаты лабораторных исследований и получайте ИИ-анализ ваших биомаркеров",
      action: () => navigate("/lab-analyses"), 
      color: "bg-blue-500",
      badge: "ИИ-анализ",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    { 
      icon: <BarChart3 className="h-5 w-5" />, 
      label: "Аналитика здоровья", 
      description: "Комплексная аналитика всех ваших данных с персональными рекомендациями и прогнозами",
      action: () => navigate("/analytics"), 
      color: "bg-purple-500",
      badge: "Премиум",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    { 
      icon: <Utensils className="h-5 w-5" />, 
      label: "Дневник питания", 
      description: "Отслеживайте потребление калорий, БЖУ и получайте рекомендации по питанию",
      action: () => navigate("/nutrition-diary"), 
      color: "bg-green-500",
      badge: "Pro",
      badgeColor: "bg-green-100 text-green-700"
    },
    { 
      icon: <Stethoscope className="h-5 w-5" />, 
      label: "ИИ-доктор", 
      description: "Персональные консультации с искусственным интеллектом 24/7 по вопросам здоровья",
      action: () => navigate("/ai-doctor"), 
      color: "bg-red-500",
      badge: "ИИ",
      badgeColor: "bg-red-100 text-red-700"
    },
    { 
      icon: <Target className="h-5 w-5" />, 
      label: "Цели здоровья", 
      description: "Устанавливайте и отслеживайте ваши цели по улучшению здоровья",
      action: () => navigate("/health-profile"), 
      color: "bg-orange-500",
      badge: "Основа",
      badgeColor: "bg-orange-100 text-orange-700"
    },
    { 
      icon: <Activity className="h-5 w-5" />, 
      label: "Биологический возраст", 
      description: "Рассчитайте ваш биологический возраст на основе комплексного анализа биомаркеров",
      action: () => navigate("/biological-age"), 
      color: "bg-indigo-500",
      badge: "ИИ-расчет",
      badgeColor: "bg-indigo-100 text-indigo-700"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="pt-16 flex-1">
        <div className="container mx-auto px-3 py-3 max-w-[1400px]">
          {/* Компактная сетка дашборда */}
          <div className="grid grid-cols-12 gap-3 h-full">
            {/* Левая колонка - основная информация */}
            <div className="col-span-12 lg:col-span-8 space-y-3">
              {/* Персонализированный заголовок */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <PersonalizedDashboardHeader userName={userName} />
              </div>
              
              {/* Быстрые действия - детализированные карточки */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Быстрые действия
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer group"
                      onClick={action.action}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                          {action.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">{action.label}</h4>
                            <Badge className={`text-xs px-2 py-0.5 ${action.badgeColor} border-0`}>
                              {action.badge}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Графики здоровья */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Показатели здоровья
                </h3>
                <DashboardHealthCharts />
              </div>
            </div>
            
            {/* Правая колонка - дополнительная информация */}
            <div className="col-span-12 lg:col-span-4 space-y-3">
              {/* Ключевые показатели */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Ключевые показатели
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Общий балл</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">+2.3</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-red-600">{healthScore}</span>
                      <Progress value={healthScore} className="flex-1 h-2" />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Биологический возраст</span>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">-1.2</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-indigo-600">{biologicalAge}</span>
                      <span className="text-sm text-gray-500">лет</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Мои чаты с доктором */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Мои чаты с доктором
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Общие вопросы</span>
                    </div>
                    <span className="text-xs text-gray-500">2 дня назад</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Анализ крови</span>
                    </div>
                    <span className="text-xs text-gray-500">1 неделю назад</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => navigate('/ai-doctor')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Новый чат
                  </Button>
                </div>
              </div>
              
              {/* Мои цели и чекапы */}
              <MyGoalsSection />
            </div>
          </div>
        </div>
      </div>
      
      {/* Персонализированные подсказки по здоровью */}
      <PersonalizedHealthTips />
      
      <MinimalFooter />
    </div>
  );
};

export default Dashboard;
