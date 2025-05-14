
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { checkPaymentStatus } from '@/services/payment-service';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const paymentId = searchParams.get('orderId');
  
  useEffect(() => {
    const checkStatus = async () => {
      if (!paymentId) {
        setStatus('failure');
        return;
      }
      
      try {
        const result = await checkPaymentStatus(paymentId);
        if (result === 'completed') {
          setStatus('success');
        } else {
          setStatus('failure');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('failure');
      }
    };
    
    checkStatus();
  }, [paymentId]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="p-6 bg-white shadow-md">
            {status === 'loading' && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Обработка платежа</h2>
                <p className="text-gray-500 mb-6">
                  Пожалуйста, подождите, мы проверяем статус вашего платежа...
                </p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Оплата прошла успешно!</h2>
                <p className="text-gray-500 mb-6">
                  Ваша подписка успешно активирована. Теперь вы можете пользоваться всеми возможностями выбранного плана.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/dashboard')}>
                    Перейти в личный кабинет
                  </Button>
                </div>
              </div>
            )}
            
            {status === 'failure' && (
              <div className="text-center py-12">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ошибка при оплате</h2>
                <p className="text-gray-500 mb-6">
                  К сожалению, произошла ошибка при обработке вашего платежа. Пожалуйста, попробуйте еще раз или выберите другой способ оплаты.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate('/subscription')}>
                    Вернуться к выбору подписки
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentStatus;
