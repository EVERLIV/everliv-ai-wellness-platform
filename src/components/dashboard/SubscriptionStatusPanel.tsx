
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, CreditCard, ArrowRight } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const SubscriptionStatusPanel = () => {
  const { subscription, isLoading, isTrialActive, trialTimeRemaining } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get plan name in Russian
  const getPlanName = (planType: string | undefined) => {
    switch(planType) {
      case 'basic': return 'Базовый';
      case 'standard': return 'Стандарт';
      case 'premium': return 'Премиум';
      default: return 'Нет подписки';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Статус подписки</CardTitle>
          {isTrialActive && (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
              Пробный период ({trialTimeRemaining})
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {subscription && subscription.status === 'active' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-evergreen-500" />
              <span className="font-medium">
                План "{getPlanName(subscription.plan_type)}" активен
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Действует до {format(new Date(subscription.expires_at), 'dd.MM.yyyy')}
            </p>
          </div>
        ) : isTrialActive ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Пробный период</span>
            </div>
            <p className="text-gray-600 text-sm">
              Вы можете попробовать все функции в течение пробного периода.
              После его окончания выберите подходящий тарифный план для продолжения.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <span className="font-medium">Нет активной подписки</span>
            </div>
            <p className="text-gray-600 text-sm">
              Для доступа ко всем функциям оформите подписку на один из тарифных планов.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          onClick={() => navigate('/subscription')} 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
        >
          {subscription && subscription.status === 'active' ? (
            <>
              <CreditCard className="h-4 w-4" />
              Управление подпиской
            </>
          ) : (
            <>
              Выбрать тарифный план
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionStatusPanel;
