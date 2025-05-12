
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Brain, FileText, BarChart3, Users, Award, CheckCircle, ChevronRight, PieChart } from 'lucide-react';
import { Link } from "react-router-dom";

const MedicalSpecialists = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="EVERLIV для медицинских специалистов"
          description="Расширьте свои возможности с помощью инновационной платформы для диагностики, мониторинга и персонализированного лечения пациентов"
        />
        
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Современные инструменты для практикующих врачей</h2>
                <p className="text-gray-600 mb-6">
                  EVERLIV предоставляет врачам и медицинским специалистам инновационные инструменты для расширенного анализа
                  состояния пациентов, создания персонализированных программ лечения и мониторинга прогресса.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Использование искусственного интеллекта для анализа лабораторных показателей</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Создание индивидуальных протоколов лечения на основе научных данных</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Дистанционный мониторинг состояния пациентов в режиме реального времени</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Дополнительный источник дохода через реферальную программу</span>
                  </li>
                </ul>
                <Link to="/contact">
                  <Button size="lg" className="rounded-full">Начать сотрудничество</Button>
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=880&h=580" 
                  alt="Врач использует платформу EVERLIV" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Инструменты EVERLIV для медицинских специалистов</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Brain className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">AI-анализ биомаркеров</h3>
                  <p className="text-gray-600 mb-6">
                    Интеллектуальная система анализа лабораторных показателей с выявлением скрытых взаимосвязей
                    и предиктивной аналитикой развития заболеваний.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Расширенный анализ более 50 биомаркеров</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Выявление ранних признаков патологий</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Рекомендации по коррекции показателей</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <PieChart className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Система создания персонализированных протоколов</h3>
                  <p className="text-gray-600 mb-6">
                    Инструменты для быстрого создания индивидуальных протоколов лечения на основе
                    данных пациента и современных научных исследований.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Библиотека готовых шаблонов протоколов</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Интеграция с научными базами данных</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Система отслеживания эффективности протоколов</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Stethoscope className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Система мониторинга пациентов</h3>
                  <p className="text-gray-600 mb-6">
                    Удобный инструмент для дистанционного контроля состояния пациентов, отслеживания
                    выполнения рекомендаций и анализа динамики показателей.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Панель мониторинга пациентов</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Система уведомлений о критических изменениях</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Защищенный обмен данными с пациентами</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-xl">
                  <h3 className="text-xl font-bold mb-6">Финансовые преимущества для медицинских специалистов</h3>
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Комиссия за направленных пациентов</span>
                        <span className="text-primary font-bold">до 30%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Доход от разработанных протоколов</span>
                        <span className="text-primary font-bold">до 25%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Рост потока новых пациентов</span>
                        <span className="text-primary font-bold">до 40%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Link to="/contact">
                        <Button>Узнать детали реферальной программы</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6">Будьте в авангарде персонализированной медицины</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Доступ к передовым технологиям</h3>
                      <p className="text-gray-600">
                        Используйте возможности искусственного интеллекта и машинного обучения в своей медицинской практике,
                        не вкладывая средства в разработку технологий.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Расширьте свою экспертизу</h3>
                      <p className="text-gray-600">
                        Получите дополнительные знания в области функциональной, превентивной медицины и современных 
                        подходов к увеличению продолжительности здоровой жизни.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Повысьте свой профессиональный статус</h3>
                      <p className="text-gray-600">
                        Станьте признанным специалистом в области современных подходов к здоровью и долголетию, 
                        участвуйте в образовательных программах и публикациях.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Как начать сотрудничество</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute transform rotate-45 bg-primary text-white text-xs font-semibold text-center py-1 right-[-40px] top-[20px] w-[170px]">
                      Шаг 1
                    </div>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Регистрация</h3>
                  <p className="text-gray-600">Зарегистрируйтесь в партнерской программе EVERLIV для медицинских специалистов</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute transform rotate-45 bg-primary text-white text-xs font-semibold text-center py-1 right-[-40px] top-[20px] w-[170px]">
                      Шаг 2
                    </div>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Обучение</h3>
                  <p className="text-gray-600">Пройдите бесплатное онлайн-обучение работе с инструментами платформы</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute transform rotate-45 bg-primary text-white text-xs font-semibold text-center py-1 right-[-40px] top-[20px] w-[170px]">
                      Шаг 3
                    </div>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Stethoscope className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Внедрение</h3>
                  <p className="text-gray-600">Интегрируйте инструменты EVERLIV в свою медицинскую практику</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute transform rotate-45 bg-primary text-white text-xs font-semibold text-center py-1 right-[-40px] top-[20px] w-[170px]">
                      Шаг 4
                    </div>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Развитие</h3>
                  <p className="text-gray-600">Расширяйте свою практику и увеличивайте доход с EVERLIV</p>
                </div>
              </div>
              
              <div className="text-center">
                <Link to="/contact">
                  <Button size="lg">Начать сотрудничество</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-12 rounded-2xl">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Отзывы практикующих специалистов</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">Др. Анна Соколова</h3>
                      <p className="text-sm text-gray-500 mb-4">Врач-эндокринолог, к.м.н.</p>
                      <p className="text-gray-700 mb-4">
                        "Платформа EVERLIV предоставляет уникальные возможности для анализа гормонального
                        баланса и создания персонализированных протоколов коррекции. Мои пациенты отмечают
                        значительно лучшие результаты лечения."
                      </p>
                      <div className="flex">
                        <span className="text-yellow-500">★★★★★</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">Др. Михаил Петров</h3>
                      <p className="text-sm text-gray-500 mb-4">Терапевт, специалист по превентивной медицине</p>
                      <p className="text-gray-700 mb-4">
                        "Благодаря EVERLIV я смог внедрить в свою практику комплексный подход к профилактике
                        возрастных заболеваний и замедлению старения. Это привлекло новых пациентов и повысило
                        эффективность моей работы."
                      </p>
                      <div className="flex">
                        <span className="text-yellow-500">★★★★★</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">Др. Елена Иванова</h3>
                      <p className="text-sm text-gray-500 mb-4">Врач-диетолог</p>
                      <p className="text-gray-700 mb-4">
                        "Аналитические инструменты EVERLIV позволили мне создавать более точные нутрициологические
                        протоколы для пациентов с учетом их биохимических показателей и генетических особенностей.
                        Результаты говорят сами за себя!"
                      </p>
                      <div className="flex">
                        <span className="text-yellow-500">★★★★★</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center">
                  <Link to="/partnership">
                    <Button size="lg">Присоединиться к сообществу экспертов</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Часто задаваемые вопросы</h2>
              
              <div className="space-y-6 text-left">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Требуется ли дополнительное обучение для использования платформы?</h3>
                  <p className="text-gray-600">
                    EVERLIV предоставляет бесплатный курс обучения для всех партнеров. Курс включает в себя видеоуроки, 
                    практические занятия и консультации с нашими специалистами. Обучение занимает в среднем 4-6 часов и 
                    может быть пройдено в удобном для вас темпе.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Как происходит оплата за реферальных пациентов?</h3>
                  <p className="text-gray-600">
                    Мы предлагаем прозрачную систему вознаграждений. За каждого направленного пациента, который приобретает 
                    услуги EVERLIV, вы получаете комиссию до 30%. Выплаты производятся ежемесячно по удобной для вас схеме 
                    (банковский перевод, электронные платежные системы).
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Могу ли я использовать платформу для удаленных консультаций?</h3>
                  <p className="text-gray-600">
                    Да, EVERLIV включает в себя функциональность для проведения удаленных консультаций с пациентами, в том числе 
                    видеосвязь, обмен данными и создание рекомендаций в режиме онлайн. Это расширяет географию вашей практики 
                    и делает медицинскую помощь доступной для пациентов из любой точки мира.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/faq">
                  <Button variant="outline">Все часто задаваемые вопросы <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Трансформируйте свою медицинскую практику с EVERLIV</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к растущему сообществу прогрессивных медицинских специалистов, использующих современные
              технологии для улучшения результатов лечения и профилактики заболеваний.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
                  Связаться со специалистом
                </Button>
              </Link>
              <Link to="/partnership">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <FileText className="mr-2 h-5 w-5" />
                  Получить подробную информацию
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalSpecialists;
