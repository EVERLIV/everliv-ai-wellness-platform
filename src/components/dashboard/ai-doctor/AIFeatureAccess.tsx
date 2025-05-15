
import { ReactNode, useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, LockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SelectPlanCTA from "@/components/pricing/SelectPlanCTA";

interface AIFeatureAccessProps {
  featureName: string;
  title: string;
  description?: string;
  children: ReactNode;
}

const AIFeatureAccess = ({ 
  featureName, 
  title,
  description,
  children 
}: AIFeatureAccessProps) => {
  const { user } = useAuth();
  const { canUseFeature, recordFeatureTrial, hasFeatureTrial } = useSubscription();
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
    const handleUseFeature = async () => {
      await recordFeatureTrial(featureName);
      setIsTrialUsed(true);
    };

    // If this is a trial use, record it when the user starts using the feature
    if (!hasFeatureTrial(featureName) && !isTrialUsed) {
      handleUseFeature();
    }

    // Return the actual feature content
    return <>{children}</>;
  }

  // If they've already used their trial for this feature, show subscription message
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
          <p className="text-gray-500 text-center mt-2 mb-6">
            {description || 'Для доступа к этой функции необходима подписка на тариф, включающий данную возможность'}
          </p>
          <SelectPlanCTA location="feature" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFeatureAccess;
