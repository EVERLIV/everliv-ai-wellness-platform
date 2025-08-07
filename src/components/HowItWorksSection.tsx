import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
export default function HowItWorksSection() {
  const steps = [{
    icon: "👤",
    title: "Создайте профиль",
    description: "Заполните личные данные и начальную информацию о здоровье"
  }, {
    icon: "📋",
    title: "Загрузите анализы",
    description: "Загрузите результаты лабораторных исследований для анализа"
  }, {
    icon: "🔍",
    title: "Получите анализ",
    description: "ИИ проанализирует ваши данные и выявит потенциальные риски"
  }, {
    icon: "📊",
    title: "Получите рекомендации",
    description: "Следуйте персональным рекомендациям по улучшению здоровья"
  }];
  return <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Как это работает?</h2>
        <p className="text-md text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Узнайте, как наша платформа использует искусственный интеллект для анализа вашего здоровья
          и предоставления персонализированных рекомендаций
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => <div key={index} className="border border-green-100 rounded-lg p-6 bg-white flex flex-col items-center text-center relative">
              {index < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-green-200" />}
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-200">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="mb-2 text-gray-800 font-semibold text-lg">{step.title}</h3>
              <p className="text-gray-600 text-base">{step.description}</p>
            </div>)}
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg border border-green-100 mb-8">
            <h3 className="font-medium text-center mb-4">Посмотрите, как EVERLIV работает на практике</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Видеодемонстрация платформы</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/how-it-works">
            <Button variant="outline" className="rounded-full text-sm border-primary text-primary hover:bg-primary hover:text-white">
              Подробнее о процессе
            </Button>
          </Link>
        </div>
      </div>
    </section>;
}