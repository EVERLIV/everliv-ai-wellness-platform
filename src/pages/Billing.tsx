
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Crown, Calendar, DollarSign } from "lucide-react";

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, isLoading } = useSubscription();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getPlanPrice = (planType: string) => {
    switch (planType) {
      case 'premium':
        return '2,990 ₽/мес';
      case 'standard':
        return '1,990 ₽/мес';
      case 'basic':
        return '990 ₽/мес';
      default:
        return 'Не указано';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Оплата и подписка</h1>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">Загрузка информации о подписке...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {/* Текущая подписка */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Текущая подписка
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {subscription && subscription.status === 'active' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Crown className="h-6 w-6 text-amber-600" />
                          <div>
                            <h3 className="font-semibold capitalize text-lg">{subscription.plan_type}</h3>
                            <p className="text-sm text-gray-600">{getPlanPrice(subscription.plan_type)}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          Активна
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Следующее списание</p>
                            <p className="font-medium">{formatDate(subscription.expires_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Стоимость</p>
                            <p className="font-medium">{getPlanPrice(subscription.plan_type)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/pricing')}
                          className="flex-1"
                        >
                          Изменить план
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                        >
                          Отменить подписку
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Crown className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Нет активной подписки</h3>
                      <p className="text-gray-600 mb-4">
                        Выберите подходящий план для получения полного доступа к функциям EVERLIV
                      </p>
                      <Button onClick={() => navigate('/pricing')}>
                        Выбрать план
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* История платежей */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    История платежей
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">История платежей пока пуста</p>
                  </div>
                </CardContent>
              </Card>

              {/* Доступные планы */}
              <Card>
                <CardHeader>
                  <CardTitle>Доступные планы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold">Базовый</h4>
                      <p className="text-2xl font-bold text-primary">990 ₽<span className="text-sm font-normal">/мес</span></p>
                      <p className="text-sm text-gray-600 mt-2">Основные функции</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold">Стандарт</h4>
                      <p className="text-2xl font-bold text-primary">1,990 ₽<span className="text-sm font-normal">/мес</span></p>
                      <p className="text-sm text-gray-600 mt-2">Расширенные возможности</p>
                    </div>
                    <div className="border rounded-lg p-4 border-amber-300 bg-amber-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-4 w-4 text-amber-600" />
                        <h4 className="font-semibold">Премиум</h4>
                      </div>
                      <p className="text-2xl font-bold text-primary">2,990 ₽<span className="text-sm font-normal">/мес</span></p>
                      <p className="text-sm text-gray-600 mt-2">Полный доступ</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/pricing')} 
                    className="w-full mt-4"
                  >
                    Посмотреть все планы
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default Billing;
