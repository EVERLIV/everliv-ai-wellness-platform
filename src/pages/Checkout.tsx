
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPaymentSession, applyPromoCode } from '@/services/payment-service';
import { toast } from 'sonner';
import { CreditCard, ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [checkingPromo, setCheckingPromo] = useState(false);
  
  // Plan information from the previous page
  const plan = location.state?.plan;
  
  useEffect(() => {
    if (!plan) {
      navigate('/subscription');
    }
  }, [plan, navigate]);
  
  if (!plan) {
    return null;
  }
  
  const handleApplyPromoCode = async () => {
    if (!promoCode) return;
    
    setCheckingPromo(true);
    try {
      const result = await applyPromoCode(promoCode);
      setIsPromoApplied(result.valid);
      setDiscount(result.discount);
      setPromoMessage(result.message);
      
      if (result.valid) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Ошибка при проверке промокода');
    } finally {
      setCheckingPromo(false);
    }
  };
  
  const calculatePrice = () => {
    if (isPromoApplied && discount > 0) {
      return Math.max(0, plan.price - (plan.price * discount / 100));
    }
    return plan.price;
  };
  
  const handleCheckout = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const session = await createPaymentSession({
        userId: user.id,
        planType: plan.type,
        amount: calculatePrice(),
        currency: 'RUB',
        promoCode: isPromoApplied ? promoCode : undefined,
        isUpgrade: plan.isUpgrade,
        fromPlan: plan.fromPlan
      });
      
      if (session && session.payment_url) {
        // Перенаправляем на страницу оплаты
        window.location.href = session.payment_url;
      } else {
        toast.error('Не удалось создать платежную сессию');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Ошибка при оформлении платежа');
    } finally {
      setIsProcessing(false);
    }
  };

  const planNameDisplay = 
    plan.type === 'basic' ? 'Базовый' : 
    plan.type === 'standard' ? 'Стандарт' : 'Премиум';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/subscription')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="text-xl font-bold mb-4">Оформление подписки</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Промокод</h3>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Введите промокод" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={isPromoApplied || checkingPromo}
                      />
                      <Button 
                        onClick={handleApplyPromoCode} 
                        disabled={!promoCode || isPromoApplied || checkingPromo}
                      >
                        {checkingPromo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isPromoApplied ? 'Применен' : 'Применить'}
                      </Button>
                    </div>
                    {promoMessage && (
                      <p className={`text-sm mt-2 ${isPromoApplied ? 'text-green-600' : 'text-red-600'}`}>
                        {isPromoApplied ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {promoMessage}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            {promoMessage}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Способ оплаты</h3>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                        <div>
                          <p>Система быстрых платежей (СБП)</p>
                          <p className="text-xs text-gray-500">Оплата через СБП Альфа-Банк</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Безопасная оплата через защищенные каналы</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full" 
                    size="lg" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        Оплатить {calculatePrice()} ₽
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold mb-4">Детали заказа</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">План подписки</p>
                    <p className="font-medium">{planNameDisplay}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Период</p>
                    <p className="font-medium">1 месяц</p>
                  </div>
                  
                  {plan.isUpgrade && (
                    <div>
                      <p className="text-sm text-gray-500">Тип обновления</p>
                      <p className="font-medium">
                        Обновление с "{plan.fromPlan === 'basic' ? 'Базовый' : 'Стандарт'}"
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <p className="text-gray-500">Базовая стоимость</p>
                      <p>{plan.price} ₽</p>
                    </div>
                    
                    {isPromoApplied && discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <p>Скидка по промокоду</p>
                        <p>-{(plan.price * discount / 100).toFixed(0)} ₽</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold mt-2 text-lg">
                      <p>Итого к оплате</p>
                      <p>{calculatePrice()} ₽</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
