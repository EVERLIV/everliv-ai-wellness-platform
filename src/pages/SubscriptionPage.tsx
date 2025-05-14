
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const plans = [
    {
      name: "Базовый",
      price: 990,
      displayPrice: "990 ₽",
      period: "месяц",
      type: "basic" as SubscriptionPlan,
      description: "Доступ к основным функциям",
      features: [
        "Отслеживание протоколов",
        "Базовые рекомендации",
        "Доступ к сообществу"
      ]
    },
    {
      name: "Стандарт",
      price: 2490,
      displayPrice: "2490 ₽",
      period: "месяц",
      type: "standard" as SubscriptionPlan,
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
      name: "Премиум",
      price: 4990,
      displayPrice: "4990 ₽",
      period: "месяц",
      type: "premium" as SubscriptionPlan,
      description: "Максимальная поддержка для вашего здоровья",
      features: [
        "Все функции стандартного плана",
        "Комплексный AI-анализ",
        "Консультации со специалистами",
        "Приоритетная поддержка"
      ]
    }
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    navigate('/checkout', { 
      state: { 
        plan: {
          name: plan.name,
          price: plan.price,
          type: plan.type,
          isUpgrade: false
        } 
      }
    });
  };

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan, index) => (
              <Card key={index} className={`${plan.featured ? 'border-primary shadow-lg' : 'border'}`}>
                {plan.featured && (
                  <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                    Популярный выбор
                  </div>
                )}
                <CardHeader className={`${plan.featured ? 'bg-primary/10' : ''}`}>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-foreground">{plan.displayPrice}</span>
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
                    className={`w-full mt-6 ${plan.featured ? '' : 'bg-white text-primary hover:text-white border border-primary'}`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Выбрать план
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground">
              Есть вопросы по подпискам? <a href="#" className="text-primary hover:underline">Свяжитесь с нами</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
