
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SUBSCRIPTION_PLANS } from "@/constants/subscription-features";
import { toast } from "sonner";

const PricingTable = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSelectPlan = (planType: 'basic' | 'premium', planName: string, price: number) => {
    if (!user) {
      toast.info("Для выбора плана необходимо авторизоваться");
      return;
    }
    
    setProcessingPlan(planType);
    
    // Navigate to checkout with plan details
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
    
    setProcessingPlan(null);
  };
  
  const plans = [
    {
      type: "basic" as const,
      name: SUBSCRIPTION_PLANS.basic.name,
      price: SUBSCRIPTION_PLANS.basic.price,
      description: SUBSCRIPTION_PLANS.basic.description,
      features: SUBSCRIPTION_PLANS.basic.features
    },
    {
      type: "premium" as const,
      name: SUBSCRIPTION_PLANS.premium.name,
      price: SUBSCRIPTION_PLANS.premium.price,
      description: SUBSCRIPTION_PLANS.premium.description,
      popular: true,
      features: SUBSCRIPTION_PLANS.premium.features
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Выберите тарифный план</h2>
            <p className="text-xl text-gray-600">
              Начните с бесплатного тарифа или получите полный доступ с премиум подпиской
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.type} 
                className={`border ${plan.popular ? 'border-2 border-everliv-600' : 'border-gray-200'} rounded-xl shadow-sm overflow-hidden bg-white relative`}
              >
                {plan.popular && (
                  <div className="bg-everliv-600 text-white text-xs font-semibold px-3 py-1 absolute right-0 top-0 rounded-bl">
                    Популярный выбор
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-everliv-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold text-evergreen-600">Бесплатно</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-600"> руб./мес</span>
                      </>
                    )}
                  </div>
                  
                  {user ? (
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-everliv-600 hover:bg-everliv-700 text-white' : 'border-everliv-600 text-everliv-600 hover:bg-everliv-50'}`} 
                      variant={plan.popular ? "default" : "outline"} 
                      onClick={() => handleSelectPlan(plan.type, plan.name, plan.price)}
                      disabled={processingPlan === plan.type || subscription?.plan_type === plan.type}
                    >
                      {processingPlan === plan.type ? 'Обработка...' : (
                        subscription?.plan_type === plan.type 
                          ? 'Текущий план' 
                          : plan.price === 0 ? 'Активировать' : 'Выбрать план'
                      )}
                    </Button>
                  ) : (
                    <Link to="/signup">
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-everliv-600 hover:bg-everliv-700 text-white' : 'border-everliv-600 text-everliv-600 hover:bg-everliv-50'}`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Зарегистрироваться
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Payment security indicator */}
                <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Безопасная оплата</span>
                  <CreditCard className="h-4 w-4 ml-2 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Payment info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-2">
              Оплата осуществляется через АО «АЛЬФА-БАНК». Принимаем карты VISA, MasterCard, МИР.
            </p>
            <p className="text-gray-600">
              Есть вопросы по подпискам? Посмотрите наши <Link to="/faq" className="text-everliv-600 hover:underline">часто задаваемые вопросы</Link> или <Link to="/contact" className="text-everliv-600 hover:underline">свяжитесь с нами</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
