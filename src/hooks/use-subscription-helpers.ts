
import { FeatureTrial } from "@/types/subscription";
import { FEATURE_DESCRIPTIONS } from "@/constants/subscription-features";

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
    const feature = FEATURE_DESCRIPTIONS[featureName as keyof typeof FEATURE_DESCRIPTIONS];
    if (!feature) return false;

    return feature.includedIn[planType as keyof typeof feature.includedIn] || false;
  };

  return {
    hasFeatureTrial,
    canUseFeature
  };
};
