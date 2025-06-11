
import { createContext, useContext } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PLAN_FEATURES } from "@/constants/subscription-features";
import { SubscriptionContextType, SubscriptionProviderProps } from "@/types/subscription-context";
import { useSubscriptionState } from "@/hooks/use-subscription-state";
import { useTrialTimer } from "@/hooks/use-trial-timer";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import { useSubscriptionActions } from "@/hooks/use-subscription-actions";
import { useSubscriptionData } from "@/hooks/use-subscription-data";

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user } = useAuth();
  
  const {
    subscription,
    setSubscription,
    featureTrials,
    setFeatureTrials,
    isLoading,
    setIsLoading,
    isTrialActive,
    setIsTrialActive,
    trialExpiresAt,
    setTrialExpiresAt,
    trialTimeRemaining,
    setTrialTimeRemaining
  } = useSubscriptionState();

  // Load subscription data when user changes
  useSubscriptionData(
    setSubscription,
    setFeatureTrials,
    setIsLoading,
    setIsTrialActive,
    setTrialExpiresAt
  );

  // Calculate time remaining for trial
  useTrialTimer(trialExpiresAt, setIsTrialActive, setTrialTimeRemaining);

  // Feature access logic
  const { hasFeatureTrial, canUseFeature } = useFeatureAccess(
    subscription,
    featureTrials,
    isTrialActive,
    user
  );

  // Subscription actions
  const {
    recordFeatureTrial,
    purchaseSubscription,
    cancelSubscription,
    upgradeSubscription,
    checkFeatureUsage,
    incrementFeatureUsage
  } = useSubscriptionActions(
    user,
    subscription,
    featureTrials,
    setFeatureTrials,
    setSubscription,
    hasFeatureTrial
  );

  const contextValue = {
    subscription,
    isLoading,
    featureTrials,
    hasFeatureTrial,
    canUseFeature,
    recordFeatureTrial,
    purchaseSubscription,
    cancelSubscription,
    upgradeSubscription,
    checkFeatureUsage,
    incrementFeatureUsage,
    isTrialActive,
    trialExpiresAt,
    trialTimeRemaining
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export { PLAN_FEATURES };
