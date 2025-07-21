import { supabase } from '@/integrations/supabase/client';
import { Subscription, SubscriptionPlan, FeatureTrial } from '@/types/subscription';
import { toast } from 'sonner';

export const fetchSubscriptionData = async (userId: string) => {
  console.log('📊 [FETCH SERVICE] Fetching subscription data for user:', userId);
  
  try {
    // Fetch subscription with detailed logging
    console.log('🔍 [FETCH SERVICE] Querying subscriptions table...');
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (subscriptionError) {
      console.error('❌ [FETCH SERVICE] Subscription query error:', subscriptionError);
      throw subscriptionError;
    }

    console.log('📋 [FETCH SERVICE] Raw subscription data:', subscription);

    // Fetch feature trials
    console.log('🔍 [FETCH SERVICE] Querying feature trials...');
    const { data: featureTrials, error: trialsError } = await supabase
      .from('feature_trials')
      .select('*')
      .eq('user_id', userId);

    if (trialsError) {
      console.error('❌ [FETCH SERVICE] Feature trials query error:', trialsError);
      throw trialsError;
    }

    console.log('📋 [FETCH SERVICE] Feature trials data:', featureTrials);

    const result = {
      subscription,
      featureTrials: featureTrials || []
    };

    console.log('✅ [FETCH SERVICE] Final subscription data result:', result);
    return result;
  } catch (error) {
    console.error('❌ [FETCH SERVICE] Error in fetchSubscriptionData:', error);
    throw error;
  }
};

export const recordFeatureTrialService = async (userId: string, featureName: string): Promise<FeatureTrial> => {
  const { data, error } = await supabase
    .from('feature_trials')
    .insert({
      user_id: userId,
      feature_name: featureName,
      used_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording feature trial:', error);
    throw error;
  }

  return data;
};

export const purchaseSubscriptionService = async (userId: string, planType: SubscriptionPlan): Promise<Subscription> => {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: planType,
      status: 'active',
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error purchasing subscription:', error);
    throw error;
  }

  return data;
};

export const cancelSubscriptionService = async (subscriptionId: string): Promise<void> => {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('id', subscriptionId);

  if (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const upgradeSubscriptionService = async (userId: string, subscriptionId: string, newPlanType: SubscriptionPlan): Promise<Subscription> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      plan_type: newPlanType,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error upgrading subscription:', error);
    throw error;
  }

  return data;
};

export const checkTrialStatusService = async (userId: string) => {
  // For now, return no trial
  return {
    isActive: false,
    expiresAt: null
  };
};
