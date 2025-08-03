
import React from "react";
import Header from "@/components/Header";
import DashboardHealthSummary from "@/components/dashboard/DashboardHealthSummary";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import MobileLayout from "@/components/mobile/MobileLayout";
import MenuCard from "@/components/dashboard/menu/MenuCard";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import SubscriptionStatusCard from "@/components/dashboard/header/SubscriptionStatusCard";
import { Crown, Zap, Shield, Target, Activity, BookOpen, User } from "lucide-react";

const Dashboard = () => {
  const { user } = useSmartAuth();
  const { subscription, isPremiumActive, currentPlan, isLoading } = useSubscription();
  const isMobile = useIsMobile();

  const getSubscriptionIcon = () => {
    if (isPremiumActive) {
      return <Crown className="h-4 w-4" />;
    }
    return <Shield className="h-4 w-4" />;
  };

  const getSubscriptionColor = () => {
    if (isLoading) return "bg-gray-100 text-gray-600 border-gray-200";
    
    if (isPremiumActive) {
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg";
    }
    
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const mobileMenuContent = (
    <div className="space-y-4">
      <MenuCard 
        icon={<Target className="w-6 h-6" />}
        title="Планирование целей"
        description="Постановка и отслеживание целей здоровья"
        href="/dashboard/goals"
      />
      <MenuCard 
        icon={<Activity className="w-6 h-6" />}
        title="Диагностика"
        description="Анализ биомаркеров и показателей"
        href="/dashboard/diagnostics"
      />
      <MenuCard 
        icon={<BookOpen className="w-6 h-6" />}
        title="Обучение"
        description="Курсы и материалы по здоровью"
        href="/dashboard/learning"
      />
      <MenuCard 
        icon={<User className="w-6 h-6" />}
        title="Профиль"
        description="Персональные настройки"
        href="/dashboard/profile"
      />
    </div>
  );

  const dashboardContent = (
    <>
      <SubscriptionStatusCard 
        currentPlan={currentPlan}
        getSubscriptionIcon={getSubscriptionIcon}
        getSubscriptionColor={getSubscriptionColor}
      />
      
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        <DashboardHealthSummary />
        <DashboardQuickActions />
      </div>
    </>
  );

  if (isMobile) {
    return (
      <DashboardWrapper>
        <MobileLayout title="МЕНЮ" subtitle="Выберите раздел для продолжения">
          <div className="p-6 space-y-4">
            {mobileMenuContent}
          </div>
        </MobileLayout>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            {dashboardContent}
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
