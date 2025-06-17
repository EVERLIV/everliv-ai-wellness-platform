
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { supabase } from "@/integrations/supabase/client";
import { isDevelopmentMode } from "@/utils/devMode";

export const useHealthProfile = () => {
  const { user } = useSmartAuth();
  const [healthProfile, setHealthProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (!user) {
        setHealthProfile(null);
        setIsLoading(false);
        return;
      }

      // In dev mode, return mock health profile
      if (isDevelopmentMode() && user.id === 'dev-admin-12345') {
        console.log('🔧 Dev mode: Using mock health profile');
        const mockProfile = {
          personalInfo: {
            age: 32,
            gender: 'male',
            height: 180,
            weight: 75
          },
          lifestyle: {
            activityLevel: 'moderate',
            sleepHours: 7.5,
            stressLevel: 3
          },
          medicalHistory: {
            chronicConditions: [],
            medications: [],
            allergies: []
          },
          goals: {
            primaryGoals: ['weight_management', 'energy_boost'],
            targetWeight: 73
          }
        };
        setHealthProfile(mockProfile);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('health_profiles')
          .select('profile_data')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching health profile:', error);
          setHealthProfile(null);
          return;
        }

        setHealthProfile(data?.profile_data || null);

      } catch (error) {
        console.error('Error fetching health profile:', error);
        setHealthProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthProfile();
  }, [user]);

  return { healthProfile, isLoading, setHealthProfile };
};
