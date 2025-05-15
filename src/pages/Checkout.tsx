
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CreditCard, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, purchaseSubscription, upgradeSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get plan from location state or use default
  const plan = location.state?.plan || {
    name: "Стандарт",
    price: 1990,
    period: "месяц",
    annual: false
  };

  // Redirect to pricing if no plan is selected
  useEffect(() => {
    if (!location.state?.plan) {
      navigate('/pricing');
    }
  }, [location.state, navigate]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!paymentDetails.cardNumber.trim() || !/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Введите корректный 16-значный номер карты';
    }
    
    if (!paymentDetails.expiryDate.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Введите дату в формате MM/YY';
    }
    
    if (!paymentDetails.cvv.trim() || !/^\d{3}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = 'Введите 3-значный CVV код';
    }
    
    if (!paymentDetails.cardHolder.trim()) {
      newErrors.cardHolder = 'Введите имя держателя карты';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'Необходимо согласиться с условиями';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Process payment (simulated)
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle subscription based on whether it's new or upgrade
      if (plan.isUpgrade) {
        await upgradeSubscription(plan.type as 'basic' | 'standard' | 'premium');
      } else {
        await purchaseSubscription(plan.type as 'basic' | 'standard' | 'premium');
      }
      
      setOrderComplete(true);
      toast.success(plan.isUpgrade ? "Тариф успешно обновлен!" : "Подписка успешно оформлена!");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Произошла ошибка при обработке платежа. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
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
                    <CardTitle>Оплата</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                        <Input 
                          placeholder="0000 0000 0000 0000" 
                          name="cardNumber"
                          value={formatCardNumber(paymentDetails.cardNumber)}
                          onChange={handleInputChange}
                          className={errors.cardNumber ? "border-red-500" : ""}
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Срок действия</label>
                          <Input 
                            placeholder="MM/YY" 
                            name="expiryDate"
                            value={paymentDetails.expiryDate}
                            onChange={handleInputChange}
                            className={errors.expiryDate ? "border-red-500" : ""}
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">CVV/CVC</label>
                          <Input 
                            placeholder="000" 
                            type="password" 
                            name="cvv"
                            value={paymentDetails.cvv}
                            onChange={handleInputChange}
                            className={errors.cvv ? "border-red-500" : ""}
                            maxLength={3}
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Имя на карте</label>
                        <Input 
                          placeholder="IVAN IVANOV" 
                          name="cardHolder"
                          value={paymentDetails.cardHolder}
                          onChange={handleInputChange}
                          className={errors.cardHolder ? "border-red-500" : ""}
                        />
                        {errors.cardHolder && (
                          <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
                        )}
                      </div>
                      
                      <div className="flex items-start mb-6">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={() => setAgreeToTerms(!agreeToTerms)}
                          className={`mt-1 mr-2 ${errors.terms ? "ring-2 ring-red-500" : ""}`}
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                          Я согласен с <Link to="/payment-info" className="text-everliv-600 hover:underline">правилами оплаты</Link> и даю разрешение на обработку моих персональных данных в соответствии с <Link to="/privacy" className="text-everliv-600 hover:underline">политикой конфиденциальности</Link>
                        </label>
                      </div>
                      {errors.terms && (
                        <p className="text-red-500 text-xs mb-4">{errors.terms}</p>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                      >
                        {loading ? "Обработка..." : `Оплатить ${plan.price} ₽`}
                      </Button>
                    </form>
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
              Нажимая кнопку «Оплатить», вы соглашаетесь с <Link to="/payment-info" className="text-everliv-600 hover:underline">условиями оплаты</Link> и <Link to="/privacy" className="text-everliv-600 hover:underline">политикой конфиденциальности</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
