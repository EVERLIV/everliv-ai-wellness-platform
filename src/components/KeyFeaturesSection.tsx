
import { Snowflake, Utensils, Waves, CirclesDashed, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function KeyFeaturesSection() {
  const features = [
    {
      icon: <Snowflake className="h-8 w-8 md:h-12 md:w-12 text-blue-300" />,
      title: "Холодовое воздействие",
      description: "Укрепляет иммунитет и повышает стрессоустойчивость",
      background: "bg-blue-50"
    },
    {
      icon: <Utensils className="h-8 w-8 md:h-12 md:w-12 text-amber-400" />,
      title: "Голодание",
      description: "Активирует аутофагию и улучшает метаболическое здоровье",
      background: "bg-amber-50"
    },
    {
      icon: <Waves className="h-8 w-8 md:h-12 md:w-12 text-green-400" />,
      title: "Дыхательные практики",
      description: "Снижает уровень стресса и улучшает когнитивные функции",
      background: "bg-green-50"
    },
    {
      icon: <CirclesDashed className="h-8 w-8 md:h-12 md:w-12 text-purple-400" />,
      title: "Кислородная терапия",
      description: "Ускоряет восстановление и улучшает клеточное здоровье",
      background: "bg-purple-50"
    },
    {
      icon: <Pill className="h-8 w-8 md:h-12 md:w-12 text-rose-400" />,
      title: "Добавки",
      description: "Персонализированные рекомендации для оптимального здоровья",
      background: "bg-rose-50"
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Ключевые практики</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Революционный подход к улучшению здоровья и продлению жизни на основе научных исследований и древней мудрости
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${feature.background} rounded-xl p-6 flex flex-col items-center text-center max-w-[160px] hover:shadow-md transition-all`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-medium mb-2">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/science">
            <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white">
              Научный подход к здоровью
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
