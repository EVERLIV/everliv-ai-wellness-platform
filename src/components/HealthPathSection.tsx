
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";

export default function HealthPathSection() {
  const paths = [{
    number: "1",
    title: "Комплексный анализ",
    description: "Получите полный анализ вашего здоровья на основе медицинских данных и образа жизни.",
    features: ["Оценка текущего состояния здоровья", "Выявление скрытых рисков", "Определение биологического возраста"]
  }, {
    number: "2",
    title: "Здоровое долголетие",
    description: "Получите персонализированные рекомендации для улучшения качества и продолжительности жизни.",
    features: ["Персонализированный план питания", "Индивидуальные физические нагрузки", "Рекомендации по добавкам и витаминам"]
  }, {
    number: "3",
    title: "Раннее выявление",
    description: "Обнаружение признаков заболеваний на ранней стадии для своевременного лечения.",
    features: ["Мониторинг ключевых показателей", "Выявление отклонений от нормы", "Своевременные уведомления о рисках"]
  }];
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Путь к лучшему здоровью</h2>
          <p className="text-gray-600">
            Мы разработали пошаговый подход для улучшения вашего здоровья и качества жизни
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {paths.map((path, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-everliv-600 text-white flex items-center justify-center text-lg font-semibold">
                  {path.number}
                </div>
                <h3 className="ml-3 text-xl font-semibold">{path.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{path.description}</p>
              <ul className="space-y-2 mb-6">
                {path.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="w-1.5 h-1.5 bg-everliv-600 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/signup">
            <Button className="bg-everliv-600 hover:bg-everliv-700 text-white">
              Начать свой путь <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
