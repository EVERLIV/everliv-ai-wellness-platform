
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
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">Загрузка данных подписки...</p>
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
    <div className="min-h-screen flex flex-col bg-background">
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
              <TabsList className="grid w-full grid-cols-3 bg-card rounded-lg p-1 shadow-sm max-w-md mx-auto sm:max-w-full">
                <TabsTrigger 
                  value="plans" 
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <span className="hidden sm:inline">Возможности</span>
                  <span className="sm:hidden">План</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="info" 
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <span className="hidden sm:inline">Информация</span>
                  <span className="sm:hidden">Инфо</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Оплата
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="plans" className="mt-0">
              <SubscriptionPlansGrid subscription={subscription} />
            </TabsContent>

            <TabsContent value="info" className="mt-0">
              <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">О подписках EVERLIV</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-sm sm:text-base">
                    EVERLIV предлагает революционный подход к управлению здоровьем с помощью искусственного интеллекта и персонализированной медицины.
                  </p>
                  
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-foreground mb-2">🆓 Базовый план (бесплатно)</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>1 анализ крови в месяц с AI-интерпретацией</li>
                      <li>99 сообщений с базовым AI-доктором</li>
                      <li>Ведение дневника питания</li>
                      <li>Базовые рекомендации по здоровью</li>
                    </ul>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-2">⭐ Премиум план (999₽/месяц)</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>15 анализов крови в месяц с расширенной AI-интерпретацией</li>
                      <li>199 сообщений с персональным AI-доктором</li>
                      <li>Полный профиль здоровья с историей</li>
                      <li>Расширенная аналитика и тренды здоровья</li>
                      <li>Персонализированные протоколы оздоровления</li>
                      <li>Приоритетная поддержка</li>
                    </ul>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">🎁 Пробный период</h4>
                    <p className="text-sm text-amber-700">
                      Новые пользователи получают 24 часа бесплатного доступа ко всем премиум-функциям для ознакомления с возможностями платформы.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Способы оплаты и условия</h3>
                <div className="space-y-6 text-muted-foreground">
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">💳 Принимаемые способы оплаты:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                      <li><strong>Банковские карты:</strong> Visa, MasterCard, МИР</li>
                      <li><strong>Электронные кошельки:</strong> ЮMoney, QIWI, WebMoney</li>
                      <li><strong>Мобильные платежи:</strong> Apple Pay, Google Pay, Samsung Pay</li>
                      <li><strong>Банковские переводы</strong> для корпоративных клиентов</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">🔒 Безопасность платежей</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• SSL-шифрование и PCI DSS сертификация</li>
                      <li>• Обработка платежей через PayKeeper</li>
                      <li>• Данные карт не хранятся на наших серверах</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">📋 Условия подписки:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                      <li>Автоматическое продление каждый месяц</li>
                      <li>Отмена подписки в любое время без штрафов</li>
                      <li>Возврат средств в течение 14 дней согласно политике возврата</li>
                      <li>НДС включен в стоимость подписки</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📞 Поддержка</h4>
                    <p className="text-sm text-blue-700">
                      При возникновении вопросов по оплате или подписке обращайтесь в службу поддержки через чат на сайте или на почту support@everliv.ru
                    </p>
                  </div>
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
