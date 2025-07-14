import { supabase } from '@/integrations/supabase/client';

interface RealtimeManager {
  channels: Map<string, any>;
  subscribers: Map<string, Set<(data: any) => void>>;
}

class RealtimeChannelManager {
  private static instance: RealtimeChannelManager;
  private manager: RealtimeManager = {
    channels: new Map(),
    subscribers: new Map(),
  };

  static getInstance(): RealtimeChannelManager {
    if (!RealtimeChannelManager.instance) {
      RealtimeChannelManager.instance = new RealtimeChannelManager();
    }
    return RealtimeChannelManager.instance;
  }

  /**
   * Подписка на канал с автоматическим переиспользованием
   */
  subscribe(
    channelName: string,
    config: {
      event: string;
      schema: string;
      table: string;
      filter?: string;
    },
    callback: (data: any) => void
  ) {
    const key = `${channelName}_${config.table}_${config.event}`;
    
    // Добавляем callback к подписчикам
    if (!this.manager.subscribers.has(key)) {
      this.manager.subscribers.set(key, new Set());
    }
    this.manager.subscribers.get(key)!.add(callback);

    // Создаем канал только если его еще нет
    if (!this.manager.channels.has(key)) {
      const channel = supabase
        .channel(key)
        .on(
          'postgres_changes',
          config,
          (payload) => {
            // Уведомляем всех подписчиков
            const subscribers = this.manager.subscribers.get(key);
            if (subscribers) {
              subscribers.forEach(cb => cb(payload));
            }
          }
        )
        .subscribe();

      this.manager.channels.set(key, channel);
      console.log(`Created reusable realtime channel: ${key}`);
    }

    // Возвращаем функцию отписки
    return () => {
      this.unsubscribe(key, callback);
    };
  }

  /**
   * Отписка от канала
   */
  private unsubscribe(key: string, callback: (data: any) => void) {
    const subscribers = this.manager.subscribers.get(key);
    if (subscribers) {
      subscribers.delete(callback);
      
      // Если больше нет подписчиков, удаляем канал
      if (subscribers.size === 0) {
        const channel = this.manager.channels.get(key);
        if (channel) {
          supabase.removeChannel(channel);
          this.manager.channels.delete(key);
          this.manager.subscribers.delete(key);
          console.log(`Removed unused realtime channel: ${key}`);
        }
      }
    }
  }

  /**
   * Получение статистики активных каналов
   */
  getStats() {
    return {
      activeChannels: this.manager.channels.size,
      totalSubscribers: Array.from(this.manager.subscribers.values())
        .reduce((sum, subs) => sum + subs.size, 0),
      channels: Array.from(this.manager.channels.keys()),
    };
  }

  /**
   * Принудительная очистка всех каналов (для debugging)
   */
  cleanup() {
    this.manager.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.manager.channels.clear();
    this.manager.subscribers.clear();
    console.log('All realtime channels cleaned up');
  }
}

export const realtimeManager = RealtimeChannelManager.getInstance();

// Добавляем глобальный доступ для debugging
if (typeof window !== 'undefined') {
  (window as any).realtimeManager = realtimeManager;
}