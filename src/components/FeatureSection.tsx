
import { 
  Activity, Heart, FileText, 
  PieChart, Database, Shield, 
  BookOpen, Search
} from 'lucide-react';
import { Card, CardContent } from '@/design-system/components/Card';

export default function FeatureSection() {
  const features = [
    {
      icon: <FileText className="w-10 h-10" />,
      title: "Анализ результатов анализов",
      description: "Загружайте результаты анализов крови и получайте интеллектуальную интерпретацию показателей и выявление отклонений.",
      color: "brand-primary"
    },
    {
      icon: <Search className="w-10 h-10" />,
      title: "Помощь в диагностике",
      description: "Получайте информацию и рекомендации на основе симптомов и данных вашего профиля.",
      color: "brand-primary"
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Персонализированные рекомендации",
      description: "Индивидуальные советы по питанию, образу жизни и физическим нагрузкам на основе ваших данных.",
      color: "brand-secondary"
    },
    {
      icon: <Activity className="w-10 h-10" />,
      title: "Мониторинг состояния здоровья",
      description: "Отслеживайте ключевые показатели здоровья и наблюдайте прогресс с помощью наглядных графиков.",
      color: "brand-secondary"
    },
    {
      icon: <PieChart className="w-10 h-10" />,
      title: "Комплексная оценка здоровья",
      description: "Интерактивные опросники и инструменты для глубокой оценки текущего состояния вашего здоровья.",
      color: "brand-primary"
    },
    {
      icon: <Database className="w-10 h-10" />,
      title: "Рекомендации по добавкам",
      description: "Персонализированные рекомендации по приему витаминов и добавок с проверкой взаимодействий.",
      color: "brand-secondary"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Защита данных",
      description: "Высочайший уровень безопасности и конфиденциальности для защиты ваших медицинских данных.",
      color: "brand-primary"
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Научный подход",
      description: "Все рекомендации основаны на научных исследованиях и доказательной медицине.",
      color: "brand-secondary"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ключевые возможности платформы</h2>
          <p className="text-lg text-muted-foreground">
            EVERLIV сочетает в себе передовой искусственный интеллект и доказательную медицину для обеспечения комплексной заботы о вашем здоровье и долголетии.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} variant="default" hover="lift" className="group h-full">
              <CardContent>
                <div className={`mb-4 text-${feature.color} group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-brand-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
