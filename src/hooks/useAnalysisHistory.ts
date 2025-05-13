
import { useState, useEffect } from 'react';
import { AnalysisRecord } from '@/components/dashboard/RecentAnalysisResults';

export { AnalysisRecord };

export const useAnalysisHistory = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be a fetch call to your API
        // For now, using mock data
        const mockData: AnalysisRecord[] = [
          {
            id: '1',
            analysis_type: 'Общий анализ крови',
            created_at: '2025-04-15T10:30:00Z',
            results: {
              status: 'normal',
              indicators: [
                { name: 'Гемоглобин', value: 145, unit: 'г/л', status: 'normal' },
                { name: 'Эритроциты', value: 4.8, unit: '10^12/л', status: 'normal' },
                { name: 'Лейкоциты', value: 6.5, unit: '10^9/л', status: 'normal' },
                { name: 'СОЭ', value: 8, unit: 'мм/ч', status: 'normal' }
              ]
            }
          },
          {
            id: '2',
            analysis_type: 'Биохимический анализ крови',
            created_at: '2025-04-10T14:15:00Z',
            results: {
              status: 'warning',
              indicators: [
                { name: 'Глюкоза', value: 5.8, unit: 'ммоль/л', status: 'high' },
                { name: 'Холестерин', value: 5.9, unit: 'ммоль/л', status: 'high' },
                { name: 'АЛТ', value: 25, unit: 'Ед/л', status: 'normal' },
                { name: 'АСТ', value: 24, unit: 'Ед/л', status: 'normal' }
              ]
            }
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setHistory(mockData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return { history, isLoading, error };
};
