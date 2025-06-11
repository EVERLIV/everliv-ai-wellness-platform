
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { toast } from 'sonner';

interface SubscriptionPlansGridProps {
  subscription: Subscription | null;
}

const SubscriptionPlansGrid = ({ subscription }: SubscriptionPlansGridProps) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planType: string) => {
    setSelectedPlan(planType);
    if (subscription?.plan_type === planType && subscription?.status === 'active') {
      toast.info('У вас уже есть активная подписка на этот план');
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        plan: { type: planType } 
      } 
    });
  };

  const plans = [
    {
      type: "basic",
      name: "Базовый",
      price: "990 ₽",
      period: "месяц",
      description: "Доступ к основным функциям",
      features: [
        "Отслеживание протоколов",
        "Базовые рекомендации",
        "Доступ к сообществу"
      ]
    },
    {
      type: "premium",
      name: "Премиум",
      price: "4990 ₽",
      period: "месяц",
      description: "Максимальная поддержка для вашего здоровья",
      featured: true,
      features: [
        "Все функции базового плана",
        "Комплексный AI-анализ",
        "Консультации со специалистами",
        "Приоритетная поддержка"
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`
              ${plan.featured ? 'border-primary shadow-lg scale-105 lg:scale-100' : 'border'}
              ${subscription?.plan_type === plan.type && subscription?.status === 'active' ? 'border-evergreen-500 ring-1 ring-evergreen-500' : ''}
              transition-all duration-200 hover:shadow-md
            `}
          >
            {plan.featured && (
              <div className="bg-primary text-white text-center py-2 text-sm font-medium rounded-t-lg">
                Популярный выбор
              </div>
            )}
            {subscription?.plan_type === plan.type && subscription?.status === 'active' && (
              <div className="bg-evergreen-500 text-white text-center py-2 text-sm font-medium rounded-t-lg">
                Ваш текущий план
              </div>
            )}
            <CardHeader className={`${plan.featured ? 'bg-primary/5' : ''} p-4 sm:p-6`}>
              <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
              <CardDescription className="flex flex-col sm:flex-row sm:items-end gap-1">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-2 sm:pt-4">
              <ul className="space-y-2 sm:space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`
                  w-full text-sm sm:text-base py-2 sm:py-3
                  ${plan.featured ? '' : 'bg-white text-primary hover:text-white border border-primary'}
                  ${subscription?.plan_type === plan.type && subscription?.status === 'active' ? 'bg-evergreen-50 text-evergreen-700 border-evergreen-500 hover:bg-evergreen-100' : ''}
                `}
                onClick={() => handleSelectPlan(plan.type)}
                disabled={selectedPlan === plan.type || (subscription?.plan_type === plan.type && subscription?.status === 'active')}
              >
                {selectedPlan === plan.type ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Обработка...
                  </>
                ) : subscription?.plan_type === plan.type && subscription?.status === 'active' ? (
                  'Текущий план'
                ) : (
                  'Выбрать план'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlansGrid;
