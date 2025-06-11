
import { useEffect } from "react";

export const useTrialTimer = (
  trialExpiresAt: Date | null,
  setIsTrialActive: (active: boolean) => void,
  setTrialTimeRemaining: (time: string | null) => void
) => {
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
  }, [trialExpiresAt, setIsTrialActive, setTrialTimeRemaining]);
};
