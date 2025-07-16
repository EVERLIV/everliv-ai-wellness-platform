import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Biomarker } from '@/types/biologicalAge';

interface BiomarkerHistoryEntry {
  id: string;
  biomarker_id: string;
  biomarker_name: string;
  biomarker_category: string;
  value: number;
  unit: string;
  normal_range: any;
  source: string;
  snapshot_id: string | null;
  created_at: string;
}

export const useBiomarkerHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<BiomarkerHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async (biomarkerId?: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('biomarker_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (biomarkerId) {
        query = query.eq('biomarker_id', biomarkerId);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching biomarker history:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveBiomarkerData = async (
    biomarkers: Biomarker[], 
    snapshotId?: string,
    source: string = 'manual_input'
  ) => {
    if (!user) return;

    const filledBiomarkers = biomarkers.filter(b => b.status === 'filled' && b.value !== undefined);
    
    if (filledBiomarkers.length === 0) return;

    try {
      const historyEntries = filledBiomarkers.map(biomarker => ({
        user_id: user.id,
        biomarker_id: biomarker.id,
        biomarker_name: biomarker.name,
        biomarker_category: biomarker.category,
        value: biomarker.value!,
        unit: biomarker.unit,
        normal_range: biomarker.normal_range,
        source: source,
        snapshot_id: snapshotId
      }));

      const { error } = await supabase
        .from('biomarker_history')
        .insert(historyEntries);

      if (error) throw error;

      // Обновляем локальную историю
      await fetchHistory();
    } catch (err) {
      console.error('Error saving biomarker history:', err);
      throw err;
    }
  };

  const getBiomarkerHistory = (biomarkerId: string) => {
    return history.filter(entry => entry.biomarker_id === biomarkerId);
  };

  return {
    history,
    isLoading,
    error,
    saveBiomarkerData,
    getBiomarkerHistory,
    refreshHistory: fetchHistory
  };
};