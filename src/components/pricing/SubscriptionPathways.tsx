
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, CalendarCheck, CreditCard, Settings } from 'lucide-react';
import { useSubscription } from "@/contexts/SubscriptionContext";

/**
 * Component that shows the user their current position in the subscription journey
 * and provides clear paths for next steps
 */
export default function SubscriptionPathways() {
  const navigate = useNavigate();
  const { subscription, isTrialActive, trialTimeRemaining } = useSubscription();
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Управление подпиской</h2>
      
      {isTrialActive && (
        <Card className="border-everliv-600">
          <CardHeader className="bg-everliv-50">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-everliv-600" />
              Пробный период активен
            </CardTitle>
            <CardDescription>
              У вас есть доступ ко всем функциям платформы в течение пробного периода
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Осталось времени:</p>
                <p className="font-bold text-lg">{trialTimeRemaining}</p>
              </div>
              <Button onClick={() => navigate('/pricing')}>
                Выбрать тарифный план
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-everliv-600" />
                Выбрать тариф
              </CardTitle>
              <CardDescription>
                Ознакомьтесь с доступными тарифными планами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Выберите подходящий тариф для доступа ко всем функциям платформы
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full flex items-center justify-center gap-1"
                onClick={() => navigate('/pricing')}
              >
                Выбрать план
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {subscription ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-everliv-600" />
                  Управление тарифом
                </CardTitle>
                <CardDescription>
                  Ваш текущий тариф: <span className="font-medium">
                    {subscription.plan_type === 'basic' ? 'Базовый' : 
                     'Премиум'}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Вы можете изменить текущий тарифный план или управлять своей подпиской
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/dashboard/subscription')}
                >
                  Управление тарифом
                </Button>
              </CardFooter>
            </Card>
            
            {subscription.plan_type !== 'premium' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-everliv-600" />
                    Улучшить тариф
                  </CardTitle>
                  <CardDescription>
                    Получите доступ к расширенным возможностям
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Перейдите на более высокий тариф для доступа к дополнительным функциям
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/dashboard/subscription')}
                    variant="outline"
                  >
                    Улучшить до Премиум
                  </Button>
                </CardFooter>
              </Card>
            )}
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-everliv-600" />
                  Оформление оплаты
                </CardTitle>
                <CardDescription>
                  Безопасная оплата через Альфа-Банк
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Поддерживаются карты VISA, MasterCard, МИР. Безопасное соединение.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                >
                  К выбору тарифа
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
