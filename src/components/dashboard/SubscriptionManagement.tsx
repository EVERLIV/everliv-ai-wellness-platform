
import { useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { PLAN_FEATURES } from "@/constants/subscription-features";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const SubscriptionManagement = () => {
  const { subscription, isLoading, purchaseSubscription, cancelSubscription, upgradeSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  const handlePurchase = async (planType: 'basic' | 'standard' | 'premium') => {
    setIsProcessing(true);
    try {
      await purchaseSubscription(planType);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async (planType: 'basic' | 'standard' | 'premium') => {
    setIsProcessing(true);
    try {
      await upgradeSubscription(planType);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await cancelSubscription();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление подпиской</h2>
      
      {subscription ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Текущая подписка: {subscription.plan_type === 'basic' ? 'Базовый' : 
                               subscription.plan_type === 'standard' ? 'Стандарт' : 'Премиум'}
            </CardTitle>
            <CardDescription>
              Статус: {subscription.status === 'active' ? (
                <span className="text-evergreen-500 inline-flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Активна
                </span>
              ) : (
                <span className="text-yellow-500 inline-flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> Отменена
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-gray-500">Дата начала:</p>
                <p className="font-medium">{format(new Date(subscription.started_at), 'dd.MM.yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Дата окончания:</p>
                <p className="font-medium">{format(new Date(subscription.expires_at), 'dd.MM.yyyy')}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Доступные функции:</h4>
                <ul className="space-y-2">
                  {Object.entries(PLAN_FEATURES).map(([key, feature]) => (
                    <li key={key} className={`flex items-start gap-2 ${
                      feature.includedIn[subscription.plan_type as 'basic' | 'standard' | 'premium'] 
                        ? 'text-gray-800' 
                        : 'text-gray-400'
                    }`}>
                      {feature.includedIn[subscription.plan_type as 'basic' | 'standard' | 'premium'] ? (
                        <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                      )}
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            {subscription.status === 'active' && (
              <>
                {subscription.plan_type !== 'premium' && (
                  <Button 
                    onClick={() => handleUpgrade('premium')} 
                    disabled={isProcessing}
                  >
                    Обновить до Премиум
                  </Button>
                )}
                {subscription.plan_type === 'basic' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleUpgrade('standard')} 
                    disabled={isProcessing}
                  >
                    Обновить до Стандарт
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  Отменить подписку
                </Button>
              </>
            )}
            
            {subscription.status !== 'active' && (
              <Button 
                onClick={() => handlePurchase(subscription.plan_type as 'basic' | 'standard' | 'premium')} 
                disabled={isProcessing}
              >
                Возобновить подписку
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Базовый</CardTitle>
              <CardDescription>790 ₽/месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(PLAN_FEATURES).map(([key, feature]) => (
                  <li key={key} className={`flex items-start gap-2 ${
                    feature.includedIn.basic ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {feature.includedIn.basic ? (
                      <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                    )}
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePurchase('basic')}
                disabled={isProcessing}
              >
                Выбрать Базовый
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-everliv-600 ring-2 ring-everliv-600/20 relative">
            <div className="bg-everliv-600 text-white text-xs font-semibold px-3 py-1 absolute right-0 top-0 rounded-bl">
              Популярный выбор
            </div>
            <CardHeader>
              <CardTitle>Стандарт</CardTitle>
              <CardDescription>1490 ₽/месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(PLAN_FEATURES).map(([key, feature]) => (
                  <li key={key} className={`flex items-start gap-2 ${
                    feature.includedIn.standard ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {feature.includedIn.standard ? (
                      <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                    )}
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-everliv-600 hover:bg-everliv-700" 
                onClick={() => handlePurchase('standard')}
                disabled={isProcessing}
              >
                Выбрать Стандарт
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Премиум</CardTitle>
              <CardDescription>1990 ₽/месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(PLAN_FEATURES).map(([key, feature]) => (
                  <li key={key} className={`flex items-start gap-2 ${
                    feature.includedIn.premium ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {feature.includedIn.premium ? (
                      <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                    )}
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePurchase('premium')}
                disabled={isProcessing}
              >
                Выбрать Премиум
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-everliv-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Пробный доступ к функциям</h3>
            <p className="text-sm text-gray-600 mt-1">
              Без активной подписки вы можете попробовать каждую функцию нашего сервиса один раз.
              После использования пробной версии, для продолжения работы с функцией потребуется подписка.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
