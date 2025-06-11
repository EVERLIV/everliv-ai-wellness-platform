
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  TestTube, 
  MessageSquare, 
  BarChart3,
  ChevronRight
} from 'lucide-react';

const ServicesGrid = () => {
  const { user } = useAuth();

  const services = [
    {
      icon: <TestTube className="h-8 w-8" />,
      title: "Анализ крови с ИИ",
      description: "Загрузите результаты анализов и получите персонализированную расшифровку с рекомендациями от искусственного интеллекта",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
      features: ["Детальная расшифровка", "Персональные рекомендации", "Отслеживание динамики", "Уведомления о рисках"],
      link: user ? "/blood-analysis" : "/signup"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "ИИ-Доктор",
      description: "Персональный медицинский консультант на базе искусственного интеллекта для ответов на ваши вопросы о здоровье",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      features: ["24/7 доступность", "Медицинские консультации", "История общения", "Персонализированные советы"],
      link: user ? "/ai-doctor" : "/signup"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Аналитика здоровья",
      description: "Комплексный анализ ваших показателей здоровья с построением графиков и трендов для долгосрочного мониторинга",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80",
      features: ["Графики и тренды", "Прогнозирование", "Сравнение с нормами", "Экспорт данных"],
      link: user ? "/analytics" : "/signup"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Профиль здоровья",
      description: "Создайте детальный профиль своего здоровья для получения максимально точных рекомендаций",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
      features: ["Полная анкета здоровья", "Медицинская история", "Факторы риска", "Цели здоровья"],
      link: user ? "/health-profile" : "/signup"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Четыре ключевых сервиса для вашего здоровья
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Каждый сервис разработан с использованием передовых технологий ИИ и основан на последних научных исследованиях
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.backgroundColor = '#f3f4f6';
                      parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><div class="text-gray-400">${service.title}</div></div>`;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    {service.icon}
                    <span className="font-medium">{service.title}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                
                <div className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link to={service.link}>
                  <Button className="w-full group">
                    {user ? 'Попробовать сервис' : 'Зарегистрироваться'}
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Готовы начать свой путь к улучшению здоровья?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pricing">
              <Button size="lg">
                Выбрать тариф
              </Button>
            </Link>
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button size="lg" variant="outline">
                {user ? 'Перейти в панель' : 'Начать бесплатно'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
