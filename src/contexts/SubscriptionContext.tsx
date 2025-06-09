
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Subscription, SubscriptionPlan, FeatureTrial } from "@/types/subscription";
import { useAuth } from "@/contexts/AuthContext";
import { PLAN_FEATURES } from "@/constants/subscription-features";
import { useSubscriptionHelpers } from "@/hooks/use-subscription-helpers";
import { 
  fetchSubscriptionData, 
  recordFeatureTrialService, 
  purchaseSubscriptionService,
  cancelSubscriptionService,
  upgradeSubscriptionService,
  checkTrialStatusService
} from "@/services/subscription-service";
import { toast } from "sonner";

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  featureTrials: FeatureTrial[];
  hasFeatureTrial: (featureName: string) => boolean;
  canUseFeature: (featureName: string) => boolean;
  recordFeatureTrial: (featureName: string) => Promise<void>;
  purchaseSubscription: (planType: SubscriptionPlan) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  upgradeSubscription: (newPlanType: SubscriptionPlan) => Promise<void>;
  isTrialActive: boolean;
  trialExpiresAt: Date | null;
  trialTimeRemaining: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [featureTrials, setFeatureTrials] = useState<FeatureTrial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [trialExpiresAt, setTrialExpiresAt] = useState<Date | null>(null);
  const [trialTimeRemaining, setTrialTimeRemaining] = useState<string | null>(null);
  const { hasFeatureTrial, canUseFeature } = useSubscriptionHelpers(featureTrials);

  // Calculate time remaining for trial
  useEffect(() => {
    if (!trialExpiresAt) {
      setTrialTimeRemaining(null);
      return;
    }
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const expiresAt = new Date(trialExpiresAt);
      const diffMs = expiresAt.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setIsTrialActive(false);
        setTrialTimeRemaining("Истек");
        return;
      }
      
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHrs > 0) {
        setTrialTimeRemaining(`${diffHrs} ч ${diffMins} мин`);
      } else {
        setTrialTimeRemaining(`${diffMins} мин`);
      }
    };
    
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 60000);
    
    return () => clearInterval(timer);
  }, [trialExpiresAt]);

  // Fetch subscription data when user changes
  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (!user) {
        setSubscription(null);
        setFeatureTrials([]);
        setIsLoading(false);
        setIsTrialActive(false);
        setTrialExpiresAt(null);
        return;
      }

      setIsLoading(true);
      
      try {
        const data = await fetchSubscriptionData(user.id);
        setSubscription(data.subscription);
        setFeatureTrials(data.featureTrials);
        
        // Check trial status
        const trialStatus = await checkTrialStatusService(user.id);
        setIsTrialActive(trialStatus.isActive);
        if (trialStatus.expiresAt) {
          setTrialExpiresAt(new Date(trialStatus.expiresAt));
        }
      } catch (error) {
        console.error("Error loading subscription data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionData();
  }, [user]);

  const recordFeatureTrial = async (featureName: string): Promise<void> => {
    if (!user) {
      return;
    }

    if (hasFeatureTrial(featureName)) {
      return;
    }

    try {
      const newTrial = await recordFeatureTrialService(user.id, featureName);
      setFeatureTrials([...featureTrials, newTrial]);
    } catch (error) {
      console.error("Error recording feature trial:", error);
    }
  };

  const purchaseSubscription = async (planType: SubscriptionPlan): Promise<void> => {
    if (!user) return;

    try {
      const newSubscription = await purchaseSubscriptionService(user.id, planType);
      setSubscription(newSubscription);
    } catch (error) {
      console.error("Error purchasing subscription:", error);
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    if (!subscription) return;

    try {
      await cancelSubscriptionService(subscription.id);
      setSubscription({...subscription, status: 'canceled'});
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  const upgradeSubscription = async (newPlanType: SubscriptionPlan): Promise<void> => {
    if (!subscription || !user) return;

    try {
      const updatedSubscription = await upgradeSubscriptionService(user.id, subscription.id, newPlanType);
      setSubscription(updatedSubscription);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
    }
  };

  const contextValue = {
    subscription,
    isLoading,
    featureTrials,
    hasFeatureTrial,
    // МАКСИМАЛЬНЫЙ ДОСТУП: Все функции доступны всем пользователям
    canUseFeature: (featureName: string) => {
      // Если пользователь авторизован, он имеет доступ ко всем функциям
      return !!user;
    },
    recordFeatureTrial,
    purchaseSubscription,
    cancelSubscription,
    upgradeSubscription,
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
