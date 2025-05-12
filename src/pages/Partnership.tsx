
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Handshake, Building2, Users, Globe, Award, TrendingUp, ChevronRight, CheckCircle, FileText } from 'lucide-react';

const Partnership = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="Партнерская программа"
          description="Присоединяйтесь к нашей экосистеме и развивайте свой бизнес вместе с EVERLIV"
        />
        
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 border-t-4 border-primary">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Handshake className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Для медицинских учреждений</h3>
                  <p className="text-gray-600 mb-6">
                    Интегрируйте наши решения в ваш медицинский центр и предлагайте пациентам передовые возможности для мониторинга и улучшения здоровья.
                  </p>
                  <ul className="text-left w-full mb-6">
                    <li className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Доступ к платформе анализа биомаркеров</span>
                    </li>
                    <li className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Интеграция с медицинской информационной системой</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Обучение персонала и техническая поддержка</span>
                    </li>
                  </ul>
                  <Button className="w-full">Узнать подробнее</Button>
                </CardContent>
              </Card>
              
              <Card className="p-6 border-t-4 border-primary">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Для корпоративных клиентов</h3>
                  <p className="text-gray-600 mb-6">
                    Оздоровительные программы для сотрудников и корпоративные решения для улучшения здоровья и производительности вашего коллектива.
                  </p>
                  <ul className="text-left w-full mb-6">
                    <li className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Групповые программы мониторинга здоровья</span>
                    </li>
                    <li className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Аналитика здоровья на уровне организации</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Корпоративные тарифы и индивидуальные условия</span>
                    </li>
                  </ul>
                  <Button className="w-full">Узнать подробнее</Button>
                </CardContent>
              </Card>
              
              <Card className="p-6 border-t-4 border-primary">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Для медицинских специалистов</h3>
                  <p className="text-gray-600 mb-6">
                    Расширьте ваши возможности с помощью нашей платформы и технологий искусственного интеллекта для лучшей диагностики и лечения.
                  </p>
                  <ul className="text-left w-full mb-6">
                    <li className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Инструменты AI-анализа результатов обследований</span>
                    </li>
                    <li className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Персонализированные протоколы для пациентов</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Реферальная система и комиссионные</span>
                    </li>
                  </ul>
                  <Button className="w-full">Узнать подробнее</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-center">Преимущества сотрудничества</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-8 rounded-xl">
                  <Globe className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Расширение возможностей</h3>
                  <p className="text-gray-600">
                    Предложите вашим клиентам передовые решения в области здравоохранения, использующие новейшие технологии искусственного интеллекта и научный подход.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-xl">
                  <Award className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Повышение ценности услуг</h3>
                  <p className="text-gray-600">
                    Дополните ваши услуги инновационными инструментами и технологиями, которые помогут вашим клиентам достичь лучших результатов в здоровье и продолжительности жизни.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-xl">
                  <TrendingUp className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Дополнительный доход</h3>
                  <p className="text-gray-600">
                    Привлекательные условия партнерской программы с комиссией до 30% и прозрачной системой выплат. Возможность построения пассивного дохода в долгосрочной перспективе.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">Как стать партнером EVERLIV?</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Заполните партнерскую анкету</h3>
                    <p className="text-gray-600">Расскажите о своей организации или профессиональном опыте и целях сотрудничества</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Пройдите интервью с менеджером</h3>
                    <p className="text-gray-600">Обсудите детали сотрудничества и выберите оптимальную модель партнерства</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Подпишите партнерское соглашение</h3>
                    <p className="text-gray-600">Формализуйте сотрудничество и получите доступ к партнерским материалам и инструментам</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Начните зарабатывать</h3>
                    <p className="text-gray-600">Получайте комиссию с каждой успешной сделки и расширяйте свой доход с ростом клиентской базы</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Скачать презентацию
                </Button>
                <Button size="lg" variant="outline" className="flex items-center gap-2">
                  Связаться с нами
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-12 rounded-2xl text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Успешные истории партнеров</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Клиника "МедЭксперт"</h3>
                    <p className="text-gray-700 mb-4">
                      "После интеграции с EVERLIV мы увеличили приток новых пациентов на 35% и расширили спектр услуг без дополнительных затрат на персонал."
                    </p>
                    <p className="font-medium text-primary">Директор клиники</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">ООО "ЗдоровьеПлюс"</h3>
                    <p className="text-gray-700 mb-4">
                      "Партнерство с EVERLIV позволило нам предложить корпоративным клиентам инновационные программы заботы о здоровье, что привлекло крупных заказчиков."
                    </p>
                    <p className="font-medium text-primary">Генеральный директор</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Др. Анна Соколова</h3>
                    <p className="text-gray-700 mb-4">
                      "Как врач-эндокринолог, я получила дополнительный инструмент для диагностики и мониторинга пациентов, а также стабильный дополнительный доход."
                    </p>
                    <p className="font-medium text-primary">Врач-эндокринолог</p>
                  </CardContent>
                </Card>
              </div>
              
              <Button size="lg">Присоединиться к успешным партнерам</Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-6">Готовы начать сотрудничество?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Заполните форму партнерской заявки, и наш менеджер свяжется с вами в ближайшее время для обсуждения деталей
            </p>
            <Button size="lg">Стать партнером</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partnership;
