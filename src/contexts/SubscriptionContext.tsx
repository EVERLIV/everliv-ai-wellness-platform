
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
import { 
  getCurrentMonthUsage, 
  incrementUsage, 
  checkUsageLimit 
} from "@/services/usage-tracking-service";
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
  checkFeatureUsage: (featureType: string) => Promise<{ canUse: boolean; currentUsage: number; limit: number }>;
  incrementFeatureUsage: (featureType: string) => Promise<void>;
  isTrialActive: boolean;
  trialExpiresAt: Date | null;
  trialTimeRemaining: string | null;
  currentPlan: string;
  hasActiveSubscription: boolean;
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

  // Вычисляем текущий план и статус подписки с приоритетом данных из Supabase
  const getCurrentPlanInfo = () => {
    console.log('🔍 Determining current plan. Loading:', isLoading, 'Subscription:', subscription);
    
    if (isLoading) return { plan: "Загрузка...", hasActive: false };
    
    // ПРИОРИТЕТ: Проверяем активную подписку из Supabase
    if (subscription) {
      console.log('📋 Checking subscription:', {
        id: subscription.id,
        status: subscription.status,
        plan_type: subscription.plan_type,
        expires_at: subscription.expires_at
      });
      
      if (subscription.status === 'active') {
        const now = new Date();
        const expiresAt = new Date(subscription.expires_at);
        
        console.log('⏰ Subscription expiry check:', {
          now: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          isValid: expiresAt > now
        });
        
        if (expiresAt > now) {
          const planNames = {
            'premium': 'Премиум',
            'standard': 'Стандарт',
            'basic': 'Базовый'
          };
          
          const planName = planNames[subscription.plan_type as keyof typeof planNames] || 'Базовый';
          console.log('✅ Active subscription confirmed:', planName);
          
          return { 
            plan: planName,
            hasActive: true
          };
        } else {
          console.log('⚠️ Subscription expired');
        }
      } else {
        console.log('⚠️ Subscription not active, status:', subscription.status);
      }
    }
    
    // Проверяем пробный период только если нет активной подписки
    if (isTrialActive && trialTimeRemaining) {
      console.log('🎯 Using trial period:', trialTimeRemaining);
      return { 
        plan: `Пробный (${trialTimeRemaining})`,
        hasActive: true
      };
    }
    
    console.log('📋 Defaulting to basic plan');
    return { plan: 'Базовый', hasActive: false };
  };

  const { plan: currentPlan, hasActive: hasActiveSubscription } = getCurrentPlanInfo();

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
        console.log('👤 No user, resetting subscription state');
        setSubscription(null);
        setFeatureTrials([]);
        setIsLoading(false);
        setIsTrialActive(false);
        setTrialExpiresAt(null);
        return;
      }

      console.log('🔄 Loading subscription data for user:', user.id);
      setIsLoading(true);
      
      try {
        const data = await fetchSubscriptionData(user.id);
        console.log('📊 Subscription data loaded:', data);
        
        setSubscription(data.subscription);
        setFeatureTrials(data.featureTrials);
        
        // Check trial status только если нет активной подписки
        if (!data.subscription || data.subscription.status !== 'active' || new Date(data.subscription.expires_at) <= new Date()) {
          console.log('🔍 No active subscription, checking trial status');
          const trialStatus = await checkTrialStatusService(user.id);
          console.log('🎯 Trial status loaded:', trialStatus);
          
          setIsTrialActive(trialStatus.isActive);
          if (trialStatus.expiresAt) {
            setTrialExpiresAt(new Date(trialStatus.expiresAt));
          }
        } else {
          console.log('✅ Active subscription found, skipping trial check');
          setIsTrialActive(false);
          setTrialExpiresAt(null);
        }
      } catch (error) {
        console.error("❌ Error loading subscription data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionData();
  }, [user]);

  const recordFeatureTrial = async (featureName: string): Promise<void> => {
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

  const checkFeatureUsage = async (featureType: string) => {
    if (!user) {
      return { canUse: false, currentUsage: 0, limit: 0 };
    }

    const planType = subscription?.plan_type || 'basic';
    return await checkUsageLimit(user.id, featureType, planType);
  };

  const incrementFeatureUsage = async (featureType: string): Promise<void> => {
    if (!user) return;

    try {
      await incrementUsage(user.id, featureType);
    } catch (error) {
      console.error("Error incrementing feature usage:", error);
      throw error;
    }
  };

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
    trialTimeRemaining,
    currentPlan,
    hasActiveSubscription
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
