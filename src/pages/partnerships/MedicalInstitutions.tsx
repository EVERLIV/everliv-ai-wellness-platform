
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hospital, HeartPulse, Stethoscope, FileText, BarChart3, Award, CheckCircle, ChevronRight, Users } from 'lucide-react';
import { Link } from "react-router-dom";

const MedicalInstitutions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="Партнерская программа для медицинских учреждений"
          description="Интегрируйте инновационные решения EVERLIV в вашу клинику и предлагайте пациентам передовые возможности для мониторинга и улучшения здоровья"
        />
        
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Комплексные решения для современных клиник</h2>
                <p className="text-gray-600 mb-6">
                  EVERLIV предлагает интеграцию передовых технологий искусственного интеллекта и научно обоснованных
                  методик в рабочие процессы вашей клиники. Наши решения помогут вам:
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Повысить качество диагностики и профилактических мер</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Предоставить вашим пациентам персонализированные программы оздоровления</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Расширить спектр услуг и создать новые источники дохода</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Увеличить вовлеченность пациентов и улучшить результаты лечения</span>
                  </li>
                </ul>
                <Link to="/contact">
                  <Button size="lg" className="rounded-full">Узнать условия сотрудничества</Button>
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=880&h=580" 
                  alt="Современная клиника с технологиями EVERLIV" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Наши решения для медицинских учреждений</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Hospital className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Интеграция с медицинской информационной системой</h3>
                  <p className="text-gray-600 mb-6">
                    Бесшовная интеграция решений EVERLIV с существующей медицинской информационной системой вашей клиники.
                    Анализ биомаркеров и персонализированные рекомендации будут доступны в электронных медицинских картах.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Единый интерфейс для всех данных пациента</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Автоматический анализ результатов лабораторных исследований</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Защищенный обмен данными с соблюдением требований к конфиденциальности</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <HeartPulse className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Мониторинг показателей здоровья</h3>
                  <p className="text-gray-600 mb-6">
                    Предложите пациентам комплексный мониторинг ключевых биомаркеров и показателей здоровья
                    с персонализированными рекомендациями и программами профилактики.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Детальное отслеживание динамики биомаркеров</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>AI-прогнозирование рисков заболеваний</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Система уведомлений о критических изменениях показателей</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Программы групповой профилактики</h3>
                  <p className="text-gray-600 mb-6">
                    Организуйте групповые программы профилактики и оздоровления для своих пациентов, 
                    основанные на научных данных и персонализированном подходе.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Готовые программы для разных групп пациентов</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Аналитика эффективности программ</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Материалы для проведения групповых занятий</span>
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
                <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-xl">
                  <div className="bg-white p-8 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Показатели эффективности внедрения</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Увеличение числа новых пациентов</span>
                        <span className="text-primary font-bold">до 35%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Повышение удовлетворенности пациентов</span>
                        <span className="text-primary font-bold">до 42%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Рост среднего чека услуг клиники</span>
                        <span className="text-primary font-bold">до 28%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Улучшение клинических результатов</span>
                        <span className="text-primary font-bold">до 30%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6">Преимущества для вашей клиники</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Новые источники дохода</h3>
                      <p className="text-gray-600">
                        Расширьте спектр услуг вашей клиники за счет инновационных решений EVERLIV, создавая
                        новые источники дохода без дополнительных затрат на оборудование и персонал.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Улучшение качества медицинской помощи</h3>
                      <p className="text-gray-600">
                        Предлагайте пациентам персонализированный подход к профилактике и лечению,
                        основанный на детальном анализе биомаркеров и учете индивидуальных особенностей.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Повышение конкурентоспособности</h3>
                      <p className="text-gray-600">
                        Выделите вашу клинику на фоне конкурентов, предлагая пациентам инновационный подход
                        к профилактике и лечению с использованием передовых технологий и методик.
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
            <h2 className="text-3xl font-bold text-center mb-12">Процесс подключения</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-md p-8 relative">
                  <div className="absolute top-0 right-0 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center -mt-4 -mr-4 border-4 border-white">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Консультация и демонстрация</h3>
                  <p className="text-gray-600">
                    Наши специалисты проведут презентацию решений EVERLIV для руководства клиники,
                    продемонстрируют все возможности системы и ответят на вопросы.
                  </p>
                  <div className="mt-6">
                    <Link to="/contact">
                      <Button variant="outline">Запросить демонстрацию</Button>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8 relative">
                  <div className="absolute top-0 right-0 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center -mt-4 -mr-4 border-4 border-white">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Техническая интеграция</h3>
                  <p className="text-gray-600">
                    Наша техническая команда проведет интеграцию решений EVERLIV с информационной
                    системой вашей клиники, настроит параметры и проведет обучение персонала.
                  </p>
                  <div className="mt-6">
                    <Button variant="outline" disabled>3-5 рабочих дней</Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8 relative">
                  <div className="absolute top-0 right-0 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center -mt-4 -mr-4 border-4 border-white">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Обучение персонала</h3>
                  <p className="text-gray-600">
                    Проводим полное обучение медицинского персонала вашей клиники работе с системой,
                    интерпретации результатов и созданию персонализированных программ для пациентов.
                  </p>
                  <div className="mt-6">
                    <Button variant="outline" disabled>1-2 рабочих дня</Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8 relative">
                  <div className="absolute top-0 right-0 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center -mt-4 -mr-4 border-4 border-white">
                    4
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Запуск и сопровождение</h3>
                  <p className="text-gray-600">
                    После запуска системы мы продолжаем оказывать техническую поддержку, консультировать
                    персонал и развивать функциональность согласно потребностям вашей клиники.
                  </p>
                  <div className="mt-6">
                    <Button variant="outline" disabled>Постоянная поддержка</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-12 rounded-2xl">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Истории успеха наших партнеров</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">Клиника "МедЭксперт"</h3>
                      <p className="text-gray-700 mb-4">
                        "После внедрения EVERLIV мы смогли предложить пациентам уникальный сервис персонализированного
                        мониторинга здоровья. Это привело к увеличению лояльности пациентов и росту повторных обращений на 40%."
                      </p>
                      <p className="font-medium text-primary">Главный врач клиники</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">Медицинский центр "Здоровье+"</h3>
                      <p className="text-gray-700 mb-4">
                        "Интеграция с EVERLIV позволила нам запустить новое направление превентивной медицины и
                        привлечь дополнительно 200+ пациентов за первые три месяца работы."
                      </p>
                      <p className="font-medium text-primary">Директор по развитию</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">Сеть клиник "Vita"</h3>
                      <p className="text-gray-700 mb-4">
                        "Благодаря EVERLIV мы смогли стандартизировать подход к профилактике во всех клиниках
                        нашей сети и улучшить качество обслуживания пациентов."
                      </p>
                      <p className="font-medium text-primary">Медицинский директор сети</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Link to="/contact">
                  <Button size="lg">Стать партнером EVERLIV</Button>
                </Link>
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
                  <h3 className="text-lg font-semibold mb-2">Какое техническое оснащение требуется для внедрения EVERLIV?</h3>
                  <p className="text-gray-600">
                    Для работы с EVERLIV не требуется специальное оборудование. Система работает через веб-интерфейс 
                    и мобильное приложение, доступ к которым можно получить с любого современного устройства с доступом в интернет.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Как защищены данные пациентов в системе EVERLIV?</h3>
                  <p className="text-gray-600">
                    EVERLIV использует современные методы шифрования данных и соответствует всем требованиям 
                    законодательства о защите персональных данных. Вся информация хранится на защищенных серверах 
                    с ограниченным доступом и регулярным резервным копированием.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Какие финансовые условия сотрудничества?</h3>
                  <p className="text-gray-600">
                    Мы предлагаем гибкие финансовые модели, включая абонентскую плату за использование системы, 
                    процент от услуг или комбинированные варианты. Конкретные условия зависят от размера клиники, 
                    количества пациентов и набора используемых функций. Для получения индивидуального предложения 
                    свяжитесь с нашим отделом по работе с партнерами.
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
            <h2 className="text-3xl font-bold text-white mb-6">Готовы стать партнером EVERLIV?</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Свяжитесь с нами сегодня, чтобы узнать больше о возможностях сотрудничества и получить
              индивидуальное предложение для вашей клиники.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
                  Обсудить сотрудничество
                </Button>
              </Link>
              <Link to="/partnership">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <FileText className="mr-2 h-5 w-5" />
                  Получить презентацию
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

export default MedicalInstitutions;
