
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseErrorHandler } from './useSupabaseErrorHandler';

interface HealthProfileData {
  id?: string;
  user_id: string;
  profile_data: any;
  created_at?: string;
  updated_at?: string;
}

export const useSecureHealthProfile = () => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [healthProfile, setHealthProfile] = useState<HealthProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealthProfile = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        handleError(error, 'fetching health profile');
        return;
      }

      setHealthProfile(data);
    } catch (error) {
      handleError(error as Error, 'fetching health profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHealthProfile = async (profileData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .upsert({
          user_id: user.id,
          profile_data: profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        handleError(error, 'updating health profile');
        return;
      }

      setHealthProfile(data);
      return data;
    } catch (error) {
      handleError(error as Error, 'updating health profile');
    }
  };

  useEffect(() => {
    fetchHealthProfile();
  }, [user]);

  return {
    healthProfile,
    isLoading,
    updateHealthProfile,
    refetch: fetchHealthProfile
  };
};
