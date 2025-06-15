
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { toast } from 'sonner';

interface SubscriptionPlansGridProps {
  subscription: Subscription | null;
}

const SubscriptionPlansGrid = ({ subscription }: SubscriptionPlansGridProps) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planType: string, planName: string, price: number) => {
    setSelectedPlan(planType);
    if (subscription?.plan_type === planType && subscription?.status === 'active') {
      toast.info('У вас уже есть активная подписка на этот план');
      setSelectedPlan(null);
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        plan: { 
          type: planType,
          name: planName,
          price: price,
          period: "месяц",
          annual: false
        } 
      } 
    });
  };

  const plans = [
    {
      type: "basic",
      name: "Базовый",
      price: 0,
      period: "",
      description: "Доступ к основным функциям",
      features: [
        "1 анализ крови в месяц с AI-интерпретацией",
        "99 сообщений с базовым AI-доктором",
        "Ведение дневника питания",
        "Базовые рекомендации по здоровью"
      ]
    },
    {
      type: "premium",
      name: "Премиум",
      price: 999,
      period: "месяц",
      description: "Максимальная поддержка для вашего здоровья",
      featured: true,
      features: [
        "15 анализов крови в месяц с расширенной AI-интерпретацией",
        "199 сообщений с персональным AI-доктором",
        "Полный профиль здоровья с историей",
        "Расширенная аналитика и тренды здоровья",
        "Персонализированные протоколы оздоровления",
        "Приоритетная поддержка"
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`
              ${plan.featured ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border'}
              ${subscription?.plan_type === plan.type && subscription?.status === 'active' ? 'border-evergreen-500 ring-1 ring-evergreen-500' : ''}
              transition-all duration-200 hover:shadow-md relative
            `}
          >
            {subscription?.plan_type === plan.type && subscription?.status === 'active' && (
              <div className="bg-evergreen-500 text-white text-center py-1 text-xs font-medium rounded-t-lg">
                Ваш текущий план
              </div>
            )}
            <CardHeader className={`${plan.featured ? 'bg-primary/5' : ''} p-3 sm:p-4 relative`}>
              {plan.featured && (
                <Badge 
                  variant="default" 
                  className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-0.5"
                >
                  Популярный
                </Badge>
              )}
              <CardTitle className="text-base sm:text-lg">{plan.name}</CardTitle>
              <CardDescription className="flex flex-col sm:flex-row sm:items-end gap-1">
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  {plan.price === 0 ? 'Бесплатно' : `${plan.price} ₽`}
                </span>
                {plan.period && <span className="text-xs text-muted-foreground">/{plan.period}</span>}
              </CardDescription>
              <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
              <ul className="space-y-1 sm:space-y-2 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`
                  w-full text-xs sm:text-sm py-2
                  ${plan.featured ? '' : 'bg-white text-primary hover:text-white border border-primary'}
                  ${subscription?.plan_type === plan.type && subscription?.status === 'active' ? 'bg-evergreen-50 text-evergreen-700 border-evergreen-500 hover:bg-evergreen-100' : ''}
                `}
                onClick={() => handleSelectPlan(plan.type, plan.name, plan.price)}
                disabled={selectedPlan === plan.type || (subscription?.plan_type === plan.type && subscription?.status === 'active')}
              >
                {selectedPlan === plan.type ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
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
