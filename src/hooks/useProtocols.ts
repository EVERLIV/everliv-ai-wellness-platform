
import { useState, useEffect } from 'react';

export interface Protocol {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  startDate: string;
  endDate?: string;
}

export const useProtocols = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be a fetch call to your API
        // For now, using mock data
        const mockData: Protocol[] = [
          {
            id: '1',
            name: 'Восстановление здоровья',
            description: 'Комплексный протокол для улучшения общего состояния',
            status: 'active',
            progress: 65,
            startDate: '2025-03-10T00:00:00Z',
            endDate: '2025-06-10T00:00:00Z'
          },
          {
            id: '2',
            name: 'Энергия и фокус',
            description: 'Протокол для повышения энергии и концентрации внимания',
            status: 'active',
            progress: 30,
            startDate: '2025-04-01T00:00:00Z',
            endDate: '2025-07-01T00:00:00Z'
          },
          {
            id: '3',
            name: 'Иммунная поддержка',
            description: 'Укрепление иммунитета и защитных функций организма',
            status: 'pending',
            progress: 0,
            startDate: '2025-05-15T00:00:00Z',
            endDate: '2025-08-15T00:00:00Z'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setProtocols(mockData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    fetchProtocols();
  }, []);

  return { protocols, isLoading, error };
};
