
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LockIcon, Clock } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface RestrictedServicePlaceholderProps {
  serviceName: string;
  description?: string;
}

const RestrictedServicePlaceholder = ({ 
  serviceName, 
  description 
}: RestrictedServicePlaceholderProps) => {
  const navigate = useNavigate();
  const { isTrialActive, trialTimeRemaining } = useSubscription();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <LockIcon className="h-8 w-8 text-primary" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{serviceName}</h1>
              
              <p className="text-gray-600 mb-8">
                {description || 'Для доступа к этому сервису необходимо зарегистрироваться. После регистрации вы получите бесплатный доступ на 24 часа ко всем функциям платформы.'}
              </p>

              {isTrialActive ? (
                <div className="bg-primary/5 p-4 rounded-lg mb-8 max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">Ваш пробный период активен</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    У вас есть доступ к этому сервису в течение пробного периода. Осталось: {trialTimeRemaining}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/signup')}
                    className="min-w-[180px]"
                  >
                    Начать бесплатно
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/login')} 
                    className="min-w-[180px]"
                  >
                    Войти
                  </Button>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg max-w-md">
                <h3 className="font-medium mb-2">Что вы получите:</h3>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Полный доступ ко всем функциям платформы на 24 часа</li>
                  <li>• Возможность тестирования всех сервисов</li>
                  <li>• Персонализированные рекомендации по здоровью</li>
                  <li>• Доступ к эксклюзивным материалам и вебинарам</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestrictedServicePlaceholder;
