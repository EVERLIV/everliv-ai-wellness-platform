
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TestTube, Bot, User, Apple, CheckCircle, ArrowRight, Star } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      id: 'lab-analysis',
      title: 'Лабораторные Анализы',
      subtitle: 'ИИ-анализ результатов лабораторных исследований',
      description: 'Загрузите фото ваших анализов или введите показатели вручную. Наш ИИ проанализирует результаты и предоставит персонализированные рекомендации для улучшения здоровья.',
      icon: <TestTube className="h-8 w-8" />,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      features: [
        'Анализ крови с расшифровкой каждого показателя',
        'Сравнение с оптимальными значениями',
        'Персонализированные рекомендации по питанию',
        'Рекомендации по витаминам и добавкам',
        'Отслеживание динамики показателей'
      ],
      benefits: [
        'Раннее выявление проблем со здоровьем',
        'Оптимизация показателей крови',
        'Профилактика заболеваний',
        'Улучшение общего самочувствия'
      ],
      link: '/blood-analysis'
    },
    {
      id: 'ai-doctor',
      title: 'EVERLIV Доктор',
      subtitle: 'Персональный ИИ-врач доступный 24/7',
      description: 'Получите профессиональные медицинские консультации в любое время. Наш ИИ-доктор обучен на медицинской литературе и поможет с вопросами о здоровье.',
      icon: <Bot className="h-8 w-8" />,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800',
      features: [
        'Консультации 24/7 без очередей',
        'Анализ симптомов и жалоб',
        'Рекомендации по лечению',
        'Интерпретация результатов анализов',
        'Контроль приема препаратов'
      ],
      benefits: [
        'Быстрое получение медицинской помощи',
        'Экономия времени и денег',
        'Профессиональные рекомендации',
        'Контроль состояния здоровья'
      ],
      link: '/ai-doctor'
    },
    {
      id: 'health-profile',
      title: 'Профиль здоровья',
      subtitle: 'Комплексная система мониторинга здоровья',
      description: 'Создайте полный профиль своего здоровья с историей анализов, показателей и рекомендаций. Отслеживайте прогресс и получайте аналитику.',
      icon: <User className="h-8 w-8" />,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&q=80&w=800',
      features: [
        'История всех анализов и обследований',
        'Динамика показателей здоровья',
        'Персональные цели и достижения',
        'Аналитика и тренды',
        'Экспорт данных для врачей'
      ],
      benefits: [
        'Полный контроль над здоровьем',
        'Визуализация прогресса',
        'Данные для врачей',
        'Мотивация к улучшениям'
      ],
      link: '/health-profile'
    },
    {
      id: 'nutrition-diary',
      title: 'Дневник питания',
      subtitle: 'Умный трекер питания с ИИ-анализом',
      description: 'Ведите дневник питания, сканируйте продукты и получайте персонализированные рекомендации по оптимизации рациона для здоровья и долголетия.',
      icon: <Apple className="h-8 w-8" />,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
      features: [
        'Сканирование продуктов по фото',
        'База из 1М+ продуктов',
        'Подсчет калорий и нутриентов',
        'ИИ-рекомендации по питанию',
        'Планирование рациона'
      ],
      benefits: [
        'Оптимизация рациона питания',
        'Контроль веса и метаболизма',
        'Улучшение энергии',
        'Профилактика заболеваний'
      ],
      link: '/nutrition-diary'
    }
  ];

  return (
    <PageLayout 
      title="Наши сервисы"
      description="Комплексная экосистема для мониторинга и улучшения здоровья"
      breadcrumbItems={[{ title: "Сервисы" }]}
      fullWidth={true}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-evergreen-500 to-evergreen-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              Ваше здоровье под полным контролем
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Четыре мощных инструмента для комплексного мониторинга, анализа и улучшения вашего здоровья с использованием передовых технологий искусственного интеллекта
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing">
                <Button size="lg" className="bg-white text-evergreen-700 hover:bg-gray-100">
                  Выбрать тариф
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-evergreen-700">
                  Попробовать бесплатно
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши сервисы</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Каждый сервис разработан для решения конкретных задач по управлению здоровьем и интегрируется в единую экосистему
            </p>
          </div>

          <div className="space-y-24">
            {services.map((service, index) => (
              <div key={service.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                {/* Content */}
                <div className="lg:w-1/2 space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-evergreen-100 rounded-xl text-evergreen-600">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
                      <p className="text-evergreen-600 font-medium">{service.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Возможности:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Преимущества:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to={service.link}>
                    <Button className="bg-evergreen-600 hover:bg-evergreen-700 text-white">
                      Попробовать сервис
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Image */}
                <div className="lg:w-1/2">
                  <div className="relative">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Простой процесс в 4 шага для полного контроля над вашим здоровьем
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Регистрация',
                description: 'Создайте аккаунт и выберите подходящий тариф'
              },
              {
                step: '2',
                title: 'Загрузка данных',
                description: 'Добавьте результаты анализов и данные о здоровье'
              },
              {
                step: '3',
                title: 'ИИ-анализ',
                description: 'Получите детальный анализ и персональные рекомендации'
              },
              {
                step: '4',
                title: 'Мониторинг',
                description: 'Отслеживайте прогресс и корректируйте стратегию'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-evergreen-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-evergreen-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50,000+', label: 'Проанализированных анализов' },
              { number: '15,000+', label: 'Активных пользователей' },
              { number: '98%', label: 'Точность ИИ-анализа' },
              { number: '24/7', label: 'Доступность сервисов' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Начните контролировать свое здоровье уже сегодня</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединитесь к тысячам пользователей, которые уже улучшили свое здоровье с помощью наших сервисов
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-evergreen-600 hover:bg-evergreen-700">
                Начать бесплатно
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                Посмотреть тарифы
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ServicesPage;
