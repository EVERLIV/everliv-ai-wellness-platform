
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
    // Сохраняем коллбек
    this.analyticsCallbacks.set(userId, onAnalyticsUpdate);

    // Подписываемся на изменения профиля здоровья
    const healthProfileChannel = supabase
      .channel(`health_profile_${userId}`)
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

    // Подписываемся на изменения анализов
    const analysesChannel = supabase
      .channel(`medical_analyses_${userId}`)
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
      supabase.removeChannel(healthProfileChannel);
      this.subscriptions.delete(`health_profile_${userId}`);
    }

    if (analysesChannel) {
      supabase.removeChannel(analysesChannel);
      this.subscriptions.delete(`medical_analyses_${userId}`);
    }

    // Удаляем коллбек
    this.analyticsCallbacks.delete(userId);

    console.log(`Unsubscribed from realtime updates for user ${userId}`);
  }

  cleanup() {
    // Отписываемся от всех каналов
    this.subscriptions.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.subscriptions.clear();
    this.analyticsCallbacks.clear();
  }
}

export const realtimeAnalyticsService = RealtimeAnalyticsService.getInstance();
