import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from '@/components/mobile/MobileLayout';
import MenuCard from '@/components/dashboard/menu/MenuCard';
import { Target, Activity, BookOpen, User } from 'lucide-react';

console.log('🚀 DashboardPage.tsx правильно загружен и рендерится');

const DashboardPage = () => {
  const { user } = useAuth();
  const { profileData } = useProfile();
  const isMobile = useIsMobile();

  console.log('🔧 DashboardPage render:', { 
    isMobile, 
    userAgent: navigator.userAgent, 
    windowWidth: window.innerWidth,
    hasUser: !!user,
    hasProfileData: !!profileData
  });

  const userName = profileData?.nickname || profileData?.first_name || user?.user_metadata?.first_name || user?.user_metadata?.full_name || "Пользователь";

  const menuCards = (
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

  if (isMobile) {
    return (
      <MobileLayout title="МЕНЮ" subtitle="Выберите раздел для продолжения">
        <div className="p-6 space-y-4">
          {menuCards}
        </div>
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Добро пожаловать, {userName}!
            </h1>
            <p className="text-gray-600">Выберите раздел для продолжения</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;