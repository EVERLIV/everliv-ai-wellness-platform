
import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CreditCard, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Checkout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Get plan from location state or use default
  const plan = location.state?.plan || {
    name: "Стандарт",
    price: 1990,
    period: "месяц",
    annual: false
  };
  
  // Process payment (simulation)
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment process
    setTimeout(() => {
      setLoading(false);
      setOrderComplete(true);
      toast.success("Оплата прошла успешно!");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <Link to="/pricing" className="flex items-center text-gray-600 hover:text-everliv-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад к тарифам
          </Link>
          
          <h1 className="text-3xl font-bold mb-6">Оформление подписки</h1>
          
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
                  Спасибо за подписку на тариф {plan.name}! Ваш доступ активирован.
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
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Оплата</h2>
                    <form onSubmit={handlePayment}>
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Способ оплаты</label>
                        <div className="flex items-center justify-between bg-white border border-gray-200 rounded p-3">
                          <div className="flex items-center">
                            <input type="radio" checked readOnly />
                            <span className="ml-2">Банковская карта</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-blue-600 font-bold px-2 py-0.5 text-xs rounded">VISA</div>
                            <div className="text-red-600 font-bold px-2 py-0.5 text-xs rounded">MasterCard</div>
                            <div className="bg-blue-900 text-white px-2 py-0.5 text-xs rounded font-bold">МИР</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Номер карты</label>
                        <Input placeholder="0000 0000 0000 0000" required />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Срок действия</label>
                          <Input placeholder="MM/YY" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">CVV/CVC</label>
                          <Input placeholder="000" required type="password" maxLength={3} />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Имя на карте</label>
                        <Input placeholder="IVAN IVANOV" required />
                      </div>
                      
                      <div className="flex items-start mb-6">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          className="mt-1 mr-2"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                          Я согласен с <Link to="/payment-info" className="text-everliv-600 hover:underline">правилами оплаты</Link> и даю разрешение на обработку моих персональных данных в соответствии с <Link to="/privacy" className="text-everliv-600 hover:underline">политикой конфиденциальности</Link>
                        </label>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Обработка..." : `Оплатить ${plan.price} ₽`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="sticky top-24">
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold mb-4">Тариф "{plan.name}"</h2>
                    <p className="text-3xl font-bold mb-2">{plan.price} ₽</p>
                    <p className="text-gray-600 mb-4">за {plan.annual ? "год" : plan.period}</p>
                    
                    <div className="border-t pt-4 mb-4">
                      <h3 className="font-medium mb-2">Что включено:</h3>
                      <ul className="space-y-2">
                        {plan.name === "Базовый" && (
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
                        )}
                        
                        {plan.name === "Стандарт" && (
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
                        )}
                        
                        {plan.name === "Премиум" && (
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
                </Card>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-sm text-gray-500 text-center">
            <p>
              Нажимая кнопку «Оплатить», вы соглашаетесь с <Link to="/payment-info" className="text-everliv-600 hover:underline">условиями оплаты</Link> и <Link to="/payment-info" className="text-everliv-600 hover:underline">правилами возврата</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
