
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDevAuth } from '@/hooks/useDevAuth';

interface AnalysisHistoryItem {
  id: string;
  type: string;
  created_at: string;
  status: string;
  results?: any;
}

export const useAnalysisHistory = () => {
  const { user } = useAuth();
  const { getDevUserId, isDev } = useDevAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      
      // В dev режиме используем мок данные
      if (isDev) {
        const mockHistory: AnalysisHistoryItem[] = [
          {
            id: 'dev-analysis-1',
            type: 'Анализ крови',
            created_at: new Date().toISOString(),
            status: 'completed',
            results: { summary: 'Отличные показатели здоровья!' }
          },
          {
            id: 'dev-analysis-2',
            type: 'Комплексный анализ',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed',
            results: { summary: 'Рекомендуется увеличить физическую активность.' }
          }
        ];
        setHistory(mockHistory);
        setIsLoading(false);
        return;
      }

      // В продакшене используем настоящие данные
      if (user) {
        try {
          const { data, error } = await supabase
            .from('lab_analyses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching history:', error);
          } else {
            setHistory(data || []);
          }
        } catch (error) {
          console.error('Error in fetchHistory:', error);
        }
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [user, isDev]);

  return {
    history,
    isLoading
  };
};
