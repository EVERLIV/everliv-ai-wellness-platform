import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logger/LoggerService';

interface RealtimeSubscription {
  channelName: string;
  callbacks: Set<(data: any) => void>;
  lastUpdate: number;
  debounceTimeout?: NodeJS.Timeout;
}

class OptimizedRealtimeManager {
  private static instance: OptimizedRealtimeManager;
  private subscriptions = new Map<string, RealtimeSubscription>();
  private channels = new Map<string, any>();
  private debounceDelay = 300; // 300ms debounce

  static getInstance(): OptimizedRealtimeManager {
    if (!OptimizedRealtimeManager.instance) {
      OptimizedRealtimeManager.instance = new OptimizedRealtimeManager();
    }
    return OptimizedRealtimeManager.instance;
  }

  subscribe(
    tableName: string,
    userId: string,
    events: ('INSERT' | 'UPDATE' | 'DELETE')[],
    callback: (payload: any) => void
  ) {
    const channelKey = `${tableName}_${userId}`;
    
    // Создаем или получаем существующую подписку
    if (!this.subscriptions.has(channelKey)) {
      this.subscriptions.set(channelKey, {
        channelName: channelKey,
        callbacks: new Set(),
        lastUpdate: 0
      });
      
      // Создаем единый канал для всех событий этой таблицы
      this.createChannel(channelKey, tableName, userId, events);
    }

    const subscription = this.subscriptions.get(channelKey)!;
    subscription.callbacks.add(callback);

    logger.debug(`Subscribed to ${channelKey}`, {
      callbacksCount: subscription.callbacks.size
    }, 'OptimizedRealtime');

    // Возвращаем функцию отписки
    return () => this.unsubscribe(channelKey, callback);
  }

  private createChannel(
    channelKey: string,
    tableName: string,
    userId: string,
    events: ('INSERT' | 'UPDATE' | 'DELETE')[]
  ) {
    const channel = supabase.channel(channelKey);

    // Добавляем все события в один канал
    events.forEach(event => {
      channel.on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table: tableName,
          filter: `user_id=eq.${userId}`
        },
        (payload) => this.handleRealtimeEvent(channelKey, payload)
      );
    });

    channel.subscribe((status) => {
      logger.info(`Channel ${channelKey} status: ${status}`, {}, 'OptimizedRealtime');
    });

    this.channels.set(channelKey, channel);
  }

  private handleRealtimeEvent(channelKey: string, payload: any) {
    const subscription = this.subscriptions.get(channelKey);
    if (!subscription) return;

    const now = Date.now();
    
    // Debounce частые обновления
    if (subscription.debounceTimeout) {
      clearTimeout(subscription.debounceTimeout);
    }

    subscription.debounceTimeout = setTimeout(() => {
      subscription.callbacks.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          logger.error('Realtime callback error', error, 'OptimizedRealtime');
        }
      });
      
      subscription.lastUpdate = now;
    }, this.debounceDelay);
  }

  private unsubscribe(channelKey: string, callback: (data: any) => void) {
    const subscription = this.subscriptions.get(channelKey);
    if (!subscription) return;

    subscription.callbacks.delete(callback);

    // Если больше нет колбэков, удаляем канал
    if (subscription.callbacks.size === 0) {
      const channel = this.channels.get(channelKey);
      if (channel) {
        supabase.removeChannel(channel);
        this.channels.delete(channelKey);
        this.subscriptions.delete(channelKey);
        
        logger.info(`Removed unused channel: ${channelKey}`, {}, 'OptimizedRealtime');
      }
    }
  }

  getStats() {
    return {
      activeChannels: this.channels.size,
      totalSubscriptions: this.subscriptions.size,
      totalCallbacks: Array.from(this.subscriptions.values())
        .reduce((sum, sub) => sum + sub.callbacks.size, 0)
    };
  }

  cleanup() {
    // Очищаем все таймауты
    this.subscriptions.forEach(sub => {
      if (sub.debounceTimeout) {
        clearTimeout(sub.debounceTimeout);
      }
    });

    // Удаляем все каналы
    this.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });

    this.channels.clear();
    this.subscriptions.clear();
    
    logger.info('All realtime channels cleaned up', {}, 'OptimizedRealtime');
  }
}

export const optimizedRealtimeManager = OptimizedRealtimeManager.getInstance();

// Добавляем глобальный доступ для debugging
if (typeof window !== 'undefined') {
  (window as any).optimizedRealtimeManager = optimizedRealtimeManager;
}