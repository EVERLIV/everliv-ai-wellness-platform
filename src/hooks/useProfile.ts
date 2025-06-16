
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDevAuth } from '@/hooks/useDevAuth';

interface ProfileData {
  id: string;
  nickname: string;
  email: string;
  created_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { getDevUser, isDev } = useDevAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      // В dev режиме используем мок данные
      if (isDev) {
        const devUser = getDevUser();
        if (devUser) {
          setProfileData({
            id: devUser.id,
            nickname: devUser.user_metadata?.nickname || 'Dev User',
            email: devUser.email || 'dev@test.com',
            created_at: devUser.created_at
          });
        }
        setIsLoading(false);
        return;
      }

      // В продакшене используем настоящие данные
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
          } else if (data) {
            setProfileData({
              id: data.id,
              nickname: data.nickname || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              created_at: user.created_at
            });
          } else {
            // Создаем профиль если не существует
            setProfileData({
              id: user.id,
              nickname: user.email?.split('@')[0] || 'User',
              email: user.email || '',
              created_at: user.created_at
            });
          }
        } catch (error) {
          console.error('Error in fetchProfile:', error);
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user, isDev, getDevUser]);

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (isDev) {
      console.log('🔧 Dev mode: Profile update simulated', updates);
      if (profileData) {
        setProfileData({ ...profileData, ...updates });
      }
      return;
    }

    if (user && profileData) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            ...updates
          });

        if (!error) {
          setProfileData({ ...profileData, ...updates });
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return {
    profileData,
    isLoading,
    updateProfile
  };
};
