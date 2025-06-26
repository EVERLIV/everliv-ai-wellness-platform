
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseErrorHandler } from './useSupabaseErrorHandler';

export const useSecureSubscription = () => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        handleError(error, 'fetching subscription');
        return;
      }

      setSubscription(data);
    } catch (error) {
      handleError(error as Error, 'fetching subscription');
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        handleError(error, 'fetching subscription plans');
        return;
      }

      setSubscriptionPlans(data || []);
    } catch (error) {
      handleError(error as Error, 'fetching subscription plans');
    }
  };

  const canUseFeature = (featureName: string) => {
    if (!subscription) return false;
    
    const limits = subscription.limits || {};
    return limits[featureName] !== undefined && limits[featureName] > 0;
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSubscription(),
        fetchSubscriptionPlans()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [user]);

  return {
    subscription,
    subscriptionPlans,
    isLoading,
    canUseFeature,
    refetch: fetchSubscription
  };
};
