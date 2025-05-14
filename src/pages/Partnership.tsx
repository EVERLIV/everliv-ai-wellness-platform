
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake, Building, UserPlus, Stethoscope, TrendingUp, CheckCircle } from 'lucide-react';

// Создаем компонент иконки Handshake
const Handshake = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
    </svg>
  );
};

const Partnership = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <section className="py-12 bg-gradient-to-b from-primary/10 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Партнерство с EVERLIV</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Присоединяйтесь к экосистеме здоровья и долголетия. Вместе мы можем предложить больше ценности вашим клиентам и пациентам.
            </p>
            <Button size="lg">Стать партнером</Button>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Кому подходит партнерство с нами</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Stethoscope className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Врачам и медицинским специалистам</h3>
                    <p className="text-gray-600">
                      Расширьте спектр предлагаемых услуг, используя нашу технологическую платформу и доступ к передовым протоколам здоровья.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Building className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Клиникам и медицинским центрам</h3>
                    <p className="text-gray-600">
                      Предложите вашим пациентам инновационные услуги по профилактике заболеваний и активному долголетию.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <UserPlus className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Фитнес-тренерам и нутрициологам</h3>
                    <p className="text-gray-600">
                      Используйте наши данные и аналитику для создания более персонализированных программ для ваших клиентов.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Преимущества партнерства</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Доступ к технологической платформе</h3>
                    <p className="text-gray-700">
                      Используйте нашу платформу для анализа данных здоровья, создания персонализированных рекомендаций и мониторинга прогресса ваших клиентов.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Специальные условия</h3>
                    <p className="text-gray-700">
                      Партнеры получают доступ к услугам EVERLIV на особых условиях с возможностью предложения этих услуг своим клиентам.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Обучение и поддержка</h3>
                    <p className="text-gray-700">
                      Мы предоставляем обучающие материалы и техническую поддержку для всех наших партнеров, чтобы обеспечить успешное сотрудничество.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Маркетинговая поддержка</h3>
                    <p className="text-gray-700">
                      Мы предоставляем материалы для продвижения услуг и включаем информацию о партнерах на нашем сайте и в маркетинговых кампаниях.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Расширение клиентской базы</h3>
                    <p className="text-gray-700">
                      Партнеры получают доступ к нашей растущей базе пользователей, заинтересованных в услугах по улучшению здоровья.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Участие в исследованиях</h3>
                    <p className="text-gray-700">
                      Возможность участия в научных исследованиях и разработке новых протоколов здоровья вместе с нашими экспертами.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Варианты сотрудничества</h2>
            
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Реферальная программа</h3>
                  <p className="text-gray-700 mb-4">
                    Рекомендуйте наши услуги и получайте вознаграждение за каждого нового клиента. Идеально подходит для индивидуальных специалистов, которые хотят предложить своим клиентам дополнительные ценности без изменения своей основной деятельности.
                  </p>
                  <Button variant="outline" className="mt-2">Узнать подробнее</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Интеграция с вашими услугами</h3>
                  <p className="text-gray-700 mb-4">
                    Внедрите наши протоколы и технологии в ваш существующий бизнес. Этот вариант идеален для клиник, медицинских центров и крупных компаний, заинтересованных в расширении спектра услуг.
                  </p>
                  <Button variant="outline" className="mt-2">Узнать подробнее</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Франшиза EVERLIV</h3>
                  <p className="text-gray-700 mb-4">
                    Откройте собственный центр под брендом EVERLIV с полной поддержкой нашей команды, включая обучение персонала, маркетинговые материалы и доступ ко всем нашим технологиям и протоколам.
                  </p>
                  <Button variant="outline" className="mt-2">Узнать подробнее</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Начните партнерство сегодня</h2>
            <p className="text-xl text-gray-700 mb-8">
              Заполните форму заявки, и наш менеджер по партнерским отношениям свяжется с вами в течение 24 часов для обсуждения деталей сотрудничества.
            </p>
            <Button size="lg">Оставить заявку</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partnership;
