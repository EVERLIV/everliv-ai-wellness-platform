
import React from 'react';
import { useSmartAuth } from "@/hooks/useSmartAuth";
import MobileBottomNavigation from '@/components/mobile/MobileBottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useSmartAuth();

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Основной контент без отступов сверху */}
      <main className="w-full min-h-screen pb-20">
        <div className="px-2 py-2 min-h-screen">
          {children}
        </div>
      </main>
      
      {/* Нижняя навигация только для авторизованных */}
      {user && <MobileBottomNavigation />}
    </div>
  );
}
