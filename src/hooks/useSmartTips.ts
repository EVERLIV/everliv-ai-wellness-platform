
import { useState, useEffect } from 'react';
import { useSmartAuth } from './useSmartAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SmartTip {
  id: string;
  title: string;
  description: string;
  category: 'weather' | 'magnetic' | 'health' | 'meditation';
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionType?: 'reminder' | 'exercise' | 'meditation' | 'info';
  createdAt?: string;
}

export const useSmartTips = () => {
  const { user } = useSmartAuth();
  const [tips, setTips] = useState<SmartTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const generateTips = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Generating smart tips for user:', user.id);

      const { data, error: functionError } = await supabase.functions.invoke('smart-tips-ai', {
        body: { userId: user.id }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.tips && Array.isArray(data.tips)) {
        const processedTips = data.tips.map((tip: any) => ({
          ...tip,
          createdAt: new Date().toISOString()
        }));
        
        setTips(processedTips);
        setLastUpdated(new Date());
        console.log('Smart tips generated:', processedTips);
      } else {
        console.warn('No tips received from AI');
        setTips([]);
      }

    } catch (err) {
      console.error('Error generating smart tips:', err);
      setError(err instanceof Error ? err.message : 'Ошибка генерации подсказок');
      
      // Устанавливаем статические подсказки при ошибке
      setTips([
        {
          id: 'static-1',
          title: '🌡️ Проверьте давление',
          description: 'При изменении погоды важно следить за артериальным давлением',
          category: 'weather',
          priority: 'medium',
          action: 'Измерить',
          actionType: 'reminder'
        },
        {
          id: 'static-2',
          title: '🧘‍♀️ Дыхательная практика',
          description: 'Выполните 5-минутную дыхательную гимнастику для снятия стресса',
          category: 'meditation',
          priority: 'low',
          action: 'Начать',
          actionType: 'meditation'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Автоматическая генерация подсказок при монтировании и каждые 30 минут
  useEffect(() => {
    if (user) {
      generateTips();
      
      const interval = setInterval(() => {
        generateTips();
      }, 30 * 60 * 1000); // 30 минут

      return () => clearInterval(interval);
    }
  }, [user]);

  // Проверяем, нужно ли обновить подсказки (если прошло больше часа)
  const shouldRefresh = () => {
    if (!lastUpdated) return true;
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastUpdated < hourAgo;
  };

  return {
    tips,
    isLoading,
    error,
    lastUpdated,
    generateTips,
    shouldRefresh: shouldRefresh()
  };
};
