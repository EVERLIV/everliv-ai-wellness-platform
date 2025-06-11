
import { CheckCircle } from 'lucide-react';
import { Subscription } from '@/types/subscription';

interface CurrentSubscriptionBannerProps {
  subscription: Subscription;
}

const CurrentSubscriptionBanner = ({ subscription }: CurrentSubscriptionBannerProps) => {
  return (
    <div className="mb-8 p-4 bg-evergreen-50 border border-evergreen-200 rounded-lg">
      <h2 className="text-lg font-medium text-evergreen-800">Ваша текущая подписка</h2>
      <div className="flex items-center gap-2 mt-2">
        <CheckCircle className="h-5 w-5 text-evergreen-500" />
        <span>
          План "{subscription.plan_type === 'basic' ? 'Базовый' : 'Премиум'}" 
          активен до {new Date(subscription.expires_at).toLocaleDateString('ru-RU')}
        </span>
      </div>
    </div>
  );
};

export default CurrentSubscriptionBanner;
