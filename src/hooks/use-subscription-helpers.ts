
import { PLAN_FEATURES } from "@/constants/subscription-features";
import { FeatureTrial } from "@/types/subscription";

export function useSubscriptionHelpers(featureTrials: FeatureTrial[]) {
  const hasFeatureTrial = (featureName: string): boolean => {
    return featureTrials.some(trial => trial.feature_name === featureName);
  };

  const canUseFeature = (featureName: string, planType?: string): boolean => {
    // If user has an active subscription that includes this feature
    if (planType) {
      const feature = PLAN_FEATURES[featureName];
      if (feature) {
        return feature.includedIn[planType as 'basic' | 'standard' | 'premium'];
      }
    }
    
    // Or if they've never used their free trial for this feature
    return !hasFeatureTrial(featureName);
  };

  return {
    hasFeatureTrial,
    canUseFeature
  };
}
