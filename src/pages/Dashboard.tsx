
import React, { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import Header from "@/components/Header";
import PersonalizedDashboardHeader from "@/components/dashboard/PersonalizedDashboardHeader";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import DashboardHealthCharts from "@/components/dashboard/DashboardHealthCharts";
import SmartTips from "@/components/dashboard/SmartTips";
import MinimalFooter from "@/components/MinimalFooter";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { isDevelopmentMode } from "@/utils/devMode";

const Dashboard = () => {
  const { user, isLoading } = useSmartAuth();
  const { healthProfile } = useHealthProfile();
  const { activities } = useActivityFeed();
  const [isLoaded, setIsLoaded] = useState(false);
  const isDevMode = isDevelopmentMode();

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

  console.log('🔧 Dashboard: Rendering with user:', userName);

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
              
              {/* Графики здоровья - компактно в две колонки */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Показатели здоровья
                  </h3>
                  <DashboardHealthCharts />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Быстрые действия
                  </h3>
                  <DashboardQuickActions />
                </div>
              </div>
              
              {/* Умные подсказки - компактно */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Персональные рекомендации
                </h3>
                <SmartTips 
                  healthProfile={healthProfile}
                  recentActivity={activities?.slice(0, 3)}
                  pendingTasks={[]}
                />
              </div>
            </div>
            
            {/* Правая колонка - дополнительная информация */}
            <div className="col-span-12 lg:col-span-4 space-y-3">
              {/* Статистика сегодня */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Сегодня
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">Анализы</span>
                    <span className="text-sm font-medium text-gray-900">3 новых</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">Рекомендации</span>
                    <span className="text-sm font-medium text-gray-900">5 активных</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">Прогресс</span>
                    <span className="text-sm font-medium text-emerald-600">+12%</span>
                  </div>
                </div>
              </div>
              
              {/* Последняя активность */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Последняя активность
                </h3>
                <div className="space-y-2">
                  {activities?.slice(0, 4).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate flex-1">{activity.description}</span>
                      <span className="text-gray-400 ml-2">
                        {new Date(activity.created_at).toLocaleTimeString('ru-RU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  )) || (
                    <div className="text-xs text-gray-500 italic">Нет активности</div>
                  )}
                </div>
              </div>
              
              {/* Быстрые метрики */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Ключевые показатели
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-lg font-bold text-red-600">72</div>
                    <div className="text-xs text-gray-600">ЧСС</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">120/80</div>
                    <div className="text-xs text-gray-600">Давление</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">98.6°</div>
                    <div className="text-xs text-gray-600">Температура</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-lg font-bold text-purple-600">85</div>
                    <div className="text-xs text-gray-600">Общий балл</div>
                  </div>
                </div>
              </div>
              
              {/* Уведомления/Напоминания */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Напоминания
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded text-xs">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span className="flex-1">Добавить анализы крови</span>
                    <span className="text-yellow-600">Сегодня</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-xs">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="flex-1">Обновить профиль здоровья</span>
                    <span className="text-blue-600">Завтра</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded text-xs">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="flex-1">Проверить рекомендации</span>
                    <span className="text-green-600">2 дня</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Dashboard;
