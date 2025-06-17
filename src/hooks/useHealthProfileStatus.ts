
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useHealthProfileStatus = () => {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkHealthProfileStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const checkHealthProfileStatus = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking health profile status:', error);
        setIsComplete(false);
        setCompletionPercentage(0);
        return;
      }

      if (data && data.profile_data) {
        const profile = data.profile_data as any;
        
        // Calculate completion percentage
        const requiredFields = [
          'age', 'gender', 'height', 'weight', 'smokingStatus', 
          'physicalActivity', 'sleepHours', 'stressLevel'
        ];
        
        const optionalFields = [
          'alcoholConsumption', 'exerciseFrequency', 'waterIntake',
          'chronicDiseases', 'familyHistory', 'allergies', 'medications'
        ];
        
        const allFields = [...requiredFields, ...optionalFields];
        const filledFields = allFields.filter(field => {
          const value = profile[field];
          return value !== undefined && value !== null && value !== '' && 
                 (!Array.isArray(value) || value.length > 0);
        });
        
        const percentage = Math.round((filledFields.length / allFields.length) * 100);
        setCompletionPercentage(percentage);
        
        // Consider complete if all required fields are filled
        const hasAllRequired = requiredFields.every(field => {
          const value = profile[field];
          return value !== undefined && value !== null && value !== '';
        });
        
        setIsComplete(hasAllRequired && percentage >= 80);
      } else {
        setIsComplete(false);
        setCompletionPercentage(0);
      }
    } catch (error) {
      console.error('Error checking health profile status:', error);
      setIsComplete(false);
      setCompletionPercentage(0);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isComplete,
    completionPercentage,
    isLoading,
    refreshStatus: checkHealthProfileStatus
  };
};
