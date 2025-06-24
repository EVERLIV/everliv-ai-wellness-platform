
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

const Dashboard = () => {
  const { user } = useSmartAuth();
  const { healthProfile } = useHealthProfile();
  const { activities } = useActivityFeed();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-lg"></div>
            <p className="text-gray-500 font-medium">Загрузка панели управления...</p>
          </div>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || "Пользователь";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl space-y-8">
          {/* Персонализированный заголовок с улучшенным дизайном */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 to-indigo-100/40 rounded-3xl blur-xl"></div>
            <div className="relative">
              <PersonalizedDashboardHeader userName={userName} />
            </div>
          </div>
          
          {/* Умские подсказки с новым дизайном */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-100/20 p-6">
            <SmartTips 
              healthProfile={healthProfile}
              recentActivity={activities?.slice(0, 5)}
              pendingTasks={[]}
            />
          </div>
          
          {/* Интерактивные графики здоровья */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Визуализация данных о здоровье
                </h2>
                <p className="text-sm text-gray-500">Отслеживайте ключевые показатели в реальном времени</p>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-400 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Данные обновлены</span>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-100/10 overflow-hidden">
              <div className="p-6">
                <DashboardHealthCharts />
              </div>
            </div>
          </div>
          
          {/* Основные функции с улучшенным дизайном */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Быстрые действия
                </h2>
                <p className="text-sm text-gray-500">Управляйте своим здоровьем одним кликом</p>
              </div>
              <div className="hidden sm:block text-xs text-gray-400 bg-emerald-50/50 px-3 py-1.5 rounded-full border border-emerald-200/50">
                Персонализировано для вас
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-emerald-100/10 overflow-hidden">
              <div className="p-6">
                <DashboardQuickActions />
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
