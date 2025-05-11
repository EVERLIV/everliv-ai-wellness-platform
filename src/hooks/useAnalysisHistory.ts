
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface AnalysisRecord {
  id: string;
  created_at: string;
  analysis_type: string;
  results: any;
}

export const useAnalysisHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // For now we'll simulate analysis history since we don't have a dedicated table for it
  // This would normally fetch from a real table in Supabase
  const fetchHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch feature trials for blood analysis as a proxy for analysis history
      const { data, error } = await supabase
        .from('feature_trials')
        .select('*')
        .eq('user_id', user.id)
        .eq('feature_name', 'blood_analysis')
        .order('used_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching analysis history:", error);
        return;
      }
      
      // Transform to our expected format
      const analysisHistory = data.map(record => ({
        id: record.id,
        created_at: record.used_at,
        analysis_type: 'Анализ крови',
        results: { status: 'Завершен' }
      }));
      
      setHistory(analysisHistory);
    } catch (error) {
      console.error("Unexpected error fetching analysis history:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [user]);
  
  return {
    history,
    isLoading,
    fetchHistory
  };
};
