
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface AnalysisRecord {
  id: string;
  created_at: string;
  analysis_type: string;
  results?: {
    status: 'normal' | 'warning' | 'critical';
    indicators: {
      name: string;
      value: string;
      unit: string;
      status: 'normal' | 'low' | 'high';
    }[];
  };
}

export const useAnalysisHistory = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalysisHistory = async () => {
      if (!user) {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Mock data for demo purposes
        // In a real application, this would be fetched from Supabase
        const mockHistory: AnalysisRecord[] = [
          {
            id: '1',
            created_at: '2024-05-10T10:00:00',
            analysis_type: 'Общий анализ крови',
            results: {
              status: 'normal',
              indicators: [
                { name: 'Гемоглобин', value: '145', unit: 'г/л', status: 'normal' },
                { name: 'Эритроциты', value: '4.8', unit: '10^12/л', status: 'normal' },
                { name: 'Лейкоциты', value: '6.2', unit: '10^9/л', status: 'normal' },
                { name: 'Тромбоциты', value: '280', unit: '10^9/л', status: 'normal' },
                { name: 'СОЭ', value: '12', unit: 'мм/ч', status: 'normal' }
              ]
            }
          },
          {
            id: '2',
            created_at: '2024-04-02T14:30:00',
            analysis_type: 'Биохимический анализ крови',
            results: {
              status: 'warning',
              indicators: [
                { name: 'Глюкоза', value: '5.9', unit: 'ммоль/л', status: 'high' },
                { name: 'Холестерин', value: '5.8', unit: 'ммоль/л', status: 'high' },
                { name: 'Креатинин', value: '80', unit: 'мкмоль/л', status: 'normal' },
                { name: 'АЛТ', value: '25', unit: 'Ед/л', status: 'normal' },
                { name: 'АСТ', value: '28', unit: 'Ед/л', status: 'normal' }
              ]
            }
          },
          {
            id: '3',
            created_at: '2024-02-15T09:15:00',
            analysis_type: 'Гормональный профиль',
            results: {
              status: 'critical',
              indicators: [
                { name: 'ТТГ', value: '4.5', unit: 'мМЕ/л', status: 'high' },
                { name: 'Т4 свободный', value: '9.2', unit: 'пмоль/л', status: 'low' },
                { name: 'Кортизол', value: '750', unit: 'нмоль/л', status: 'high' },
                { name: 'Витамин D', value: '15', unit: 'нг/мл', status: 'low' }
              ]
            }
          }
        ];

        setHistory(mockHistory);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching analysis history:', error);
        setError('Не удалось загрузить историю анализов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisHistory();
  }, [user]);

  return {
    history,
    isLoading,
    error
  };
};
