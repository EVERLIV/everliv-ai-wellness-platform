
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const TrialStatusBanner = () => {
  const { isTrialActive, trialTimeRemaining, subscription } = useSubscription();
  
  // If user has an active subscription, don't show trial banner
  if (subscription?.status === 'active') {
    return null;
  }
  
  return (
    <>
      {isTrialActive ? (
        <div className="bg-everliv-600 text-white p-2 text-center text-sm flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            Ваш пробный период активен. Осталось: <strong>{trialTimeRemaining}</strong>.
          </span>
          <Link to="/pricing" className="ml-4">
            <Button variant="outline" size="sm" className="h-7 text-white hover:text-everliv-600 border-white hover:bg-white">
              Выбрать план
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm flex items-center justify-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>
            Ваш пробный период закончился. Оформите подписку для продолжения работы.
          </span>
          <Link to="/pricing" className="ml-4">
            <Button size="sm" className="h-7 bg-yellow-700 hover:bg-yellow-800 text-white">
              Выбрать план
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default TrialStatusBanner;
