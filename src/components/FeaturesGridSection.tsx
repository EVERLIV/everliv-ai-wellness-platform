
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export default function FeaturesGridSection() {
  const features = [
    {
      icon: "📊",
      title: "Мониторинг здоровья",
      description: "Постоянное отслеживание ключевых показателей здоровья"
    },
    {
      icon: "🧬",
      title: "Анализ генетических данных",
      description: "Выявление генетических предрасположенностей к заболеваниям"
    },
    {
      icon: "🥗",
      title: "Персонализированное питание",
      description: "Рекомендации по питанию на основе ваших индивидуальных данных"
    },
    {
      icon: "💊",
      title: "Рекомендации по добавкам",
      description: "Индивидуальный подбор витаминов и добавок"
    },
    {
      icon: "🏃",
      title: "План физической активности",
      description: "Оптимальные физические нагрузки для вашего организма"
    },
    {
      icon: "🧠",
      title: "Когнитивное здоровье",
      description: "Рекомендации по поддержанию когнитивных функций"
    },
    {
      icon: "😴",
      title: "Анализ качества сна",
      description: "Советы по улучшению качества сна и регуляции циркадных ритмов"
    },
    {
      icon: "📱",
      title: "Мобильный доступ",
      description: "Удобный доступ к платформе с любого устройства"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Возможности Everliv</h2>
        <p className="text-sm text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Наша платформа предлагает широкий спектр инструментов для мониторинга и улучшения вашего здоровья
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="flex">
              <div className="mr-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span>{feature.icon}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/features">
            <Button variant="outline" className="rounded-3xl text-sm border-primary text-primary hover:bg-primary hover:text-white">
              Посмотреть все возможности
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
