
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useAnalysesStatus = () => {
  const { user } = useAuth();
  const [hasAnalyses, setHasAnalyses] = useState(false);

  useEffect(() => {
    if (user) {
      checkHasAnalyses();
    }
  }, [user]);

  const checkHasAnalyses = async () => {
    if (!user) return;
    
    try {
      const { count } = await supabase
        .from('medical_analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      setHasAnalyses((count || 0) > 0);
    } catch (error) {
      console.error('Error checking analyses:', error);
    }
  };

  return {
    hasAnalyses,
    refreshAnalysesStatus: checkHasAnalyses
  };
};
