
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import SubscriptionHeader from '@/components/subscription/SubscriptionHeader';
import CurrentSubscriptionBanner from '@/components/subscription/CurrentSubscriptionBanner';
import SubscriptionPlansGrid from '@/components/subscription/SubscriptionPlansGrid';
import SubscriptionFooterInfo from '@/components/subscription/SubscriptionFooterInfo';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SubscriptionPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plans');

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Для доступа к подпискам необходимо войти в систему');
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-everliv-600 mx-auto mb-4" />
            <p className="text-sm sm:text-base">Загрузка данных подписки...</p>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow pt-16">
        <SubscriptionHeader />
        
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          {subscription && subscription.status === 'active' && (
            <div className="mb-6 sm:mb-8">
              <CurrentSubscriptionBanner subscription={subscription} />
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-6 sm:mb-8">
              <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg p-1 shadow-sm">
                <TabsTrigger 
                  value="plans" 
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Возможности
                </TabsTrigger>
                <TabsTrigger 
                  value="info" 
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Информация
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Оплата
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="plans" className="mt-0">
              <SubscriptionPlansGrid subscription={subscription} />
            </TabsContent>

            <TabsContent value="info" className="mt-0">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Информация о подписках</h3>
                <div className="space-y-4 text-gray-600">
                  <p>EVERLIV предлагает два типа подписок для различных потребностей:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Базовый план</strong> - идеально подходит для начинающих пользователей</li>
                    <li><strong>Премиум план</strong> - для тех, кто хочет получить максимум от платформы</li>
                  </ul>
                  <p>Все подписки включают доступ к AI-консультациям и персональным рекомендациям.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Способы оплаты</h3>
                <div className="space-y-4 text-gray-600">
                  <p>Мы принимаем следующие способы оплаты:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Банковские карты (Visa, MasterCard, МИР)</li>
                    <li>Электронные кошельки</li>
                    <li>Банковские переводы</li>
                  </ul>
                  <p>Все платежи защищены современными технологиями шифрования.</p>
                  <p className="text-sm text-gray-500 mt-4">
                    При возникновении вопросов по оплате обращайтесь в службу поддержки.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-8 sm:mt-12">
            <SubscriptionFooterInfo />
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default SubscriptionPage;
