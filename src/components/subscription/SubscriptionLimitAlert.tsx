
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Crown } from "lucide-react";

interface SubscriptionLimitAlertProps {
  featureName: string;
  currentUsage: number;
  limit: number;
  planType?: string;
}

const SubscriptionLimitAlert: React.FC<SubscriptionLimitAlertProps> = ({
  featureName,
  currentUsage,
  limit,
  planType
}) => {
  const isLimitReached = currentUsage >= limit;
  const isNearLimit = currentUsage >= limit * 0.8;

  if (!isNearLimit && !isLimitReached) return null;

  return (
    <Alert className={`mb-4 ${isLimitReached ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <AlertTriangle className={`h-4 w-4 ${isLimitReached ? 'text-red-600' : 'text-yellow-600'}`} />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className={`font-medium ${isLimitReached ? 'text-red-800' : 'text-yellow-800'}`}>
            {isLimitReached ? 'Лимит исчерпан' : 'Приближаетесь к лимиту'}
          </p>
          <p className={`text-sm ${isLimitReached ? 'text-red-600' : 'text-yellow-600'}`}>
            Использовано {currentUsage} из {limit} {featureName} в этом месяце
          </p>
        </div>
        {planType === 'basic' && (
          <Link to="/pricing">
            <Button size="sm" className="ml-4">
              <Crown className="h-4 w-4 mr-1" />
              Улучшить план
            </Button>
          </Link>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionLimitAlert;
