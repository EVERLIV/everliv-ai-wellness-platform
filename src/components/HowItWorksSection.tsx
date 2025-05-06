
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Создайте профиль",
      description: "Заполните подробный профиль здоровья, включая вашу историю болезни, цели и текущее состояние здоровья.",
    },
    {
      number: "02",
      title: "Загрузите данные",
      description: "Загрузите результаты анализов, интегрируйте данные с носимых устройств или внесите информацию вручную.",
    },
    {
      number: "03",
      title: "Получите анализ",
      description: "Наш ИИ проанализирует ваши данные и предоставит подробную интерпретацию и персонализированные рекомендации.",
    },
    {
      number: "04",
      title: "Отслеживайте прогресс",
      description: "Регулярно обновляйте данные, следуйте рекомендациям и наблюдайте за улучшениями вашего здоровья.",
    }
  ];

  const benefits = [
    "Научно обоснованные рекомендации",
    "Интеграция с медицинскими устройствами",
    "Конфиденциальность и безопасность данных",
    "Поддержка от специалистов",
    "Регулярные обновления на основе новейших исследований",
    "Персонализация на основе вашей уникальной биологии"
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-lg mb-6">Как работает EVERLIV</h2>
          <p className="text-lg text-gray-600">
            Простой процесс для получения глубокого анализа вашего здоровья и персонализированных рекомендаций, основанных на науке и новейших технологиях ИИ.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="feature-card relative border-t-4 border-everliv-600">
              <div className="absolute -top-4 left-6 bg-everliv-600 text-white text-sm font-bold py-1 px-3 rounded">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 mt-4">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="heading-md mb-6">Преимущества платформы EVERLIV</h3>
              <p className="text-gray-600 mb-6">
                Наша платформа объединяет передовые технологии искусственного интеллекта с научными исследованиями, чтобы предоставить вам наиболее точные и эффективные рекомендации для вашего здоровья и долголетия.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center items-start lg:items-center">
              <div className="bg-white p-6 rounded-lg shadow-soft border border-gray-100 max-w-md w-full">
                <h4 className="text-xl font-semibold mb-4 text-center">Готовы начать путь к оптимальному здоровью?</h4>
                <p className="text-gray-600 mb-6 text-center">
                  Присоединяйтесь к тысячам людей, которые уже улучшили свое здоровье с помощью EVERLIV.
                </p>
                <Link to="/signup" className="block">
                  <Button className="w-full bg-everliv-600 hover:bg-everliv-700 text-white">
                    Создать бесплатный аккаунт
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
