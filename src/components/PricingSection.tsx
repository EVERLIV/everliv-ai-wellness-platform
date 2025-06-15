
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  buttonText: string;
  popular?: boolean;
  features: PlanFeature[];
}

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);
  
  const basicFeatures = [
    { name: "Базовый анализ результатов анализов", included: true },
    { name: "Основные рекомендации по здоровью", included: true },
    { name: "Отслеживание до 5 показателей здоровья", included: true },
    { name: "Еженедельные отчеты о прогрессе", included: true },
    { name: "Доступ к базе знаний о здоровье", included: true },
    { name: "Интерпретация сложных медицинских данных", included: false },
    { name: "Персонализированные планы питания", included: false },
    { name: "Расширенные рекомендации по добавкам", included: false },
    { name: "Приоритетная поддержка специалистов", included: false },
  ];

  const premiumFeatures = [
    { name: "Базовый анализ результатов анализов", included: true },
    { name: "Основные рекомендации по здоровью", included: true },
    { name: "Отслеживание до 5 показателей здоровья", included: true },
    { name: "Еженедельные отчеты о прогрессе", included: true },
    { name: "Доступ к базе знаний о здоровье", included: true },
    { name: "Интерпретация сложных медицинских данных", included: true },
    { name: "Персонализированные планы питания", included: true },
    { name: "Расширенные рекомендации по добавкам", included: true },
    { name: "Приоритетная поддержка специалистов", included: true },
  ];

  const plans: PricingPlan[] = [
    {
      name: "Базовый",
      description: "Идеально для тех, кто начинает следить за своим здоровьем",
      price: annual ? "790" : "990",
      period: annual ? "руб./месяц при годовой оплате" : "руб./месяц",
      buttonText: "Начать бесплатно",
      features: basicFeatures,
    },
    {
      name: "Премиум",
      description: "Комплексный подход к здоровью для максимальных результатов",
      price: annual ? "1990" : "2490",
      period: annual ? "руб./месяц при годовой оплате" : "руб./месяц",
      buttonText: "Выбрать премиум",
      popular: true,
      features: premiumFeatures,
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="heading-lg mb-6">Простые и прозрачные тарифы</h2>
          <p className="text-lg text-gray-600 mb-8">
            Выберите оптимальный план для заботы о вашем здоровье и долголетии.
          </p>
          
          {/* Toggle Annual/Monthly */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 text-base ${annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
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
            <span className={`ml-3 text-base ${!annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Ежемесячно
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl border ${
                plan.popular ? 'border-everliv-600 ring-2 ring-everliv-600/20' : 'border-gray-200'
              } shadow-soft overflow-hidden relative`}
            >
              {plan.popular && (
                <div className="bg-everliv-600 text-white text-xs font-semibold px-3 py-1 absolute right-0 top-0 rounded-bl">
                  Популярный выбор
                </div>
              )}
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <Link to="/signup">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-everliv-600 hover:bg-everliv-700 text-white'
                        : 'bg-white border border-everliv-600 text-everliv-600 hover:bg-everliv-50'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
              <div className="border-t border-gray-100 p-6 sm:p-8 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">Включено в план</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className={`h-5 w-5 ${feature.included ? 'text-evergreen-500' : 'text-gray-300'} mt-0.5 mr-2 flex-shrink-0`} />
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4">Нужен корпоративный план для вашей компании?</h3>
          <p className="text-gray-600 mb-6">
            Мы предлагаем специальные корпоративные тарифы для компаний любого размера, желающих заботиться о здоровье своих сотрудников.
          </p>
          <Link to="/contact">
            <Button variant="outline" className="border-everliv-600 text-everliv-600 hover:bg-everliv-50">
              Связаться с нами
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
