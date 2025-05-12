
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, BarChart3, Briefcase, FileText, Users, Award, CheckCircle, ChevronRight, Presentation } from 'lucide-react';
import { Link } from "react-router-dom";

const CorporateClients = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="EVERLIV для корпоративных клиентов"
          description="Комплексные программы поддержки здоровья сотрудников для повышения их продуктивности и благополучия"
        />
        
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Здоровые сотрудники — успешный бизнес</h2>
                <p className="text-gray-600 mb-6">
                  Корпоративные программы EVERLIV помогают компаниям заботиться о здоровье сотрудников, 
                  снижать заболеваемость, повышать производительность и создавать позитивную корпоративную культуру.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-primary font-bold text-3xl mb-1">-22%</div>
                    <div className="text-gray-600 text-sm">Снижение количества больничных дней</div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-primary font-bold text-3xl mb-1">+17%</div>
                    <div className="text-gray-600 text-sm">Рост продуктивности сотрудников</div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-primary font-bold text-3xl mb-1">+35%</div>
                    <div className="text-gray-600 text-sm">Увеличение вовлеченности персонала</div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-primary font-bold text-3xl mb-1">-19%</div>
                    <div className="text-gray-600 text-sm">Снижение текучести кадров</div>
                  </div>
                </div>
                <Link to="/contact">
                  <Button size="lg" className="rounded-full">Запросить корпоративное предложение</Button>
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=880&h=580" 
                  alt="Корпоративная программа здоровья EVERLIV" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Наши корпоративные предложения</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Диагностика и мониторинг здоровья</h3>
                  <p className="text-gray-600 mb-6">
                    Комплексное обследование сотрудников с анализом биомаркеров и выявлением ключевых 
                    показателей здоровья. Регулярный мониторинг и отслеживание динамики.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Расширенный анализ крови и биомаркеров</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Определение биологического возраста</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Персональный дашборд с динамикой показателей</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Групповые оздоровительные программы</h3>
                  <p className="text-gray-600 mb-6">
                    Корпоративные программы поддержки здоровья, включающие вебинары, практические 
                    занятия и рекомендации для разных групп сотрудников.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Регулярные тематические вебинары по здоровью</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Корпоративные челленджи по здоровому образу жизни</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Групповые занятия и мастер-классы</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <BarChart3 className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Аналитика и отчетность</h3>
                  <p className="text-gray-600 mb-6">
                    Детальная аналитика состояния здоровья коллектива, выявление ключевых тенденций
                    и оценка эффективности оздоровительных программ.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Аналитический дашборд для HR-специалистов</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Статистика заболеваемости и рисков</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Ежеквартальные отчеты по эффективности программ</span>
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
              <div className="order-2 lg:order-1 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=880&h=580" 
                  alt="Команда EVERLIV в офисе корпоративного клиента" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6">Как мы работаем с корпоративными клиентами</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Аудит здоровья коллектива</h3>
                      <p className="text-gray-600">
                        Проводим анализ текущего состояния здоровья сотрудников, выявляем ключевые риски и определяем
                        приоритетные направления оздоровительных программ.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Разработка программы</h3>
                      <p className="text-gray-600">
                        Создаем комплексную программу оздоровления, учитывающую специфику вашей компании, возрастную 
                        структуру коллектива и характер деятельности сотрудников.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Реализация и сопровождение</h3>
                      <p className="text-gray-600">
                        Обеспечиваем полное сопровождение программы, проводим запланированные мероприятия
                        и осуществляем регулярный мониторинг эффективности предпринимаемых мер.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">4</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Анализ результатов и корректировка</h3>
                      <p className="text-gray-600">
                        Регулярно анализируем результаты программы, предоставляем отчеты руководству компании
                        и вносим необходимые корректировки для достижения максимальной эффективности.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to="/contact">
                    <Button>Обсудить вашу программу</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Преимущества корпоративных программ EVERLIV</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Индивидуальный подход</h3>
                <p className="text-gray-600">
                  Персонализированные программы для каждого сотрудника с учетом особенностей здоровья
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Измеримый результат</h3>
                <p className="text-gray-600">
                  Комплексная система оценки эффективности и визуализация конкретных результатов
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Комплексный подход</h3>
                <p className="text-gray-600">
                  Программы охватывают все аспекты здоровья: физическое, психологическое и эмоциональное
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Presentation className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Научный подход</h3>
                <p className="text-gray-600">
                  Все программы основаны на современных научных данных и передовых исследованиях
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-12 rounded-2xl">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Истории успеха наших корпоративных клиентов</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <Building2 className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">ООО "ТехноИнновации"</h3>
                          <p className="text-sm text-gray-500">IT-компания, 120 сотрудников</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">
                        "Благодаря программе EVERLIV мы смогли сократить количество больничных дней на 27% и 
                        повысить удовлетворенность сотрудников на 22%. Особенно ценно, что решения 
                        учитывают специфику работы IT-специалистов."
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-primary">HR-директор</p>
                        <div className="flex">
                          <Award className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="text-sm">12 месяцев сотрудничества</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <Building2 className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">АО "ФинансГрупп"</h3>
                          <p className="text-sm text-gray-500">Финансовый холдинг, 350 сотрудников</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">
                        "Внедрение корпоративной программы EVERLIV позволило нам создать культуру здоровья 
                        в компании. Сотрудники стали больше внимания уделять профилактике, а уровень 
                        стресса заметно снизился."
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-primary">Директор по персоналу</p>
                        <div className="flex">
                          <Award className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="text-sm">18 месяцев сотрудничества</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center">
                  <Link to="/contact">
                    <Button size="lg">Стать корпоративным клиентом EVERLIV</Button>
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
                  <h3 className="text-lg font-semibold mb-2">Какие минимальные требования для подключения корпоративной программы?</h3>
                  <p className="text-gray-600">
                    Мы работаем с компаниями любого размера, минимальное количество сотрудников для подключения к программе - 10 человек.
                    Для небольших компаний мы предлагаем специальные пакеты с оптимальным соотношением функциональности и стоимости.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Как обеспечивается конфиденциальность данных сотрудников?</h3>
                  <p className="text-gray-600">
                    Мы строго соблюдаем требования законодательства о защите персональных данных. Сотрудники компании имеют полный 
                    контроль над своими данными и могут управлять их доступностью. Руководство и HR-специалисты видят только 
                    обобщенную статистику без доступа к индивидуальной медицинской информации.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Можно ли интегрировать программу EVERLIV с существующими корпоративными системами?</h3>
                  <p className="text-gray-600">
                    Да, мы предлагаем различные варианты интеграции с корпоративными системами, включая HR-платформы, 
                    корпоративные порталы и мобильные приложения. Наша техническая команда проводит интеграцию и обеспечивает 
                    бесперебойную работу всех систем.
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
            <h2 className="text-3xl font-bold text-white mb-6">Повысьте эффективность вашего бизнеса через здоровье сотрудников</h2>
            <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
              Здоровые сотрудники — залог успешного бизнеса. Свяжитесь с нами сегодня, чтобы получить 
              индивидуальное предложение по корпоративной программе EVERLIV для вашей компании.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
                  Запросить консультацию
                </Button>
              </Link>
              <Link to="/partnership">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <FileText className="mr-2 h-5 w-5" />
                  Получить корпоративное предложение
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

export default CorporateClients;
