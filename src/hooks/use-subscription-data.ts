
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Subscription, FeatureTrial } from "@/types/subscription";
import { 
  fetchSubscriptionData, 
  checkTrialStatusService
} from "@/services/subscription-service";

export const useSubscriptionData = (
  setSubscription: (subscription: Subscription | null) => void,
  setFeatureTrials: (trials: FeatureTrial[]) => void,
  setIsLoading: (loading: boolean) => void,
  setIsTrialActive: (active: boolean) => void,
  setTrialExpiresAt: (date: Date | null) => void
) => {
  const { user } = useAuth();

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
        console.log("Loaded subscription data:", data);
        setSubscription(data.subscription);
        setFeatureTrials(data.featureTrials);
        
        // Check trial status
        const trialStatus = await checkTrialStatusService(user.id);
        console.log("Trial status:", trialStatus);
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
  }, [user, setSubscription, setFeatureTrials, setIsLoading, setIsTrialActive, setTrialExpiresAt]);
};
