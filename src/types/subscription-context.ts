
import { ReactNode } from "react";
import { Subscription, SubscriptionPlan, FeatureTrial } from "@/types/subscription";

export interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  featureTrials: FeatureTrial[];
  hasFeatureTrial: (featureName: string) => boolean;
  canUseFeature: (featureName: string) => boolean;
  recordFeatureTrial: (featureName: string) => Promise<void>;
  purchaseSubscription: (planType: SubscriptionPlan) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  upgradeSubscription: (newPlanType: SubscriptionPlan) => Promise<void>;
  checkFeatureUsage: (featureType: string) => Promise<{ canUse: boolean; currentUsage: number; limit: number }>;
  incrementFeatureUsage: (featureType: string) => Promise<void>;
  isTrialActive: boolean;
  trialExpiresAt: Date | null;
  trialTimeRemaining: string | null;
}

export interface SubscriptionProviderProps {
  children: ReactNode;
}
