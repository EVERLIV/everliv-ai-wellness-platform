import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check, ArrowLeft, AlertCircle, CreditCard } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { subscription, refetch } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Check if user returned from payment
  const paymentSuccess = searchParams.get('payment') === 'success';
  const paymentCanceled = searchParams.get('payment') === 'canceled';
  
  // Get plan from location state or use default
  const plan = location.state?.plan || {
    name: "Стандарт",
    price: 1990,
    period: "месяц",
    annual: false
  };

  // Check for payment status on component mount
  useEffect(() => {
    if (paymentSuccess) {
      setOrderComplete(true);
      toast.success('Оплата прошла успешно!');
      // Refresh subscription data
      if (refetch) {
        refetch();
      }
    } else if (paymentCanceled) {
      toast.info('Оплата была отменена');
    }
  }, [paymentSuccess, paymentCanceled, refetch]);

  // Redirect to pricing if no plan is selected
  useEffect(() => {
    if (!location.state?.plan && !paymentSuccess && !paymentCanceled) {
      navigate('/pricing');
    }
  }, [location.state, navigate, paymentSuccess, paymentCanceled]);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    setLoading(true);
    
    try {
      // Create invoice through PayKeeper API
      const { data: invoiceData, error } = await supabase.functions.invoke('create-paykeeper-invoice', {
        body: {
          userId: user.id,
          planType: plan.type,
          amount: plan.price,
          description: `Подписка ${plan.name} - EVERLIV`
        }
      });

      if (error) {
        console.error('Error creating invoice:', error);
        throw new Error('Ошибка создания счета для оплаты');
      }

      if (!invoiceData.success) {
        throw new Error(invoiceData.error || 'Ошибка создания счета для оплаты');
      }

      console.log('Invoice created:', invoiceData);

      // Redirect to payment URL
      if (invoiceData.payment_url) {
        // Store current plan info for return
        sessionStorage.setItem('checkout_plan', JSON.stringify(plan));
        
        // Redirect to PayKeeper payment page
        window.location.href = invoiceData.payment_url;
      } else {
        throw new Error('Не получена ссылка для оплаты');
      }

    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Произошла ошибка при создании счета для оплаты");
      setLoading(false);
    }
  };

  // If returning from payment, restore plan info
  useEffect(() => {
    if ((paymentSuccess || paymentCanceled) && !location.state?.plan) {
      const storedPlan = sessionStorage.getItem('checkout_plan');
      if (storedPlan) {
        try {
          const planData = JSON.parse(storedPlan);
          // Update location state or handle plan display
          sessionStorage.removeItem('checkout_plan');
        } catch (e) {
          console.error('Error parsing stored plan:', e);
        }
      }
    }
  }, [paymentSuccess, paymentCanceled, location.state]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <Link to="/pricing" className="flex items-center text-gray-600 hover:text-everliv-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад к тарифам
          </Link>
          
          <h1 className="text-3xl font-bold mb-6">
            {plan.isUpgrade 
              ? `Улучшение плана с ${plan.fromPlan === 'basic' ? 'Базовый' : plan.fromPlan === 'standard' ? 'Стандарт' : 'Премиум'} до ${plan.name}`
              : 'Оформление подписки'}
          </h1>
          
          {orderComplete ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Оплата прошла успешно</h2>
                <p className="mb-6 text-gray-600">
                  {plan.isUpgrade 
                    ? `Спасибо за улучшение плана до ${plan.name}! Ваш доступ активирован.`
                    : `Спасибо за подписку на тариф ${plan.name}! Ваш доступ активирован.`}
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/dashboard">
                    <Button>Перейти к личному кабинету</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Информация о заказе</h2>
                    <div className="border-b pb-4 mb-4">
                      <p className="flex justify-between">
                        <span>Тариф:</span> 
                        <span className="font-medium">{plan.name}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Период:</span> 
                        <span className="font-medium">{plan.annual ? "Год" : "Месяц"}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Стоимость:</span> 
                        <span className="font-medium">{plan.price} ₽</span>
                      </p>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Итого:</span>
                      <span>{plan.price} ₽</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Оплата через PayKeeper</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded p-4">
                        <div className="flex items-center">
                          <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                          <span>Банковские карты и электронные кошельки</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-blue-600 font-bold px-2 py-0.5 text-xs rounded">VISA</div>
                          <div className="text-red-600 font-bold px-2 py-0.5 text-xs rounded">MC</div>
                          <div className="bg-blue-900 text-white px-2 py-0.5 text-xs rounded font-bold">МИР</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium mb-2">Безопасная оплата</h3>
                      <p className="text-sm text-gray-600">
                        Оплата происходит через защищенный сервис Альфа-Банка. 
                        Мы не храним данные ваших карт.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handlePayment}
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? "Обработка..." : `Перейти к оплате ${plan.price} ₽`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Тариф "{plan.name}"</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-3xl font-bold mb-2">{plan.price} ₽</p>
                    <p className="text-gray-600 mb-4">за {plan.annual ? "год" : plan.period}</p>
                    
                    <div className="border-t pt-4 mb-4">
                      <h3 className="font-medium mb-2">Что включено:</h3>
                      <ul className="space-y-2">
                        {plan.type === "basic" ? (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Базовый анализ здоровья</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Интерпретация до 5 показателей</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Еженедельные отчеты</span>
                            </li>
                          </>
                        ) : plan.type === "standard" ? (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Расширенный анализ здоровья</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Интерпретация до 15 показателей</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Персонализированные планы</span>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Полный анализ здоровья</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Интерпретация всех показателей</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>VIP поддержка от экспертов</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Shield className="h-4 w-4" />
                      <span>Безопасный платеж через Альфа-Банк</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t pt-4 flex flex-col text-center">
                    <div className="flex items-center justify-center mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-sm text-gray-600">Вы всегда можете изменить или отменить подписку</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-sm text-gray-500 text-center">
            <p>
              Нажимая кнопку «Перейти к оплате», вы соглашаетесь с <Link to="/payment-info" className="text-everliv-600 hover:underline">условиями оплаты</Link> и <Link to="/privacy" className="text-everliv-600 hover:underline">политикой конфиденциальности</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
