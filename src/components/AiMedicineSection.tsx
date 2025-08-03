
import React from 'react';
import { Brain, Zap, BarChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';

const AiMedicineSection = () => {
  const features = [
    {
      icon: <Brain className="h-7 w-7" />,
      title: "Персонализированный анализ",
      description: "Наш ИИ анализирует тысячи показателей для создания индивидуального плана здоровья"
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Раннее выявление рисков", 
      description: "Алгоритмы определяют потенциальные риски здоровья на основе минимальных изменений показателей"
    },
    {
      icon: <BarChart className="h-7 w-7" />,
      title: "Прогнозирование здоровья",
      description: "Предсказание динамики показателей здоровья при следовании рекомендациям"
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Коллективная мудрость",
      description: "Анализ результатов сотен тысяч пользователей для оптимизации рекомендаций"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-neutral-50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Сила ИИ в медицине</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Используя искусственный интеллект, мы революционизируем подход к персонализированной медицине
            и помогаем предотвращать болезни еще до их появления
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} variant="elevated" hover="lift" className="group">
              <CardContent>
                <div className="bg-brand-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 text-brand-primary group-hover:bg-brand-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card variant="elevated" size="lg" className="max-w-4xl mx-auto">
          <CardContent className="space-y-0">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80" 
                  alt="AI в медицине" 
                  className="rounded-lg w-full h-auto object-cover"
                  style={{ maxHeight: '200px' }} 
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2">Применение ИИ в персонализированной медицине</h3>
                <p className="text-muted-foreground mb-4">
                  Наш ИИ постоянно обучается и совершенствуется, использует данные из тысяч научных исследований и клинических 
                  случаев, чтобы предлагать максимально точные и эффективные рекомендации для вашего здоровья.
                </p>
                <Link to="ai-medicine">
                  <Button className="rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white">
                    Подробнее о технологии
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AiMedicineSection;
