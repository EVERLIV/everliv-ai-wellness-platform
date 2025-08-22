import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import DashboardDesignExample from '@/components/dashboard/DashboardDesignExample';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardPage = () => {
  const { user } = useAuth();
  const { profileData } = useProfile();
  const isMobile = useIsMobile();

  // ИСПРАВЛЕННАЯ логика: приоритет никнейму из профиля
  const userName = profileData?.nickname || profileData?.first_name || user?.user_metadata?.first_name || user?.user_metadata?.full_name || "Пользователь";

  return (
    <AppLayout>
      <DashboardDesignExample />
    </AppLayout>
  );
};

export default DashboardPage;