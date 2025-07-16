import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BiologicalAgeResult } from '@/types/biologicalAge';

interface BiomarkerHistoryEntry {
  biomarker_name: string;
  value: number;
  unit: string;
  biomarker_category: string;
}

interface BiologicalAgeSnapshot {
  id: string;
  biological_age: number;
  chronological_age: number;
  age_difference: number;
  accuracy_percentage: number;
  confidence_level: number;
  analysis: string | null;
  recommendations: string[] | null;
  missing_analyses: string[] | null;
  biomarkers_count: number;
  created_at: string;
  biomarker_history?: BiomarkerHistoryEntry[];
}

export const useBiologicalAgeHistory = () => {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState<BiologicalAgeSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSnapshots();
    }
  }, [user]);

  const fetchSnapshots = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Сначала получаем снимки биологического возраста
      const { data: snapshotData, error: snapshotError } = await supabase
        .from('biological_age_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (snapshotError) throw snapshotError;

      // Для каждого снимка получаем связанные биомаркеры
      const snapshotsWithBiomarkers = await Promise.all(
        (snapshotData || []).map(async (snapshot) => {
          const { data: biomarkerData, error: biomarkerError } = await supabase
            .from('biomarker_history')
            .select('biomarker_name, value, unit, biomarker_category')
            .eq('snapshot_id', snapshot.id)
            .order('biomarker_name');

          if (biomarkerError) {
            console.error('Error fetching biomarker history:', biomarkerError);
          }

          // Убираем дубликаты биомаркеров по имени, оставляем только уникальные
          const uniqueBiomarkers = biomarkerData ? 
            biomarkerData.filter((biomarker, index, self) => 
              index === self.findIndex(b => b.biomarker_name === biomarker.biomarker_name)
            ) : [];

          return {
            ...snapshot,
            biomarker_history: uniqueBiomarkers
          };
        })
      );

      setSnapshots(snapshotsWithBiomarkers);
    } catch (err) {
      console.error('Error fetching biological age snapshots:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSnapshot = async (results: BiologicalAgeResult, biomarkersCount: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('biological_age_snapshots')
        .insert({
          user_id: user.id,
          biological_age: results.biological_age,
          chronological_age: results.chronological_age,
          age_difference: results.age_difference,
          accuracy_percentage: results.accuracy_percentage,
          confidence_level: results.confidence_level,
          analysis: results.analysis,
          recommendations: results.recommendations,
          missing_analyses: results.missing_analyses,
          biomarkers_count: biomarkersCount
        })
        .select()
        .single();

      if (error) throw error;

      // Обновляем локальный список
      setSnapshots(prev => [data, ...prev.slice(0, 9)]);
      
      return data;
    } catch (err) {
      console.error('Error saving biological age snapshot:', err);
      throw err;
    }
  };

  return {
    snapshots,
    isLoading,
    error,
    saveSnapshot,
    refreshSnapshots: fetchSnapshots
  };
};