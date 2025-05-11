
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscription, SubscriptionPlan, FeatureTrial } from "@/types/subscription";
import { useAuth } from "@/contexts/AuthContext";
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
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const FEATURES = {
  AI_HEALTH_ANALYSIS: "ai_health_analysis",
  BLOOD_ANALYSIS: "blood_analysis",
  PERSONALIZED_RECOMMENDATIONS: "personalized_recommendations",
  SUPPLEMENTS_SELECTION: "supplements_selection",
  HEALTH_MONITORING: "health_monitoring",
  COMPREHENSIVE_ASSESSMENT: "comprehensive_assessment",
};

export const PLAN_FEATURES: Record<string, PlanFeature> = {
  [FEATURES.AI_HEALTH_ANALYSIS]: {
    name: "Анализ здоровья с помощью ИИ",
    description: "Базовый анализ состояния здоровья с использованием искусственного интеллекта",
    includedIn: { basic: true, standard: true, premium: true }
  },
  [FEATURES.BLOOD_ANALYSIS]: {
    name: "Интерпретация анализов крови",
    description: "Расшифровка и объяснение результатов анализов крови",
    includedIn: { basic: true, standard: true, premium: true }
  },
  [FEATURES.PERSONALIZED_RECOMMENDATIONS]: {
    name: "Персонализированные рекомендации",
    description: "Индивидуальные рекомендации по улучшению здоровья",
    includedIn: { basic: false, standard: true, premium: true }
  },
  [FEATURES.SUPPLEMENTS_SELECTION]: {
    name: "Подбор витаминов и добавок",
    description: "Персонализированный подбор витаминов и добавок",
    includedIn: { basic: false, standard: true, premium: true }
  },
  [FEATURES.HEALTH_MONITORING]: {
    name: "Мониторинг состояния здоровья",
    description: "Непрерывный мониторинг показателей здоровья",
    includedIn: { basic: false, standard: false, premium: true }
  },
  [FEATURES.COMPREHENSIVE_ASSESSMENT]: {
    name: "Комплексная оценка здоровья",
    description: "Полная комплексная оценка состояния здоровья",
    includedIn: { basic: false, standard: false, premium: true }
  },
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [featureTrials, setFeatureTrials] = useState<FeatureTrial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch subscription data when user changes
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) {
        setSubscription(null);
        setFeatureTrials([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Fetch current subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (subscriptionError) throw subscriptionError;
        
        // Fetch feature trials
        const { data: trialsData, error: trialsError } = await supabase
          .from('feature_trials')
          .select('*')
          .eq('user_id', user.id);
        
        if (trialsError) throw trialsError;
        
        setSubscription(subscriptionData);
        setFeatureTrials(trialsData || []);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  const hasFeatureTrial = (featureName: string): boolean => {
    return featureTrials.some(trial => trial.feature_name === featureName);
  };

  const canUseFeature = (featureName: string): boolean => {
    // If user has an active subscription that includes this feature
    if (subscription) {
      const feature = PLAN_FEATURES[featureName];
      if (feature) {
        return feature.includedIn[subscription.plan_type as SubscriptionPlan];
      }
    }
    
    // Or if they've never used their free trial for this feature
    return !hasFeatureTrial(featureName);
  };

  const recordFeatureTrial = async (featureName: string): Promise<void> => {
    if (!user) {
      toast.error("Необходимо войти в систему");
      return;
    }

    if (hasFeatureTrial(featureName)) {
      return; // Already recorded
    }

    try {
      const newTrial = {
        user_id: user.id,
        feature_name: featureName,
      };

      const { data, error } = await supabase
        .from('feature_trials')
        .insert(newTrial)
        .select()
        .single();

      if (error) throw error;

      setFeatureTrials([...featureTrials, data]);
    } catch (error) {
      console.error("Error recording feature trial:", error);
      toast.error("Не удалось записать использование пробной функции");
    }
  };

  // Mock implementation for now - would be replaced with real payment functionality
  const purchaseSubscription = async (planType: SubscriptionPlan): Promise<void> => {
    if (!user) {
      toast.error("Необходимо войти в систему");
      return;
    }

    try {
      // Calculate expiration date (1 month from now)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      
      const newSubscription = {
        user_id: user.id,
        plan_type: planType,
        status: 'active',
        expires_at: expiresAt.toISOString(),
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(newSubscription)
        .select()
        .single();

      if (error) throw error;

      setSubscription(data);
      toast.success(`Подписка ${planType} успешно оформлена!`);
    } catch (error) {
      console.error("Error purchasing subscription:", error);
      toast.error("Не удалось оформить подписку");
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    if (!subscription) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('id', subscription.id);

      if (error) throw error;

      setSubscription({...subscription, status: 'canceled'});
      toast.success("Подписка отменена");
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Не удалось отменить подписку");
    }
  };

  const upgradeSubscription = async (newPlanType: SubscriptionPlan): Promise<void> => {
    if (!subscription) return;

    try {
      // Cancel current subscription
      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('id', subscription.id);

      if (cancelError) throw cancelError;

      // Calculate expiration date (1 month from now)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      
      // Create new subscription
      const newSubscription = {
        user_id: user!.id,
        plan_type: newPlanType,
        status: 'active',
        expires_at: expiresAt.toISOString(),
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(newSubscription)
        .select()
        .single();

      if (error) throw error;

      setSubscription(data);
      toast.success(`Подписка обновлена до ${newPlanType}`);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      toast.error("Не удалось обновить подписку");
    }
  };

  const value = {
    subscription,
    isLoading,
    featureTrials,
    hasFeatureTrial,
    canUseFeature,
    recordFeatureTrial,
    purchaseSubscription,
    cancelSubscription,
    upgradeSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
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
