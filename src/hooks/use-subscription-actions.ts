
import { useCallback } from "react";
import { SubscriptionPlan, FeatureTrial, Subscription } from "@/types/subscription";
import { 
  recordFeatureTrialService, 
  purchaseSubscriptionService,
  cancelSubscriptionService,
  upgradeSubscriptionService
} from "@/services/subscription-service";
import { 
  checkUsageLimit, 
  incrementUsage
} from "@/services/usage-tracking-service";

export const useSubscriptionActions = (
  user: any,
  subscription: Subscription | null,
  featureTrials: FeatureTrial[],
  setFeatureTrials: (trials: FeatureTrial[]) => void,
  setSubscription: (subscription: Subscription) => void,
  hasFeatureTrial: (featureName: string) => boolean
) => {
  const recordFeatureTrial = useCallback(async (featureName: string): Promise<void> => {
    if (!user) return;

    if (hasFeatureTrial(featureName)) {
      return;
    }

    try {
      const newTrial = await recordFeatureTrialService(user.id, featureName);
      setFeatureTrials([...featureTrials, newTrial]);
    } catch (error) {
      console.error("Error recording feature trial:", error);
    }
  }, [user, featureTrials, setFeatureTrials, hasFeatureTrial]);

  const purchaseSubscription = useCallback(async (planType: SubscriptionPlan): Promise<void> => {
    if (!user) return;

    try {
      const newSubscription = await purchaseSubscriptionService(user.id, planType);
      setSubscription(newSubscription);
    } catch (error) {
      console.error("Error purchasing subscription:", error);
    }
  }, [user, setSubscription]);

  const cancelSubscription = useCallback(async (): Promise<void> => {
    if (!subscription) return;

    try {
      await cancelSubscriptionService(subscription.id);
      setSubscription({...subscription, status: 'canceled'});
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  }, [subscription, setSubscription]);

  const upgradeSubscription = useCallback(async (newPlanType: SubscriptionPlan): Promise<void> => {
    if (!subscription || !user) return;

    try {
      const updatedSubscription = await upgradeSubscriptionService(user.id, subscription.id, newPlanType);
      setSubscription(updatedSubscription);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
    }
  }, [subscription, user, setSubscription]);

  const checkFeatureUsage = useCallback(async (featureType: string) => {
    if (!user) {
      return { canUse: false, currentUsage: 0, limit: 0 };
    }

    const planType = subscription?.plan_type || 'basic';
    return await checkUsageLimit(user.id, featureType, planType);
  }, [user, subscription]);

  const incrementFeatureUsage = useCallback(async (featureType: string): Promise<void> => {
    if (!user) return;

    try {
      await incrementUsage(user.id, featureType);
    } catch (error) {
      console.error("Error incrementing feature usage:", error);
      throw error;
    }
  }, [user]);

  return {
    recordFeatureTrial,
    purchaseSubscription,
    cancelSubscription,
    upgradeSubscription,
    checkFeatureUsage,
    incrementFeatureUsage
  };
};
