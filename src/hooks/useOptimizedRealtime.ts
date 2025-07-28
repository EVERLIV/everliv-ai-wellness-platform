import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { optimizedRealtimeManager } from '@/services/realtime/OptimizedRealtimeManager';
import { logger } from '@/services/logger/LoggerService';

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

    logger.debug(`Setting up realtime for ${tableName}`, {
      events,
      userId: user.id
    }, 'useOptimizedRealtime');

    // Создаем единую подписку для всех событий
    const unsubscribe = optimizedRealtimeManager.subscribe(
      tableName,
      user.id,
      events,
      callback
    );

    return unsubscribe;
  }, [user, tableName, JSON.stringify(events), callback, enabled]);
};

/**
 * Хук для мониторинга статистики realtime каналов
 */
export const useRealtimeStats = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = optimizedRealtimeManager.getStats();
      logger.info('Realtime Stats', stats, 'RealtimeStats');
    }, 60000); // Логируем каждую минуту

    return () => clearInterval(interval);
  }, []);

  return optimizedRealtimeManager.getStats();
};