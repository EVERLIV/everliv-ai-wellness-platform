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

  // Улучшенная функция для проверки активности премиум подписки
  const checkIsPremiumActive = () => {
    console.log('🔍 Checking premium status for user:', user?.email);
    
    // В dev-режиме с невалидным UUID всегда считаем премиум активным
    if (user?.id && !isValidUUID(user.id)) {
      console.log('🔧 Dev mode detected, treating as premium subscription');
      return true;
    }
    
    // Специальная проверка для известного премиум пользователя
    if (user?.email === 'hoaandrey@gmail.com') {
      console.log('🎯 Known premium user detected:', user.email);
      
      // Проверяем подписку из базы данных
      if (subscription && subscription.status === 'active') {
        const now = new Date();
        const expiresAt = new Date(subscription.expires_at);
        const isPremium = subscription.plan_type === 'premium';
        const notExpired = expiresAt > now;
        
        console.log('📊 Premium user subscription check:', {
          isPremium,
          isActive: subscription.status === 'active',
          notExpired,
          expiresAt: subscription.expires_at,
          now: now.toISOString()
        });
        
        return isPremium && notExpired;
      }
      
      // Если нет данных подписки, но это известный премиум пользователь - считаем премиум
      console.log('⚠️ No subscription data for known premium user, defaulting to premium');
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

  // Улучшенная функция определения текущего плана
  const getCurrentPlanInfo = () => {
    console.log('🔍 Determining current plan. Loading:', isLoading, 'User:', user?.email);
    
    if (isLoading) return { plan: "Загрузка...", hasActive: false };
    
    // В dev-режиме с невалидным UUID всегда показываем премиум
    if (user?.id && !isValidUUID(user.id)) {
      console.log('🔧 Dev mode detected, showing premium plan');
      return { 
        plan: 'Премиум (Dev)',
        hasActive: true
      };
    }
    
    // Специальная обработка для известного премиум пользователя
    if (user?.email === 'hoaandrey@gmail.com') {
      console.log('🎯 Processing known premium user');
      
      // Если есть активная подписка в базе
      if (subscription && subscription.status === 'active') {
        const now = new Date();
        const expiresAt = new Date(subscription.expires_at);
        
        if (expiresAt > now && subscription.plan_type === 'premium') {
          console.log('✅ Active premium subscription confirmed for premium user');
          return { 
            plan: 'Премиум',
            hasActive: true
          };
        }
      }
      
      // Если нет данных подписки, но это известный премиум пользователь
      console.log('⚠️ No active subscription data for known premium user, defaulting to premium');
      return { 
        plan: 'Премиум',
        hasActive: true
      };
    }
    
    // ПРИОРИТЕТ: Проверяем активную подписку из Supabase для обычных пользователей
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const expiresAt = new Date(subscription.expires_at);
      
      console.log('⏰ Subscription expiry check:', {
        now: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isValid: expiresAt > now,
        planType: subscription.plan_type,
        userEmail: user?.email
      });
      
      if (expiresAt > now) {
        const planNames = {
          'premium': 'Премиум',
          'standard': 'Стандарт',
          'basic': 'Базовый'
        };
        
        const planName = planNames[subscription.plan_type as keyof typeof planNames] || 'Базовый';
        console.log('✅ Active subscription confirmed:', planName, 'for user:', user?.email);
        
        return { 
          plan: planName,
          hasActive: true
        };
      } else {
        console.log('⚠️ Subscription expired for user:', user?.email);
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
      
      // Для известного премиум пользователя всегда пытаемся загрузить данные
      if (user.email === 'hoaandrey@gmail.com' || isValidUUID(user.id)) {
        try {
          const data = await fetchSubscriptionData(user.id);
          console.log('📊 Subscription data loaded for', user.email, ':', data);
          
          setSubscription(data.subscription);
          setFeatureTrials(data.featureTrials);
          
          // Check trial status only if there is no active subscription
          const hasValidSubscription = data.subscription && 
            data.subscription.status === 'active' && 
            new Date(data.subscription.expires_at) > new Date();
            
          if (!hasValidSubscription && user.email !== 'hoaandrey@gmail.com') {
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
          
          // Для известного премиум пользователя при ошибке все равно устанавливаем премиум
          if (user.email === 'hoaandrey@gmail.com') {
            console.log('🎯 Setting fallback premium for known user');
            // Можно создать фейковую подписку для отображения
            const fallbackSubscription: Subscription = {
              id: 'fallback-premium',
              user_id: user.id,
              plan_type: 'premium',
              status: 'active',
              started_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // год вперед
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setSubscription(fallbackSubscription);
          }
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

    const planType = subscription?.plan_type || 'basic';
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
    isPremiumActive
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
