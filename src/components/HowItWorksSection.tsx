
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: "👤",
      title: "Создайте профиль",
      description: "Заполните личные данные"
    },
    {
      icon: "📋",
      title: "Загрузите анализы",
      description: "Загрузите результаты лабораторных исследований"
    },
    {
      icon: "🔍",
      title: "Получите анализ",
      description: "AI проанализирует ваши данные"
    },
    {
      icon: "📊",
      title: "Получайте рекомендации",
      description: "Следуйте персональным рекомендациям"
    },
  ];

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-10">Как это работает?</h2>
        <p className="text-sm text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Узнайте, как наша платформа использует искусственный интеллект для анализа вашего здоровья
          и предоставления персонализированных рекомендаций
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="border border-green-100 rounded-lg p-6 bg-green-50 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 border border-green-200">
                <span className="text-xl">{step.icon}</span>
              </div>
              <h3 className="text-md font-medium mb-2 text-gray-800">{step.title}</h3>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          <p>Заинтересованы в предложениях для бизнеса? <Link to="/corporate" className="underline text-primary">Посмотрите наши корпоративные решения</Link></p>
        </div>
      </div>
    </section>
  );
}
