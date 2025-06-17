
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { supabase } from "@/integrations/supabase/client";
import { isDevelopmentMode } from "@/utils/devMode";

export const useHealthProfileStatus = () => {
  const { user } = useSmartAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user) {
        setIsComplete(false);
        setCompletionPercentage(0);
        setIsLoading(false);
        return;
      }

      // In dev mode, simulate a complete profile
      if (isDevelopmentMode() && user.id === 'dev-admin-12345') {
        console.log('🔧 Dev mode: Simulating complete health profile');
        setIsComplete(true);
        setCompletionPercentage(95);
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

        if (error) {
          console.error('Error fetching health profile:', error);
          setIsComplete(false);
          setCompletionPercentage(0);
          return;
        }

        if (!data?.profile_data) {
          setIsComplete(false);
          setCompletionPercentage(0);
          return;
        }

        const profileData = data.profile_data as any;
        
        // Calculate completion percentage based on filled fields
        const requiredFields = [
          'personalInfo.age',
          'personalInfo.gender',
          'personalInfo.height',
          'personalInfo.weight',
          'lifestyle.activityLevel',
          'lifestyle.sleepHours',
          'medicalHistory.chronicConditions',
          'medicalHistory.medications',
          'goals.primaryGoals'
        ];

        let filledFields = 0;
        
        requiredFields.forEach(fieldPath => {
          const value = getNestedValue(profileData, fieldPath);
          if (value !== undefined && value !== null && value !== '' && 
              (!Array.isArray(value) || value.length > 0)) {
            filledFields++;
          }
        });

        const percentage = Math.round((filledFields / requiredFields.length) * 100);
        setCompletionPercentage(percentage);
        setIsComplete(percentage >= 90);

      } catch (error) {
        console.error('Error checking profile status:', error);
        setIsComplete(false);
        setCompletionPercentage(0);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, [user]);

  return { isComplete, completionPercentage, isLoading };
};

// Helper function to get nested object values
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};
