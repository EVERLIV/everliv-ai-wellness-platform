
import { ReactNode, useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, LockIcon, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureAccessProps {
  featureName: string;
  title: string;
  description?: string;
  children: ReactNode;
}

const FeatureAccess = ({ 
  featureName, 
  title,
  description,
  children 
}: FeatureAccessProps) => {
  const { user } = useAuth();
  const { canUseFeature, recordFeatureTrial, hasFeatureTrial, isTrialActive, trialTimeRemaining } = useSubscription();
  const [isTrialUsed, setIsTrialUsed] = useState(false);
  const navigate = useNavigate();
  
  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-gray-400" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium">Требуется авторизация</h3>
            <p className="text-gray-500 text-center mt-2">
              Для доступа к этой функции необходимо войти в систему
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Войти
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // If user can use this feature (has subscription or trial is active)
  if (canUseFeature(featureName)) {
    // Record feature trial if they don't have a subscription that includes it
    // and they're not in trial period
    const handleUseFeature = async () => {
      if (!isTrialActive) {
        await recordFeatureTrial(featureName);
        setIsTrialUsed(true);
      }
    };

    // If this is a trial use, record it when the component is mounted
    if (!hasFeatureTrial(featureName) && !isTrialUsed && !isTrialActive) {
      handleUseFeature();
    }
    
    // Return the actual feature content
    return <>{children}</>;
  }
  
  // Otherwise, show subscription required message
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockIcon className="h-5 w-5 text-gray-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6">
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium">Требуется подписка</h3>
          {isTrialActive ? (
            <div className="text-center mt-2">
              <p className="text-gray-500">
                У вас активен пробный период, но эта функция требует подписки.
              </p>
              <p className="text-sm mt-2 flex items-center justify-center">
                <Clock className="h-4 w-4 mr-1 text-everliv-600" />
                <span>Осталось: {trialTimeRemaining}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-2">
              Вы уже использовали бесплатную пробную версию этой функции.
              Для продолжения работы необходимо оформить подписку.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => navigate("/pricing")}
        >
          Выбрать план
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureAccess;
