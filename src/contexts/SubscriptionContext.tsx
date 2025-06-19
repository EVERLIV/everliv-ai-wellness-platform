import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Subscription, SubscriptionPlan, FeatureTrial } from "@/types/subscription";
import { useSmartAuth } from "@/hooks/useSmartAuth";
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
  isPremiumActive: boolean;
  canAccessAnalytics: () => boolean;
  getCurrentPlanType: () => 'basic' | 'premium';
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Helper function to validate UUID format
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSmartAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [featureTrials, setFeatureTrials] = useState<FeatureTrial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [trialExpiresAt, setTrialExpiresAt] = useState<Date | null>(null);
  const [trialTimeRemaining, setTrialTimeRemaining] = useState<string | null>(null);
  const { hasFeatureTrial, canUseFeature } = useSubscriptionHelpers(featureTrials);

  // Функция для проверки является ли пользователь премиум
  const isPremiumUser = (email: string): boolean => {
    return email === 'hoaandrey@gmail.com';
  };

  // Функция для проверки активности премиум подписки
  const checkIsPremiumActive = () => {
    console.log('🔍 Checking premium status for user:', user?.email);
    
    // Специальная проверка для премиум пользователя
    if (user?.email && isPremiumUser(user.email)) {
      console.log('🎯 Premium user detected:', user.email, 'Always premium active');
      return true;
    }
    
    // В dev-режиме с невалидным UUID всегда считаем премиум активным
    if (user?.id && !isValidUUID(user.id)) {
      console.log('🔧 Dev mode detected, treating as premium subscription');
      return true;
    }
    
    if (!subscription) {
      console.log('❌ No subscription data available');
      return false;
    }
    
    const isActive = subscription.status === 'active';
    const isPremium = subscription.plan_type === 'premium';
    const notExpired = new Date(subscription.expires_at) > new Date();
    
    console.log('🔍 Standard premium check:', {
      subscription: subscription.id,
      isActive,
      isPremium,
      notExpired,
      expiresAt: subscription.expires_at,
      now: new Date().toISOString(),
      result: isActive && isPremium && notExpired,
      userEmail: user?.email
    });
    
    return isActive && isPremium && notExpired;
  };

  const isPremiumActive = checkIsPremiumActive();

  // Функция определения текущего плана для ограничений
  const getCurrentPlanType = (): 'basic' | 'premium' => {
    // Специальная обработка для премиум пользователя
    if (user?.email && isPremiumUser(user.email)) {
      return 'premium';
    }
    
    // В dev-режиме с невалидным UUID всегда премиум
    if (user?.id && !isValidUUID(user.id)) {
      return 'premium';
    }
    
    // Проверяем активную подписку из Supabase
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const expiresAt = new Date(subscription.expires_at);
      
      if (expiresAt > now && subscription.plan_type === 'premium') {
        return 'premium';
      }
    }
    
    return 'basic';
  };

  // Функция определения текущего плана для отображения
  const getCurrentPlanInfo = () => {
    console.log('🔍 Determining current plan. Loading:', isLoading, 'User:', user?.email);
    
    if (isLoading) return { plan: "Загрузка...", hasActive: false };
    
    const planType = getCurrentPlanType();
    
    if (planType === 'premium') {
      if (user?.email && isPremiumUser(user.email)) {
        return { plan: 'Премиум', hasActive: true };
      } else if (user?.id && !isValidUUID(user.id)) {
        return { plan: 'Премиум (Dev)', hasActive: true };
      } else {
        return { plan: 'Премиум', hasActive: true };
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
    
    console.log('📋 Defaulting to basic plan for user:', user?.email);
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
      if (!user?.id) {
        console.log('👤 No user, resetting subscription state');
        setSubscription(null);
        setFeatureTrials([]);
        setIsLoading(false);
        setIsTrialActive(false);
        setTrialExpiresAt(null);
        return;
      }

      console.log('🔄 Loading subscription data for user:', user.id, user.email);
      setIsLoading(true);
      
      // Для премиум пользователя создаём виртуальную подписку
      if (user.email && isPremiumUser(user.email)) {
        console.log('🎯 Setting up premium subscription for known user');
        const premiumSubscription: Subscription = {
          id: 'premium-hoaandrey',
          user_id: user.id,
          plan_type: 'premium',
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // год вперед
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setSubscription(premiumSubscription);
        setFeatureTrials([]);
        setIsTrialActive(false);
        setTrialExpiresAt(null);
        setIsLoading(false);
        return;
      }
      
      // Для пользователей с валидным UUID пытаемся загрузить данные из базы
      if (isValidUUID(user.id)) {
        try {
          const data = await fetchSubscriptionData(user.id);
          console.log('📊 Subscription data loaded for', user.email, ':', data);
          
          setSubscription(data.subscription);
          setFeatureTrials(data.featureTrials);
          
          // Check trial status only if there is no active subscription
          const hasValidSubscription = data.subscription && 
            data.subscription.status === 'active' && 
            new Date(data.subscription.expires_at) > new Date();
            
          if (!hasValidSubscription) {
            console.log('🔍 No valid subscription, checking trial status for:', user.email);
            const trialStatus = await checkTrialStatusService(user.id);
            console.log('🎯 Trial status loaded for', user.email, ':', trialStatus);
            
            setIsTrialActive(trialStatus.isActive);
            if (trialStatus.expiresAt) {
              setTrialExpiresAt(new Date(trialStatus.expiresAt));
            }
          } else {
            console.log('✅ Valid subscription found for', user.email, ', resetting trial');
            setIsTrialActive(false);
            setTrialExpiresAt(null);
          }
        } catch (error) {
          console.error("❌ Error loading subscription data for", user.email, ":", error);
        }
      } else {
        console.log('🔧 Dev mode detected, skipping subscription data fetch');
        setSubscription(null);
        setFeatureTrials([]);
        setIsTrialActive(false);
        setTrialExpiresAt(null);
      }
      
      setIsLoading(false);
    };

    loadSubscriptionData();
  }, [user?.id, user?.email]);

  const recordFeatureTrial = async (featureName: string): Promise<void> => {
    if (!user?.id || !isValidUUID(user.id)) return;

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
    if (!user?.id || !isValidUUID(user.id)) return;

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
    if (!subscription || !user?.id || !isValidUUID(user.id)) return;

    try {
      const updatedSubscription = await upgradeSubscriptionService(user.id, subscription.id, newPlanType);
      setSubscription(updatedSubscription);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
    }
  };

  const checkFeatureUsage = async (featureType: string) => {
    if (!user?.id || !isValidUUID(user.id)) {
      // В dev-режиме разрешаем неограниченное использование
      return { canUse: true, currentUsage: 0, limit: 999 };
    }

    const planType = getCurrentPlanType();
    return await checkUsageLimit(user.id, featureType, planType);
  };

  const incrementFeatureUsage = async (featureType: string): Promise<void> => {
    if (!user?.id || !isValidUUID(user.id)) return;

    try {
      await incrementUsage(user.id, featureType);
    } catch (error) {
      console.error("Error incrementing feature usage:", error);
      throw error;
    }
  };

  // Новая функция для проверки доступа к аналитике
  const canAccessAnalytics = (): boolean => {
    const planType = getCurrentPlanType();
    console.log('🔍 Analytics access check:', { planType, canAccess: planType === 'premium' });
    return planType === 'premium';
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
    hasActiveSubscription,
    isPremiumActive,
    canAccessAnalytics,
    getCurrentPlanType: getCurrentPlanType
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
