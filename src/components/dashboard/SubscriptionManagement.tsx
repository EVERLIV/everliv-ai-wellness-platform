import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { PLAN_FEATURES } from "@/constants/subscription-features";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, CreditCard, ChevronRight, Shield, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const { subscription, isLoading, cancelSubscription, isTrialActive, trialTimeRemaining } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  // Helper function to calculate plan price
  const getPlanPrice = (planType: 'basic' | 'standard' | 'premium') => {
    switch (planType) {
      case 'basic':
        return 790;
      case 'standard':
        return 1490;
      case 'premium':
        return 1990;
      default:
        return 0;
    }
  };

  // Calculate price difference for upgrade (if applicable)
  const calculatePriceDifference = (currentPlan: string, newPlan: 'basic' | 'standard' | 'premium') => {
    if (!currentPlan) return getPlanPrice(newPlan);
    
    const currentPrice = getPlanPrice(currentPlan as 'basic' | 'standard' | 'premium');
    const newPrice = getPlanPrice(newPlan);
    
    return Math.max(0, newPrice - currentPrice);
  };

  const handlePurchase = (planType: 'basic' | 'standard' | 'premium') => {
    navigate('/checkout', {
      state: {
        plan: {
          type: planType,
          name: planType === 'basic' ? 'Базовый' : planType === 'standard' ? 'Стандарт' : 'Премиум',
          price: getPlanPrice(planType),
          period: "месяц",
          annual: false
        }
      }
    });
  };

  const handleUpgrade = (planType: 'basic' | 'standard' | 'premium') => {
    if (!subscription) return;
    
    const priceDifference = calculatePriceDifference(subscription.plan_type, planType);
    
    navigate('/checkout', {
      state: {
        plan: {
          type: planType,
          name: planType === 'basic' ? 'Базовый' : planType === 'standard' ? 'Стандарт' : 'Премиум',
          price: priceDifference,
          period: "месяц",
          annual: false,
          isUpgrade: true,
          fromPlan: subscription.plan_type
        }
      }
    });
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await cancelSubscription();
      toast.success("Подписка успешно отменена. Вы сможете пользоваться услугами до конца оплаченного периода.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Trial status indicator */}
      {isTrialActive && !subscription && (
        <Card className="border-everliv-600 mb-8">
          <CardHeader className="pb-3 bg-everliv-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-everliv-600" />
                Пробный период
              </CardTitle>
              <Badge variant="outline" className="bg-everliv-600/10 text-everliv-700 border-everliv-300">
                Активен
              </Badge>
            </div>
            <CardDescription>
              У вас есть полный доступ ко всем функциям платформы
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Осталось времени:</p>
                <p className="text-xl font-bold">{trialTimeRemaining}</p>
              </div>
              <Button onClick={() => navigate('/pricing')}>
                Выбрать тарифный план
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <h2 className="text-2xl font-bold">Управление подпиской</h2>
      
      {subscription ? (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Текущая подписка: {subscription.plan_type === 'basic' ? 'Базовый' : 
                                  subscription.plan_type === 'standard' ? 'Стандарт' : 'Премиум'}
                  <Badge className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {subscription.status === 'active' ? 'Активна' : 'Отменена'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Пользуйтесь всеми возможностями вашего плана
                </CardDescription>
              </div>
              {subscription.status === 'active' && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Следующий платеж:</p>
                  <p className="font-medium">{format(new Date(subscription.expires_at), 'dd.MM.yyyy')}</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Информация</TabsTrigger>
                <TabsTrigger value="features">Возможности</TabsTrigger>
                <TabsTrigger value="payment">Оплата</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Дата начала:</p>
                      <p className="font-medium">{format(new Date(subscription.started_at), 'dd.MM.yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Дата окончания:</p>
                      <p className="font-medium">{format(new Date(subscription.expires_at), 'dd.MM.yyyy')}</p>
                    </div>
                  </div>
                  
                  {subscription.status === 'active' ? (
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <p className="text-sm">
                          Ваша подписка активна и будет автоматически продлена 
                          {format(new Date(subscription.expires_at), 'dd.MM.yyyy')}. 
                          Вы можете отменить автоматическое продление в любое время.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-amber-50 border-amber-200">
                      <CardContent className="p-4">
                        <p className="text-sm text-amber-800">
                          Ваша подписка отменена и закончится {format(new Date(subscription.expires_at), 'dd.MM.yyyy')}. 
                          До этой даты вы можете продолжать пользоваться всеми возможностями плана.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="features">
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Доступные функции вашего плана:</h4>
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
                        <div>
                          <span>{feature.name}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {subscription.plan_type !== 'premium' && (
                  <Card className="bg-gray-50 border-gray-200 mt-4">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Хотите больше возможностей?</h4>
                        <p className="text-sm text-gray-500">Улучшите свой план для доступа ко всем функциям</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="flex items-center"
                        onClick={() => handleUpgrade('premium')}
                        disabled={isProcessing}
                      >
                        Улучшить <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="payment">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Способ оплаты</h4>
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-gray-400" />
                          <div>
                            <p>Система быстрых платежей (СБП)</p>
                            <p className="text-xs text-gray-500">Будет доступно при оплате</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Безопасная оплата через защищенные каналы</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3 border-t pt-4">
            {subscription.status === 'active' && (
              <>
                {subscription.plan_type !== 'premium' && (
                  <Button 
                    onClick={() => handleUpgrade('premium')} 
                    disabled={isProcessing}
                    className="flex items-center gap-1"
                  >
                    <CreditCard className="h-4 w-4" />
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
                className="flex items-center gap-1"
              >
                <CreditCard className="h-4 w-4" />
                Возобновить подписку
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Basic Plan */}
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
                className="w-full flex items-center gap-1" 
                onClick={() => handlePurchase('basic')}
                disabled={isProcessing}
              >
                <CreditCard className="h-4 w-4" />
                Выбрать Базовый
              </Button>
            </CardFooter>
          </Card>
          
          {/* Standard Plan */}
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
                className="w-full bg-everliv-600 hover:bg-everliv-700 flex items-center gap-1" 
                onClick={() => handlePurchase('standard')}
                disabled={isProcessing}
              >
                <CreditCard className="h-4 w-4" />
                Выбрать Стандарт
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
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
                className="w-full flex items-center gap-1" 
                onClick={() => handlePurchase('premium')}
                disabled={isProcessing}
              >
                <CreditCard className="h-4 w-4" />
                Выбрать Премиум
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Trial information section with improved visibility */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="bg-everliv-100 p-2 rounded-full">
            <Clock className="h-6 w-6 text-everliv-600" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">Пробный доступ к функциям</h3>
            <p className="text-gray-600 mb-4">
              Без активной подписки вы можете попробовать каждую функцию нашего сервиса один раз.
              После использования пробной версии, для продолжения работы с функцией потребуется подписка.
            </p>
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={() => navigate('/pricing')}
            >
              Ознакомиться с тарифами
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
