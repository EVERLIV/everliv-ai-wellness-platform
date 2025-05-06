
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";

export default function HealthPathSection() {
  const paths = [
    {
      number: "1",
      title: "Комплексный анализ",
      description: "Получите полный анализ вашего здоровья на основе медицинских данных и образа жизни.",
      features: [
        "Оценка текущего состояния здоровья",
        "Выявление скрытых рисков",
        "Определение биологического возраста"
      ]
    },
    {
      number: "2",
      title: "Здоровое долголетие",
      description: "Получите персонализированные рекомендации для улучшения качества и продолжительности жизни.",
      features: [
        "Персонализированный план питания",
        "Индивидуальные физические нагрузки",
        "Рекомендации по добавкам и витаминам"
      ]
    },
    {
      number: "3",
      title: "Раннее выявление",
      description: "Обнаружение признаков заболеваний на ранней стадии для своевременного лечения.",
      features: [
        "Мониторинг ключевых показателей",
        "Выявление отклонений от нормы",
        "Своевременные уведомления о рисках"
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Три пути достижения здоровья</h2>
        <p className="text-sm text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          EVERLIV предлагает комплексный подход для достижения оптимального здоровья и долголетия,
          учитывающий ваши индивидуальные особенности и потребности
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {paths.map((path, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-primary font-medium mr-3">
                  {path.number}
                </div>
                <h3 className="text-lg font-medium">Путь {path.number}. {path.title}</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                {path.description}
              </p>
              
              <div className="space-y-3 mb-6">
                {path.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 mt-0.5 mr-2"></div>
                    <p className="text-xs">{feature}</p>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="rounded-3xl text-xs border-primary text-primary hover:bg-primary hover:text-white">
                Узнать подробнее
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
