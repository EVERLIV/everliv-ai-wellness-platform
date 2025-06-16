
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SmartAuthContext";
import Header from "@/components/Header";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import DashboardActivityFeed from "@/components/dashboard/DashboardActivityFeed";
import DashboardHealthSummary from "@/components/dashboard/DashboardHealthSummary";
import MinimalFooter from "@/components/MinimalFooter";

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Загрузка панели управления...</p>
          </div>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || "Пользователь";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16">
        <DashboardHeader userName={userName} />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
          {/* Quick Actions Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Основные функции</h2>
              <p className="text-sm text-gray-500">Выберите действие для начала работы</p>
            </div>
            <DashboardQuickActions />
          </div>
          
          {/* Activity and Health Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DashboardActivityFeed />
            <DashboardHealthSummary />
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Dashboard;
