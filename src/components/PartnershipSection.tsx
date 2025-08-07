
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Award } from "lucide-react";

export default function PartnershipSection() {
  const partnerBenefits = [
    {
      icon: <TrendingUp className="w-10 h-10 text-primary" />,
      title: "Растущий доход",
      description: "Получайте до 30% комиссии с каждой продажи, привлеченной вами"
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Помогайте другим",
      description: "Делитесь действительно полезными продуктами со своей аудиторией"
    },
    {
      icon: <Award className="w-10 h-10 text-primary" />,
      title: "Бонусы и вознаграждения",
      description: "Эксклюзивный доступ к новым функциям и специальным предложениям"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Партнёрская программа</h2>
          <p className="text-gray-600 mb-8">
            Станьте нашим партнером! Привлекайте лаборатории, врачей, бренды добавок - зарабатывайте, 
            помогая другим выздоравливать.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {partnerBenefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link to="/partnerships/medical-institutions" className="block">
              <div className="bg-white p-6 rounded-xl border border-primary/30 hover:shadow-md transition-all h-full flex flex-col">
                <h3 className="text-xl font-bold mb-3">Для медицинских учреждений</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">Комплексные решения для клиник и медицинских центров</p>
                <Button variant="outline" className="w-full">Подробнее</Button>
              </div>
            </Link>
            
            <Link to="/partnerships/corporate-clients" className="block">
              <div className="bg-white p-6 rounded-xl border border-primary/30 hover:shadow-md transition-all h-full flex flex-col">
                <h3 className="text-xl font-bold mb-3">Для корпоративных клиентов</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">Программы поддержки здоровья сотрудников</p>
                <Button variant="outline" className="w-full">Подробнее</Button>
              </div>
            </Link>
            
            <Link to="/partnerships/medical-specialists" className="block">
              <div className="bg-white p-6 rounded-xl border border-primary/30 hover:shadow-md transition-all h-full flex flex-col">
                <h3 className="text-xl font-bold mb-3">Для медицинских специалистов</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">Инструменты для практикующих врачей</p>
                <Button variant="outline" className="w-full">Подробнее</Button>
              </div>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-primary/30 mb-8">
            <h3 className="text-xl font-bold mb-3">Лидерборд партнеров</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">Алексей К.</span>
                <span className="text-primary font-semibold">₽257,890</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">Центр Здоровья "Вита"</span>
                <span className="text-primary font-semibold">₽198,650</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">Марина П.</span>
                <span className="text-primary font-semibold">₽145,720</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Обновляется в режиме реального времени</p>
          </div>
          
          <Link to="/partnership">
            <Button size="lg" className="rounded-full bg-primary hover:bg-secondary text-white px-8">
              Стать партнером
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
