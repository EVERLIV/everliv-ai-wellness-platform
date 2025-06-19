
import { supabase } from "@/integrations/supabase/client";
import { Subscription, SubscriptionPlan, SubscriptionStatus, FeatureTrial } from "@/types/subscription";
import { toast } from "sonner";

export const fetchSubscriptionData = async (userId: string) => {
  try {
    console.log('🔍 Fetching subscription data for user:', userId);
    
    // Fetch current subscription - получаем ВСЕ подписки и сортируем по дате
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (subscriptionError) {
      console.error('❌ Error fetching subscription:', subscriptionError);
      throw subscriptionError;
    }
    
    console.log('📋 All subscriptions found:', subscriptionData);
    
    // Находим самую актуальную активную подписку
    let activeSubscription = null;
    if (subscriptionData && subscriptionData.length > 0) {
      const now = new Date();
      
      // Сначала ищем активные подписки, которые еще не истекли
      activeSubscription = subscriptionData.find(sub => {
        const isActive = sub.status === 'active';
        const notExpired = new Date(sub.expires_at) > now;
        console.log(`🔍 Subscription ${sub.id}: status=${sub.status}, expires=${sub.expires_at}, isActive=${isActive}, notExpired=${notExpired}`);
        return isActive && notExpired;
      });
      
      // Если не нашли активную, берем последнюю по дате создания
      if (!activeSubscription) {
        activeSubscription = subscriptionData[0];
        console.log('⚠️ No active subscription found, using latest:', activeSubscription);
      } else {
        console.log('✅ Active subscription found:', activeSubscription);
      }
    }
    
    // Fetch feature trials
    const { data: trialsData, error: trialsError } = await supabase
      .from('feature_trials')
      .select('*')
      .eq('user_id', userId);
    
    if (trialsError) {
      console.error('❌ Error fetching trials:', trialsError);
    }
    
    console.log('🎯 Final subscription result:', {
      subscription: activeSubscription,
      trialsCount: trialsData?.length || 0
    });
    
    return {
      subscription: activeSubscription as Subscription | null,
      featureTrials: trialsData as FeatureTrial[] || []
    };
  } catch (error) {
    console.error("❌ Error fetching subscription data:", error);
    throw error;
  }
};

export const checkTrialStatusService = async (userId: string) => {
  try {
    console.log('🔍 Checking trial status for user:', userId);
    
    // Fetch user profile to check registration date
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .maybeSingle();
    
    if (userError) {
      console.error("❌ Error fetching user profile:", userError);
      return { isActive: false, expiresAt: null };
    }
    
    if (!userData) {
      console.log("⚠️ No user profile found, trial not active");
      return { isActive: false, expiresAt: null };
    }
    
    const createdAt = new Date(userData.created_at);
    const now = new Date();
    
    // Calculate trial expiration (24 hours after registration)
    const trialExpiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    
    // Check if trial is still active
    const isActive = trialExpiresAt > now;
    
    console.log('🎯 Trial status result:', {
      isActive,
      expiresAt: trialExpiresAt.toISOString(),
      createdAt: createdAt.toISOString(),
      hoursLeft: Math.max(0, (trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60))
    });
    
    return { 
      isActive,
      expiresAt: trialExpiresAt.toISOString()
    };
  } catch (error) {
    console.error("❌ Error checking trial status:", error);
    return { isActive: false, expiresAt: null };
  }
};

export const recordFeatureTrialService = async (userId: string, featureName: string): Promise<FeatureTrial> => {
  try {
    const newTrial = {
      user_id: userId,
      feature_name: featureName,
    };

    const { data, error } = await supabase
      .from('feature_trials')
      .insert(newTrial)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as FeatureTrial;
  } catch (error) {
    console.error("Error recording feature trial:", error);
    throw error;
  }
};

export const purchaseSubscriptionService = async (userId: string, planType: SubscriptionPlan): Promise<Subscription> => {
  try {
    // Calculate expiration date (1 month from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    
    const newSubscription = {
      user_id: userId,
      plan_type: planType,
      status: 'active' as SubscriptionStatus,
      expires_at: expiresAt.toISOString(),
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .insert(newSubscription)
      .select()
      .single();

    if (error) throw error;
    
    toast.success(`Подписка ${planType} успешно оформлена!`);
    return data as Subscription;
  } catch (error) {
    console.error("Error purchasing subscription:", error);
    toast.error("Не удалось оформить подписку");
    throw error;
  }
};

export const cancelSubscriptionService = async (subscriptionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' as SubscriptionStatus })
      .eq('id', subscriptionId);

    if (error) throw error;
    
    toast.success("Подписка отменена");
  } catch (error) {
    console.error("Error canceling subscription:", error);
    toast.error("Не удалось отменить подписку");
    throw error;
  }
};

export const upgradeSubscriptionService = async (
  userId: string, 
  currentSubscriptionId: string, 
  newPlanType: SubscriptionPlan
): Promise<Subscription> => {
  try {
    // Cancel current subscription
    const { error: cancelError } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' as SubscriptionStatus })
      .eq('id', currentSubscriptionId);

    if (cancelError) throw cancelError;

    // Create new subscription
    const newSubscription = await purchaseSubscriptionService(userId, newPlanType);
    toast.success(`Подписка обновлена до ${newPlanType}`);
    
    return newSubscription;
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    toast.error("Не удалось обновить подписку");
    throw error;
  }
};
