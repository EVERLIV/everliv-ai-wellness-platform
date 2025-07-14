import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { realtimeManager } from '@/services/realtime/RealtimeManager';

/**
 * Оптимизированный хук для realtime подписок
 * Переиспользует каналы между компонентами
 */
export const useOptimizedRealtime = (
  tableName: string,
  events: ('INSERT' | 'UPDATE' | 'DELETE')[],
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !enabled) return;

    const unsubscribeFunctions: (() => void)[] = [];

    // Создаем подписки для каждого события
    events.forEach(event => {
      const unsubscribe = realtimeManager.subscribe(
        `${tableName}_${user.id}`,
        {
          event,
          schema: 'public',
          table: tableName,
          filter: `user_id=eq.${user.id}`
        },
        callback
      );
      
      unsubscribeFunctions.push(unsubscribe);
    });

    return () => {
      unsubscribeFunctions.forEach(unsub => unsub());
    };
  }, [user, tableName, JSON.stringify(events), callback, enabled]);
};

/**
 * Хук для мониторинга статистики realtime каналов
 */
export const useRealtimeStats = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = realtimeManager.getStats();
      console.log('Realtime Stats:', stats);
    }, 30000); // Логируем каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  return realtimeManager.getStats();
};