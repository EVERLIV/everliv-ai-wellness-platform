
import { supabase } from "@/integrations/supabase/client";
import { Subscription, SubscriptionPlan, SubscriptionStatus, FeatureTrial } from "@/types/subscription";
import { toast } from "sonner";

export const fetchSubscriptionData = async (userId: string) => {
  try {
    // Fetch current subscription
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (subscriptionError) throw subscriptionError;
    
    // Fetch feature trials
    const { data: trialsData, error: trialsError } = await supabase
      .from('feature_trials')
      .select('*')
      .eq('user_id', userId);
    
    if (trialsError) throw trialsError;
    
    return {
      subscription: subscriptionData as Subscription | null,
      featureTrials: trialsData as FeatureTrial[] || []
    };
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    throw error;
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
