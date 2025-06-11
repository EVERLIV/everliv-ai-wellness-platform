
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Для доступа к подпискам необходимо войти в систему');
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking auth and subscription
  if (authLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-everliv-600 mx-auto mb-4" />
            <p>Загрузка данных подписки...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // After loading, if still no user, don't render anything
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-16 bg-gray-50">
        <SubscriptionHeader />
        
        <div className="container mx-auto px-4">
          {subscription && subscription.status === 'active' && (
            <CurrentSubscriptionBanner subscription={subscription} />
          )}
          
          <SubscriptionPlansGrid subscription={subscription} />
          <SubscriptionFooterInfo />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
