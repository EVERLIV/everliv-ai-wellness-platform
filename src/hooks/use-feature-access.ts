
import { useCallback } from "react";
import { Subscription, FeatureTrial } from "@/types/subscription";
import { PLAN_FEATURES } from "@/constants/subscription-features";

export const useFeatureAccess = (
  subscription: Subscription | null,
  featureTrials: FeatureTrial[],
  isTrialActive: boolean,
  user: any
) => {
  const hasFeatureTrial = useCallback((featureName: string): boolean => {
    return featureTrials.some(trial => trial.feature_name === featureName);
  }, [featureTrials]);

  const canUseFeature = useCallback((featureName: string): boolean => {
    console.log("Checking feature access:", { featureName, subscription, isTrialActive });
    
    // Если пользователя нет, доступа нет
    if (!user) return false;
    
    // Проверяем активную подписку
    if (subscription && subscription.status === 'active') {
      const planType = subscription.plan_type;
      console.log("Active subscription found:", planType);
      
      // Ищем функцию в PLAN_FEATURES и проверяем доступ по плану
      const feature = Object.values(PLAN_FEATURES).find(f => 
        Object.keys(PLAN_FEATURES).some(key => key === featureName)
      );
      
      if (feature) {
        const hasAccess = feature.includedIn[planType] === true;
        console.log(`Feature ${featureName} access for ${planType}:`, hasAccess);
        return hasAccess;
      }
      
      // Если функция не найдена в PLAN_FEATURES, проверяем по старой логике
      // Для photo_blood_analysis даем доступ только premium пользователям
      if (featureName === 'photo_blood_analysis') {
        const hasAccess = planType === 'premium';
        console.log(`Photo blood analysis access for ${planType}:`, hasAccess);
        return hasAccess;
      }
    }
    
    // Проверяем пробный период
    if (isTrialActive) {
      console.log("Trial is active, granting access");
      return true;
    }
    
    // Проверяем пробное использование функции
    const hasTrialUsage = hasFeatureTrial(featureName);
    console.log(`Feature trial for ${featureName}:`, hasTrialUsage);
    
    if (hasTrialUsage) return true;
    
    // Базовый доступ для некоторых функций
    if (featureName === 'photo_blood_analysis') {
      return false; // Фото анализ только для premium
    }
    
    console.log(`No access granted for ${featureName}`);
    return false;
  }, [subscription, featureTrials, isTrialActive, user, hasFeatureTrial]);

  return {
    hasFeatureTrial,
    canUseFeature
  };
};
