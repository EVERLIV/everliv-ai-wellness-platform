
import { SubscriptionPlan, FeatureTrial } from "@/types/subscription";
import { PLAN_FEATURES, FEATURES } from "@/constants/subscription-features";

export const useSubscriptionHelpers = (featureTrials: FeatureTrial[]) => {
  /**
   * Check if a user has used a trial for a specific feature
   */
  const hasFeatureTrial = (featureName: string): boolean => {
    return featureTrials.some(trial => trial.feature_name === featureName);
  };

  /**
   * Check if a user can use a specific feature based on their subscription plan
   */
  const canUseFeature = (featureName: string, planType?: SubscriptionPlan): boolean => {
    // If the feature doesn't exist in our constants, default to false
    if (!PLAN_FEATURES[featureName]) {
      console.warn(`Feature "${featureName}" not found in PLAN_FEATURES`);
      return false;
    }
    
    // If user has an active subscription with the required plan, allow access
    if (planType) {
      return PLAN_FEATURES[featureName].includedIn[planType];
    }
    
    // If user doesn't have a subscription, check if they've used their trial
    return !hasFeatureTrial(featureName);
  };

  return {
    hasFeatureTrial,
    canUseFeature
  };
};
