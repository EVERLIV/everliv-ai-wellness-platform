
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDevAuth } from '@/hooks/useDevAuth';

export interface ProfileData {
  id: string;
  nickname?: string;
  email: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  medical_conditions?: string[];
  allergies?: string[];
  medications?: string[];
  goals?: string[];
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
            created_at: devUser.created_at,
            first_name: 'Иван',
            last_name: 'Иванов',
            date_of_birth: '1990-01-01',
            gender: 'male',
            height: 180,
            weight: 75
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
              created_at: user.created_at,
              first_name: data.first_name,
              last_name: data.last_name,
              date_of_birth: data.date_of_birth,
              gender: data.gender,
              height: data.height,
              weight: data.weight,
              medical_conditions: data.medical_conditions,
              allergies: data.allergies,
              medications: data.medications,
              goals: data.goals
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

  const updateProfile = async (updates: Partial<Omit<ProfileData, 'id'>>): Promise<boolean> => {
    if (isDev) {
      console.log('🔧 Dev mode: Profile update simulated', updates);
      if (profileData) {
        setProfileData({ ...profileData, ...updates });
      }
      return true;
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
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating profile:', error);
        return false;
      }
    }
    return false;
  };

  return {
    profileData,
    isLoading,
    updateProfile
  };
};
