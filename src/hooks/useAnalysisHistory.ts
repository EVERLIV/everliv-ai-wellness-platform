
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AnalysisResult {
  id: string;
  date: string;
  type: string;
  status: 'normal' | 'warning' | 'critical';
  indicators: {
    name: string;
    value: string;
    unit: string;
    status: 'normal' | 'low' | 'high';
  }[];
}

export const useAnalysisHistory = () => {
  const [history, setHistory] = useState<AnalysisResult[] | null>(null);
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
        const mockHistory: AnalysisResult[] = [
          {
            id: '1',
            date: '10 мая 2024',
            type: 'Общий анализ крови',
            status: 'normal',
            indicators: [
              { name: 'Гемоглобин', value: '145', unit: 'г/л', status: 'normal' },
              { name: 'Эритроциты', value: '4.8', unit: '10^12/л', status: 'normal' },
              { name: 'Лейкоциты', value: '6.2', unit: '10^9/л', status: 'normal' },
              { name: 'Тромбоциты', value: '280', unit: '10^9/л', status: 'normal' },
              { name: 'СОЭ', value: '12', unit: 'мм/ч', status: 'normal' }
            ]
          },
          {
            id: '2',
            date: '2 апреля 2024',
            type: 'Биохимический анализ крови',
            status: 'warning',
            indicators: [
              { name: 'Глюкоза', value: '5.9', unit: 'ммоль/л', status: 'high' },
              { name: 'Холестерин', value: '5.8', unit: 'ммоль/л', status: 'high' },
              { name: 'Креатинин', value: '80', unit: 'мкмоль/л', status: 'normal' },
              { name: 'АЛТ', value: '25', unit: 'Ед/л', status: 'normal' },
              { name: 'АСТ', value: '28', unit: 'Ед/л', status: 'normal' }
            ]
          },
          {
            id: '3',
            date: '15 февраля 2024',
            type: 'Гормональный профиль',
            status: 'critical',
            indicators: [
              { name: 'ТТГ', value: '4.5', unit: 'мМЕ/л', status: 'high' },
              { name: 'Т4 свободный', value: '9.2', unit: 'пмоль/л', status: 'low' },
              { name: 'Кортизол', value: '750', unit: 'нмоль/л', status: 'high' },
              { name: 'Витамин D', value: '15', unit: 'нг/мл', status: 'low' }
            ]
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
