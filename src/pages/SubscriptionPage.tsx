
import React, { useEffect } from 'react';
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

const SubscriptionPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();

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
          
          <SubscriptionPlansGrid subscription={subscription} />
          
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
