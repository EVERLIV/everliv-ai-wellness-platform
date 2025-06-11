
import { useState, useEffect } from "react";
import { Subscription, FeatureTrial } from "@/types/subscription";

export const useSubscriptionState = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [featureTrials, setFeatureTrials] = useState<FeatureTrial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [trialExpiresAt, setTrialExpiresAt] = useState<Date | null>(null);
  const [trialTimeRemaining, setTrialTimeRemaining] = useState<string | null>(null);

  return {
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
  };
};
