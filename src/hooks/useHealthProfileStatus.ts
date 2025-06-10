
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useHealthProfileStatus = () => {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkHealthProfileStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const checkHealthProfileStatus = async () => {
    try {
      setIsLoading(true);
      
      // Use type assertion to work around missing table types
      const { data, error } = await (supabase as any)
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking health profile status:', error);
        setIsComplete(false);
        return;
      }

      if (data && data.profile_data) {
        const profile = data.profile_data;
        const requiredFields = ['age', 'gender', 'height', 'weight'];
        const hasAllRequired = requiredFields.every(field => profile[field]);
        setIsComplete(hasAllRequired);
      } else {
        setIsComplete(false);
      }
    } catch (error) {
      console.error('Error checking health profile status:', error);
      setIsComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isComplete,
    isLoading,
    refreshStatus: checkHealthProfileStatus
  };
};
