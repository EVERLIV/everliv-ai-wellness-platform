
import React, { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, Bug, Eye, EyeOff } from 'lucide-react';

const SubscriptionDebugPanel = () => {
  const { user } = useAuth();
  const { 
    subscription, 
    isLoading, 
    isPremiumActive, 
    currentPlan, 
    hasActiveSubscription,
    forceRefreshSubscription,
    debugInfo,
    getCurrentPlanType
  } = useSubscription();
  
  const [isVisible, setIsVisible] = useState(false);

  if (!user || process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
        >
          <Bug className="h-4 w-4 mr-1" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Card className="bg-red-50 border-red-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-red-800 flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Subscription Debug
            </CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-600"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">User:</span>
              <p className="text-red-700">{user.email}</p>
            </div>
            <div>
              <span className="font-medium">Plan:</span>
              <Badge variant={isPremiumActive ? "default" : "secondary"} className="text-xs">
                {currentPlan}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Loading:</span>
              <span className={isLoading ? "text-yellow-600" : "text-green-600"}>
                {isLoading ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Premium Active:</span>
              <span className={isPremiumActive ? "text-green-600" : "text-red-600"}>
                {isPremiumActive ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Has Active Sub:</span>
              <span className={hasActiveSubscription ? "text-green-600" : "text-red-600"}>
                {hasActiveSubscription ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Plan Type:</span>
              <span className="font-mono">{getCurrentPlanType()}</span>
            </div>
          </div>

          {subscription && (
            <div className="bg-red-100 p-2 rounded text-xs">
              <div className="font-medium">Subscription:</div>
              <div>ID: {subscription.id.slice(0, 8)}...</div>
              <div>Status: {subscription.status}</div>
              <div>Type: {subscription.plan_type}</div>
              <div>Expires: {new Date(subscription.expires_at).toLocaleString()}</div>
            </div>
          )}

          {debugInfo && Object.keys(debugInfo).length > 0 && (
            <div className="bg-red-100 p-2 rounded text-xs">
              <div className="font-medium">Debug Info:</div>
              <pre className="text-xs overflow-auto max-h-20">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={forceRefreshSubscription}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              disabled={isLoading}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button
              onClick={() => console.log('SUBSCRIPTION DEBUG:', {
                user,
                subscription,
                isPremiumActive,
                currentPlan,
                debugInfo
              })}
              variant="outline"
              size="sm"
              className="text-xs h-7"
            >
              <Eye className="h-3 w-3 mr-1" />
              Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionDebugPanel;
