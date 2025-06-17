
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CachedAnalytics } from "@/types/analytics";
import { generateRealTimeAnalyticsService } from "./enhancedAnalyticsService";
import { prepareHealthProfileForAnalysis } from "@/utils/healthProfileUtils";

export class RealtimeAnalyticsService {
  private static instance: RealtimeAnalyticsService;
  private subscriptions: Map<string, any> = new Map();
  private analyticsCallbacks: Map<string, (analytics: CachedAnalytics) => void> = new Map();

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

    try {
      // Подписываемся на изменения профиля здоровья с уникальным именем канала
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
            this.updateAnalytics(userId);
          }
        )
        .subscribe();

      // Подписываемся на изменения анализов с уникальным именем канала
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
            this.updateAnalytics(userId);
          }
        )
        .subscribe();

      // Сохраняем подписки
      this.subscriptions.set(`health_profile_${userId}`, healthProfileChannel);
      this.subscriptions.set(`medical_analyses_${userId}`, analysesChannel);

      console.log(`Subscribed to realtime updates for user ${userId}`);
    } catch (error) {
      console.error('Error setting up realtime subscriptions:', error);
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

    // Удаляем коллбек
    this.analyticsCallbacks.delete(userId);

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
  }
}

export const realtimeAnalyticsService = RealtimeAnalyticsService.getInstance();
