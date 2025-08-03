import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/design-system/components/Card';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: "👤",
      title: "Создайте профиль",
      description: "Заполните личные данные и начальную информацию о здоровье"
    }, 
    {
      icon: "📋",
      title: "Загрузите анализы",
      description: "Загрузите результаты лабораторных исследований для анализа"
    }, 
    {
      icon: "🔍",
      title: "Получите анализ",
      description: "ИИ проанализирует ваши данные и выявит потенциальные риски"
    }, 
    {
      icon: "📊",
      title: "Получите рекомендации",
      description: "Следуйте персональным рекомендациям по улучшению здоровья"
    }
  ];

  return (
    <section className="py-16 bg-neutral-50 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Как это работает?</h2>
        <p className="text-md text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Узнайте, как наша платформа использует искусственный интеллект для анализа вашего здоровья
          и предоставления персонализированных рекомендаций
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card key={index} variant="default" hover="lift" className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-brand-secondary/30" />
              )}
              <CardContent className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-secondary/10 flex items-center justify-center mb-4 border border-brand-secondary/20 mx-auto group-hover:bg-brand-secondary/20 transition-colors">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="mb-2 text-foreground font-semibold text-lg group-hover:text-brand-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-base">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card variant="default" className="mb-8">
            <CardContent>
              <h3 className="font-medium text-center mb-4">Посмотрите, как EVERLIV работает на практике</h3>
              <div className="aspect-w-16 aspect-h-9 bg-neutral-100 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Видеодемонстрация платформы</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Link to="/how-it-works">
            <Button variant="outline" className="rounded-full text-sm border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
              Подробнее о процессе
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}