
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface PersonalizedHealthTip {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'prevention';
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionType?: 'reminder' | 'exercise' | 'meditation' | 'info';
  createdAt: string;
}

export const usePersonalizedHealthTips = () => {
  const { user } = useAuth();
  const [tip, setTip] = useState<PersonalizedHealthTip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateTip = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Generating personalized health tip for user:', user.id);

      const { data, error: functionError } = await supabase.functions.invoke('generate-personalized-health-tips', {
        body: { userId: user.id }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.tip) {
        setTip(data.tip);
        setLastGenerated(new Date());
        console.log('Personalized health tip generated:', data.tip);
      } else {
        console.warn('No tip received from function');
        // Устанавливаем fallback подсказку
        setTip({
          id: 'fallback-' + Date.now(),
          title: '💡 Совет дня',
          description: 'Помните о важности регулярных физических упражнений для здоровья',
          category: 'health',
          priority: 'medium',
          createdAt: new Date().toISOString()
        });
      }

    } catch (err) {
      console.error('Error generating personalized health tip:', err);
      setError(err instanceof Error ? err.message : 'Ошибка генерации персональной подсказки');
      
      // Устанавливаем fallback подсказку при ошибке
      setTip({
        id: 'error-fallback-' + Date.now(),
        title: '🌟 Забота о здоровье',
        description: 'Выпейте стакан воды и сделайте несколько глубоких вдохов',
        category: 'health',
        priority: 'low',
        createdAt: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Автоматическая генерация подсказки при монтировании
  useEffect(() => {
    if (user && !tip) {
      generateTip();
    }
  }, [user]);

  // Проверяем, нужно ли обновить подсказку (если прошло больше 2 часов)
  const shouldRefresh = () => {
    if (!lastGenerated) return true;
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    return lastGenerated < twoHoursAgo;
  };

  return {
    tip,
    isLoading,
    error,
    lastGenerated,
    generateTip,
    shouldRefresh: shouldRefresh()
  };
};
