
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';

export default function PartnershipSection() {
  const partnerBenefits = [
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Растущий доход",
      description: "Получайте до 30% комиссии с каждой продажи, привлеченной вами"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Помогайте другим",
      description: "Делитесь действительно полезными продуктами со своей аудиторией"
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Бонусы и вознаграждения",
      description: "Эксклюзивный доступ к новым функциям и специальным предложениям"
    }
  ];

  const partnerTypes = [
    {
      title: "Для медицинских учреждений",
      description: "Комплексные решения для клиник и медицинских центров",
      href: "/partnerships/medical-institutions"
    },
    {
      title: "Для корпоративных клиентов", 
      description: "Программы поддержки здоровья сотрудников",
      href: "/partnerships/corporate-clients"
    },
    {
      title: "Для медицинских специалистов",
      description: "Инструменты для практикующих врачей", 
      href: "/partnerships/medical-specialists"
    }
  ];

  const leaderboard = [
    { name: "Алексей К.", earnings: "₽257,890" },
    { name: "Центр Здоровья \"Вита\"", earnings: "₽198,650" },
    { name: "Марина П.", earnings: "₽145,720" }
  ];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Партнёрская программа</h2>
          <p className="text-muted-foreground mb-8">
            Станьте нашим партнером! Привлекайте лаборатории, врачей, бренды добавок - зарабатывайте, 
            помогая другим выздоравливать.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {partnerBenefits.map((benefit, index) => (
              <Card key={index} variant="default" hover="lift">
                <CardContent className="text-center">
                  <div className="flex justify-center mb-4 text-brand-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {partnerTypes.map((partner, index) => (
              <Link key={index} to={partner.href} className="block">
                <Card variant="outline" hover="lift" interactive={true} className="h-full group">
                  <CardContent className="flex flex-col">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                      {partner.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">
                      {partner.description}
                    </p>
                    <Button variant="outline" className="w-full">Подробнее</Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <Card variant="default" className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Лидерборд партнеров</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((partner, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-neutral-50 rounded">
                    <span className="font-medium">{partner.name}</span>
                    <span className="text-brand-primary font-semibold">{partner.earnings}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">Обновляется в режиме реального времени</p>
            </CardContent>
          </Card>
          
          <Link to="/partnership">
            <Button size="lg" className="rounded-full bg-brand-primary hover:bg-brand-secondary text-white px-8">
              Стать партнером
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
