
import { FeatureTrial } from "@/types/subscription";
import { PLAN_FEATURES } from "@/constants/subscription-features";

export const useSubscriptionHelpers = (featureTrials: FeatureTrial[]) => {
  const hasFeatureTrial = (featureName: string): boolean => {
    return featureTrials.some(trial => trial.feature_name === featureName);
  };

  const canUseFeature = (featureName: string, planType?: string): boolean => {
    // Если у пользователя нет активной подписки, проверяем пробную версию
    if (!planType) {
      return !hasFeatureTrial(featureName);
    }

    // Если есть активная подписка, проверяем включена ли функция в план
    const feature = PLAN_FEATURES[featureName as keyof typeof PLAN_FEATURES];
    if (!feature) return false;

    return feature.includedIn[planType as keyof typeof feature.includedIn] || false;
  };

  return {
    hasFeatureTrial,
    canUseFeature
  };
};
