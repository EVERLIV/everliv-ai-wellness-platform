
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';

const SubscriptionPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Для доступа к подпискам необходимо войти в систему');
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSelectPlan = (planType: string) => {
    setSelectedPlan(planType);
    // If user already has this plan, notify them
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
      type: "standard",
      name: "Стандарт",
      price: "2490 ₽",
      period: "месяц",
      description: "Все базовые функции + расширенный анализ",
      featured: true,
      features: [
        "Все функции базового плана",
        "Анализ крови с AI",
        "Тест биологического возраста",
        "Персонализированные протоколы"
      ]
    },
    {
      type: "premium",
      name: "Премиум",
      price: "4990 ₽",
      period: "месяц",
      description: "Максимальная поддержка для вашего здоровья",
      features: [
        "Все функции стандартного плана",
        "Комплексный AI-анализ",
        "Консультации со специалистами",
        "Приоритетная поддержка"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-primary">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад к дашборду
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Подписки</h1>
          <p className="text-lg text-gray-700 mb-8">
            Выберите подходящий план для доступа ко всем возможностям платформы
          </p>
          
          {subscription && subscription.status === 'active' && (
            <div className="mb-8 p-4 bg-evergreen-50 border border-evergreen-200 rounded-lg">
              <h2 className="text-lg font-medium text-evergreen-800">Ваша текущая подписка</h2>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="h-5 w-5 text-evergreen-500" />
                <span>
                  План "{subscription.plan_type === 'basic' ? 'Базовый' : 
                         subscription.plan_type === 'standard' ? 'Стандарт' : 'Премиум'}" 
                  активен до {new Date(subscription.expires_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`
                  ${plan.featured ? 'border-primary shadow-lg' : 'border'}
                  ${subscription?.plan_type === plan.type && subscription?.status === 'active' ? 'border-evergreen-500 ring-1 ring-evergreen-500' : ''}
                `}
              >
                {plan.featured && (
                  <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                    Популярный выбор
                  </div>
                )}
                {subscription?.plan_type === plan.type && subscription?.status === 'active' && (
                  <div className="bg-evergreen-500 text-white text-center py-1 text-sm font-medium">
                    Ваш текущий план
                  </div>
                )}
                <CardHeader className={`${plan.featured ? 'bg-primary/10' : ''}`}>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`
                      w-full mt-6 
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
          
          <div className="text-center">
            <p className="text-muted-foreground">
              Есть вопросы по подпискам? <Link to="/faq" className="text-primary hover:underline">Свяжитесь с нами</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
