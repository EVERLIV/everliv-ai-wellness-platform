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
  forceRefreshSubscription: () => Promise<void>;
  debugInfo: any;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Helper function to validate UUID format
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Enhanced premium check with detailed logging
const checkPremiumFromDatabase = (subscription: Subscription | null, userEmail?: string): boolean => {
  console.log('🔍 [PREMIUM CHECK] Starting premium check for user:', userEmail);
  
  if (!subscription) {
    console.log('❌ [PREMIUM CHECK] No subscription found');
    return false;
  }
  
  const now = new Date();
  const expiresAt = new Date(subscription.expires_at);
  
  const isActive = subscription.status === 'active';
  const isPremium = subscription.plan_type === 'premium';
  const notExpired = expiresAt > now;
  
  console.log('📊 [PREMIUM CHECK] Subscription details:', {
    subscriptionId: subscription.id,
    userEmail,
    status: subscription.status,
    planType: subscription.plan_type,
    expiresAt: subscription.expires_at,
    expiresAtParsed: expiresAt.toISOString(),
    currentTime: now.toISOString(),
    timeDiff: expiresAt.getTime() - now.getTime(),
    isActive,
    isPremium,
    notExpired,
    result: isActive && isPremium && notExpired
  });
  
  if (!isActive) {
    console.log('❌ [PREMIUM CHECK] Subscription is not active:', subscription.status);
  }
  
  if (!isPremium) {
    console.log('❌ [PREMIUM CHECK] Not premium plan:', subscription.plan_type);
  }
  
  if (!notExpired) {
    console.log('❌ [PREMIUM CHECK] Subscription expired:', {
      expiresAt: subscription.expires_at,
      now: now.toISOString(),
      expired: expiresAt <= now
    });
  }
  
  const result = isActive && isPremium && notExpired;
  console.log(result ? '✅ [PREMIUM CHECK] Premium subscription confirmed' : '❌ [PREMIUM CHECK] Premium subscription denied');
  
  return result;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const smartAuth = useSmartAuth();
  const user = smartAuth?.user;
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [featureTrials, setFeatureTrials] = useState<FeatureTrial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [trialExpiresAt, setTrialExpiresAt] = useState<Date | null>(null);
  const [trialTimeRemaining, setTrialTimeRemaining] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { hasFeatureTrial, canUseFeature } = useSubscriptionHelpers(featureTrials);

  // Enhanced premium check function
  const checkIsPremiumActive = () => {
    console.log('🔍 [PREMIUM ACTIVE] Checking premium status for user:', user?.email);
    
    // В dev-режиме с невалидным UUID всегда считаем премиум активным
    if (user?.id && !isValidUUID(user.id)) {
      console.log('🔧 [PREMIUM ACTIVE] Dev mode detected, treating as premium subscription');
      return true;
    }
    
    // Проверяем подписку из базы данных
    const result = checkPremiumFromDatabase(subscription, user?.email);
    console.log('🎯 [PREMIUM ACTIVE] Final premium status:', result);
    
    return result;
  };

  const isPremiumActive = checkIsPremiumActive();

  // Enhanced plan type detection
  const getCurrentPlanType = (): 'basic' | 'premium' => {
    console.log('🔍 [PLAN TYPE] Determining plan type for user:', user?.email);
    
    // В dev-режиме с невалидным UUID всегда премиум
    if (user?.id && !isValidUUID(user.id)) {
      console.log('🔧 [PLAN TYPE] Dev mode detected, returning premium');
      return 'premium';
    }
    
    // Проверяем активную подписку из Supabase
    const result = checkPremiumFromDatabase(subscription, user?.email) ? 'premium' : 'basic';
    console.log('📋 [PLAN TYPE] Final plan type:', result);
    
    return result;
  };

  // Enhanced current plan info with detailed logging
  const getCurrentPlanInfo = () => {
    console.log('🔍 [PLAN INFO] Determining current plan display. Loading:', isLoading, 'User:', user?.email);
    
    if (isLoading) return { plan: "Загрузка...", hasActive: false };
    
    const planType = getCurrentPlanType();
    
    if (planType === 'premium') {
      console.log('✅ [PLAN INFO] Premium plan detected');
      if (user?.id && !isValidUUID(user.id)) {
        return { plan: 'Премиум (Dev)', hasActive: true };
      } else {
        return { plan: 'Премиум', hasActive: true };
      }
    }
    
    // Проверяем пробный период только если нет активной подписки
    if (isTrialActive && trialTimeRemaining) {
      console.log('🎯 [PLAN INFO] Using trial period:', trialTimeRemaining);
      return { 
        plan: `Пробный (${trialTimeRemaining})`,
        hasActive: true
      };
    }
    
    console.log('📋 [PLAN INFO] Defaulting to basic plan for user:', user?.email);
    return { plan: 'Базовый', hasActive: false };
  };

  const { plan: currentPlan, hasActive: hasActiveSubscription } = getCurrentPlanInfo();

  // Force refresh subscription function
  const forceRefreshSubscription = async (): Promise<void> => {
    console.log('🔄 [FORCE REFRESH] Starting forced subscription refresh for user:', user?.email);
    
    if (!user?.id) {
      console.log('❌ [FORCE REFRESH] No user ID available');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isValidUUID(user.id)) {
        console.log('🔄 [FORCE REFRESH] Fetching fresh subscription data...');
        const data = await fetchSubscriptionData(user.id);
        
        console.log('📊 [FORCE REFRESH] Fresh subscription data received:', data);
        
        setSubscription(data.subscription);
        setFeatureTrials(data.featureTrials);
        
        // Update debug info
        setDebugInfo({
          lastRefresh: new Date().toISOString(),
          subscriptionData: data.subscription,
          userEmail: user.email,
          userId: user.id,
          premiumCheck: checkPremiumFromDatabase(data.subscription, user.email)
        });
        
        // Check trial status
        const hasValidSubscription = checkPremiumFromDatabase(data.subscription, user.email);
        
        if (!hasValidSubscription) {
          console.log('🔍 [FORCE REFRESH] No valid subscription, checking trial status...');
          const trialStatus = await checkTrialStatusService(user.id);
          console.log('🎯 [FORCE REFRESH] Trial status:', trialStatus);
          
          setIsTrialActive(trialStatus.isActive);
          if (trialStatus.expiresAt) {
            setTrialExpiresAt(new Date(trialStatus.expiresAt));
          }
        } else {
          console.log('✅ [FORCE REFRESH] Valid subscription found, resetting trial');
          setIsTrialActive(false);
          setTrialExpiresAt(null);
        }
        
        toast.success('Подписка обновлена');
      } else {
        console.log('🔧 [FORCE REFRESH] Dev mode, resetting to defaults');
        setSubscription(null);
        setFeatureTrials([]);
        setIsTrialActive(false);
        setTrialExpiresAt(null);
      }
    } catch (error) {
      console.error('❌ [FORCE REFRESH] Error during forced refresh:', error);
      toast.error('Ошибка при обновлении подписки');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Enhanced subscription data loading with extensive logging
  useEffect(() => {
    const loadSubscriptionData = async () => {
      console.log('🔄 [LOAD DATA] Loading subscription data for user:', user?.id, user?.email);
      
      if (!user?.id) {
        console.log('👤 [LOAD DATA] No user, resetting subscription state');
        setSubscription(null);
        setFeatureTrials([]);
        setIsLoading(false);
        setIsTrialActive(false);
        setTrialExpiresAt(null);
        setDebugInfo({ noUser: true, timestamp: new Date().toISOString() });
        return;
      }

      console.log('🔄 [LOAD DATA] User found, starting data load...');
      setIsLoading(true);
      
      // Для пользователей с валидным UUID пытаемся загрузить данные из базы
      if (isValidUUID(user.id)) {
        try {
          console.log('📊 [LOAD DATA] Fetching subscription data from database...');
          const data = await fetchSubscriptionData(user.id);
          console.log('📊 [LOAD DATA] Subscription data loaded:', data);
          
          setSubscription(data.subscription);
          setFeatureTrials(data.featureTrials);
          
          // Update debug info
          setDebugInfo({
            loadedAt: new Date().toISOString(),
            subscriptionData: data.subscription,
            userEmail: user.email,
            userId: user.id,
            premiumCheck: checkPremiumFromDatabase(data.subscription, user.email),
            hasValidUUID: true
          });
          
          // Check trial status only if there is no active subscription
          const hasValidSubscription = checkPremiumFromDatabase(data.subscription, user.email);
          
          if (!hasValidSubscription) {
            console.log('🔍 [LOAD DATA] No valid subscription, checking trial status...');
            const trialStatus = await checkTrialStatusService(user.id);
            console.log('🎯 [LOAD DATA] Trial status loaded:', trialStatus);
            
            setIsTrialActive(trialStatus.isActive);
            if (trialStatus.expiresAt) {
              setTrialExpiresAt(new Date(trialStatus.expiresAt));
            }
          } else {
            console.log('✅ [LOAD DATA] Valid subscription found, resetting trial');
            setIsTrialActive(false);
            setTrialExpiresAt(null);
          }
        } catch (error) {
          console.error("❌ [LOAD DATA] Error loading subscription data:", error);
          setDebugInfo({
            error: error.message,
            timestamp: new Date().toISOString(),
            userEmail: user.email,
            userId: user.id
          });
        }
      } else {
        console.log('🔧 [LOAD DATA] Dev mode detected, skipping subscription data fetch');
        setSubscription(null);
        setFeatureTrials([]);
        setIsTrialActive(false);
        setTrialExpiresAt(null);
        setDebugInfo({
          devMode: true,
          timestamp: new Date().toISOString(),
          userEmail: user.email,
          userId: user.id,
          hasValidUUID: false
        });
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
    return await checkUsageLimit(user.id, featureType, planType, undefined, user.email);
  };

  const incrementFeatureUsage = async (featureType: string): Promise<void> => {
    if (!user?.id || !isValidUUID(user.id)) return;

    // Не увеличиваем счетчик для премиум пользователей
    if (checkPremiumFromDatabase(subscription, user?.email)) {
      console.log('🎯 Skipping usage increment for premium user:', user.email);
      return;
    }

    try {
      await incrementUsage(user.id, featureType);
    } catch (error) {
      console.error("Error incrementing feature usage:", error);
      throw error;
    }
  };

  // Enhanced analytics access check
  const canAccessAnalytics = (): boolean => {
    const planType = getCurrentPlanType();
    console.log('🔍 [ANALYTICS ACCESS] Analytics access check:', { 
      planType, 
      canAccess: planType === 'premium',
      userEmail: user?.email,
      subscription: subscription?.id
    });
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
    getCurrentPlanType,
    forceRefreshSubscription,
    debugInfo
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
    console.error("❌ useSubscription called outside SubscriptionProvider");
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export { PLAN_FEATURES };
