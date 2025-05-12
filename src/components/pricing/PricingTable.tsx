
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

const PricingTable = () => {
  const [annual, setAnnual] = useState(true);
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSelectPlan = (planType: 'basic' | 'standard' | 'premium', planName: string, basePrice: number) => {
    if (!user) {
      toast.info("Для выбора плана необходимо авторизоваться");
      return;
    }
    
    setProcessingPlan(planType);
    
    // Calculate price with annual discount if applicable
    const price = annual ? Math.round(basePrice * 0.8) : basePrice;
    
    // Navigate to checkout with plan details
    navigate('/checkout', {
      state: {
        plan: {
          type: planType,
          name: planName,
          price: price,
          period: "месяц",
          annual: annual
        }
      }
    });
    
    setProcessingPlan(null);
  };
  
  // Calculate prices with annual discount
  const getPrice = (basePrice: number) => {
    return annual ? Math.round(basePrice * 0.8) : basePrice;
  };
  
  const plans = [
    {
      type: "basic",
      name: "Базовый",
      basePrice: 990,
      description: "Для начинающих следить за здоровьем",
      features: [
        "Базовый анализ здоровья",
        "Интерпретация до 5 показателей",
        "Еженедельные отчеты",
        "Доступ к базе знаний",
        "Отслеживание симптомов"
      ]
    },
    {
      type: "standard",
      name: "Стандарт",
      basePrice: 1790,
      description: "Для активной заботы о здоровье",
      popular: true,
      features: [
        "Все функции базового плана",
        "Расширенный анализ здоровья",
        "Интерпретация до 15 показателей",
        "Персонализированные планы питания",
        "Рекомендации по добавкам"
      ]
    },
    {
      type: "premium",
      name: "Премиум",
      basePrice: 2490,
      description: "Максимальные возможности",
      features: [
        "Все функции стандартного плана",
        "Полный анализ здоровья",
        "Интерпретация всех показателей",
        "VIP поддержка от экспертов",
        "Квартальные консультации",
        "Персональный план оздоровления"
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Toggle Annual/Monthly */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Годовая оплата <span className="text-evergreen-500 text-xs ml-1">(Скидка 20%)</span>
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${annual ? 'bg-everliv-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  annual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${!annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Ежемесячно
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.type} 
                className={`border ${plan.popular ? 'border-2 border-everliv-600' : 'border-gray-200'} rounded-xl shadow-sm overflow-hidden bg-white`}
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
                    <span className="text-4xl font-bold">{getPrice(plan.basePrice)}</span>
                    <span className="text-gray-600"> руб./мес</span>
                    {annual && <p className="text-sm text-gray-500">при годовой оплате</p>}
                  </div>
                  {user ? (
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-everliv-600 hover:bg-everliv-700 text-white' : 'border-everliv-600 text-everliv-600 hover:bg-everliv-50'}`} 
                      variant={plan.popular ? "default" : "outline"} 
                      onClick={() => handleSelectPlan(plan.type as 'basic' | 'standard' | 'premium', plan.name, plan.basePrice)}
                      disabled={processingPlan === plan.type || subscription?.plan_type === plan.type}
                    >
                      {processingPlan === plan.type ? 'Обработка...' : (
                        subscription?.plan_type === plan.type 
                          ? 'Текущий план' 
                          : 'Выбрать план'
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
          
          {/* Payment info and FAQ shortcut */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-2">
              Оплата осуществляется через АО «АЛЬФА-БАНК». Принимаем карты VISA, MasterCard, МИР.
            </p>
            <p className="text-gray-600">
              Есть вопросы по подпискам? Посмотрите наши <Link to="/faq" className="text-everliv-600 hover:underline">часто задаваемые вопросы</Link>, 
              <Link to="/payment-info" className="text-everliv-600 hover:underline"> информацию об оплате</Link> или <Link to="/contact" className="text-everliv-600 hover:underline">свяжитесь с нами</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
