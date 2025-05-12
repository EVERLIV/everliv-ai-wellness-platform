
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Handshake, Building2, Users, Globe, Award, TrendingUp } from 'lucide-react';

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
              <Card className="p-6">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Handshake className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Для медицинских учреждений</h3>
                  <p className="text-gray-600 mb-4">
                    Интегрируйте наши решения в ваш медицинский центр и предлагайте пациентам передовые возможности.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Для корпоративных клиентов</h3>
                  <p className="text-gray-600 mb-4">
                    Оздоровительные программы для сотрудников и корпоративные решения для вашей компании.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Для медицинских специалистов</h3>
                  <p className="text-gray-600 mb-4">
                    Расширьте ваши возможности с помощью нашей платформы и технологий искусственного интеллекта.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-8 text-center">Преимущества сотрудничества</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4">
                  <Globe className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Расширение возможностей</h3>
                    <p className="text-gray-600 text-sm">Предложите вашим клиентам передовые решения в области здравоохранения.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Award className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Повышение ценности услуг</h3>
                    <p className="text-gray-600 text-sm">Дополните ваши услуги инновационными инструментами и технологиями.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <TrendingUp className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Дополнительный доход</h3>
                    <p className="text-gray-600 text-sm">Привлекательные условия партнерской программы и реферальная система.</p>
                  </div>
                </div>
              </div>
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
