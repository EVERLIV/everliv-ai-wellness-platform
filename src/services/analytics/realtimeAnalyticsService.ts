import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CachedAnalytics } from "@/types/analytics";
import { generateRealTimeAnalyticsService } from "./enhancedAnalyticsService";
import { prepareHealthProfileForAnalysis } from "@/utils/healthProfileUtils";
import { withRetry, isRetryableError } from "@/utils/retryUtils";

export class RealtimeAnalyticsService {
  private static instance: RealtimeAnalyticsService;
  private subscriptions: Map<string, any> = new Map();
  private analyticsCallbacks: Map<string, (analytics: CachedAnalytics) => void> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;

  static getInstance(): RealtimeAnalyticsService {
    if (!RealtimeAnalyticsService.instance) {
      RealtimeAnalyticsService.instance = new RealtimeAnalyticsService();
    }
    return RealtimeAnalyticsService.instance;
  }

  subscribeToUserChanges(userId: string, onAnalyticsUpdate: (analytics: CachedAnalytics) => void) {
    // Проверяем, есть ли уже подписка для этого пользователя
    if (this.subscriptions.has(`health_profile_${userId}`) || this.subscriptions.has(`medical_analyses_${userId}`)) {
      console.log(`Already subscribed to user ${userId}, skipping...`);
      return;
    }

    // Сохраняем коллбек
    this.analyticsCallbacks.set(userId, onAnalyticsUpdate);

    this.setupSubscriptionWithRetry(userId);
  }

  private async setupSubscriptionWithRetry(userId: string): Promise<void> {
    const attempts = this.reconnectAttempts.get(userId) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts reached for user ${userId}`);
      toast.error('Не удается установить соединение для обновлений в реальном времени');
      return;
    }

    try {
      await withRetry(
        () => this.setupSubscriptions(userId),
        {
          maxAttempts: 3,
          baseDelay: 1000,
          retryCondition: isRetryableError
        }
      );
      
      // Сбрасываем счетчик попыток при успешном подключении
      this.reconnectAttempts.set(userId, 0);
    } catch (error) {
      console.error('Failed to setup subscriptions:', error);
      this.reconnectAttempts.set(userId, attempts + 1);
      
      // Повторная попытка через увеличивающийся интервал
      const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
      setTimeout(() => {
        this.setupSubscriptionWithRetry(userId);
      }, delay);
    }
  }

  private setupSubscriptions(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Подписываемся на изменения профиля здоровья
        const healthProfileChannel = supabase
          .channel(`analytics_health_profile_${userId}_${Date.now()}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'health_profiles',
              filter: `user_id=eq.${userId}`
            },
            () => {
              console.log('Health profile changed, updating analytics...');
              this.updateAnalyticsWithRetry(userId);
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'daily_health_metrics',
              filter: `user_id=eq.${userId}`
            },
            () => {
              console.log('Daily health metrics changed, updating analytics...');
              this.updateAnalyticsWithRetry(userId);
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log(`Health profile subscription active for user ${userId}`);
              resolve();
            } else if (status === 'CLOSED') {
              console.log(`Health profile subscription closed for user ${userId}`);
              // Попытка переподключения
              setTimeout(() => this.setupSubscriptionWithRetry(userId), 5000);
            } else if (status === 'CHANNEL_ERROR') {
              reject(new Error('Failed to subscribe to health profile changes'));
            }
          });

        // Подписываемся на изменения анализов
        const analysesChannel = supabase
          .channel(`analytics_medical_analyses_${userId}_${Date.now()}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'medical_analyses',
              filter: `user_id=eq.${userId}`
            },
            () => {
              console.log('Medical analysis changed, updating analytics...');
              this.updateAnalyticsWithRetry(userId);
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'user_analytics',
              filter: `user_id=eq.${userId}`
            },
            () => {
              console.log('User analytics changed...');
              // Небольшая задержка чтобы избежать циклических обновлений
              setTimeout(() => this.updateAnalyticsWithRetry(userId), 1000);
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log(`Medical analyses subscription active for user ${userId}`);
            } else if (status === 'CLOSED') {
              console.log(`Medical analyses subscription closed for user ${userId}`);
              // Попытка переподключения
              setTimeout(() => this.setupSubscriptionWithRetry(userId), 5000);
            }
          });

        // Сохраняем подписки
        this.subscriptions.set(`health_profile_${userId}`, healthProfileChannel);
        this.subscriptions.set(`medical_analyses_${userId}`, analysesChannel);

        console.log(`Subscribed to realtime updates for user ${userId}`);
      } catch (error) {
        console.error('Error setting up realtime subscriptions:', error);
        reject(error);
      }
    });
  }

  private async updateAnalyticsWithRetry(userId: string) {
    try {
      await withRetry(
        () => this.updateAnalytics(userId),
        {
          maxAttempts: 3,
          baseDelay: 1000,
          retryCondition: isRetryableError
        }
      );
    } catch (error) {
      console.error('Failed to update analytics after retries:', error);
    }
  }

  private async updateAnalytics(userId: string) {
    try {
      const callback = this.analyticsCallbacks.get(userId);
      if (!callback) return;

      // Проверяем наличие профиля здоровья
      const { data: healthProfile } = await supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', userId)
        .maybeSingle();

      if (!healthProfile?.profile_data) {
        console.log('No health profile found, skipping analytics update');
        return;
      }

      // Обрабатываем профиль здоровья
      const processedProfile = prepareHealthProfileForAnalysis(healthProfile.profile_data);

      // Генерируем аналитику
      const success = await generateRealTimeAnalyticsService(
        userId,
        true,
        callback
      );

      if (success) {
        console.log('Analytics updated successfully');
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
      throw error;
    }
  }

  unsubscribeFromUserChanges(userId: string) {
    // Отписываемся от каналов
    const healthProfileChannel = this.subscriptions.get(`health_profile_${userId}`);
    const analysesChannel = this.subscriptions.get(`medical_analyses_${userId}`);

    if (healthProfileChannel) {
      try {
        supabase.removeChannel(healthProfileChannel);
        this.subscriptions.delete(`health_profile_${userId}`);
      } catch (error) {
        console.error('Error removing health profile channel:', error);
      }
    }

    if (analysesChannel) {
      try {
        supabase.removeChannel(analysesChannel);
        this.subscriptions.delete(`medical_analyses_${userId}`);
      } catch (error) {
        console.error('Error removing analyses channel:', error);
      }
    }

    // Удаляем коллбек и счетчик попыток
    this.analyticsCallbacks.delete(userId);
    this.reconnectAttempts.delete(userId);

    console.log(`Unsubscribed from realtime updates for user ${userId}`);
  }

  cleanup() {
    // Отписываемся от всех каналов
    this.subscriptions.forEach((channel, key) => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.error(`Error removing channel ${key}:`, error);
      }
    });
    this.subscriptions.clear();
    this.analyticsCallbacks.clear();
    this.reconnectAttempts.clear();
  }
}

export const realtimeAnalyticsService = RealtimeAnalyticsService.getInstance();
