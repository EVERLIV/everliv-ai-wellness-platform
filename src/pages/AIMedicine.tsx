
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Cpu, Shield, HeartPulse, LineChart, Users } from "lucide-react";

const AIMedicine = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="Искусственный интеллект в медицине"
          description="Как современные ИИ-технологии меняют подход к диагностике, лечению и профилактике заболеваний"
        />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Точность диагностики и персонализированный подход</h2>
                <p className="text-gray-700 mb-4">
                  Искусственный интеллект анализирует огромные массивы медицинских данных, выявляя паттерны и зависимости, недоступные человеческому глазу. Это позволяет создавать высокоточные прогностические модели для каждого пациента.
                </p>
                <p className="text-gray-700 mb-6">
                  В EVERLIV мы используем передовые ИИ-алгоритмы для анализа биомаркеров, генетических данных и истории здоровья, чтобы создать персонализированный план оздоровления и профилактики.
                </p>
                <Button size="lg">Узнать больше</Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=800&q=80" 
                  alt="AI в медицине" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Преимущества ИИ-технологий в EVERLIV</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start mb-4">
                    <Brain className="h-8 w-8 text-primary mr-4" />
                    <h3 className="text-xl font-semibold">Нейросети для анализа данных</h3>
                  </div>
                  <p className="text-gray-600">
                    Глубокий анализ лабораторных исследований и биомаркеров для выявления рисков и скрытых проблем со здоровьем.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start mb-4">
                    <HeartPulse className="h-8 w-8 text-primary mr-4" />
                    <h3 className="text-xl font-semibold">Прогнозирование рисков</h3>
                  </div>
                  <p className="text-gray-600">
                    Выявление потенциальных рисков заболеваний на основе комплексного анализа всех доступных медицинских данных.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start mb-4">
                    <LineChart className="h-8 w-8 text-primary mr-4" />
                    <h3 className="text-xl font-semibold">Мониторинг динамики</h3>
                  </div>
                  <p className="text-gray-600">
                    Отслеживание изменений состояния здоровья с течением времени и корректировка рекомендаций в реальном времени.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start mb-4">
                    <Cpu className="h-8 w-8 text-primary mr-4" />
                    <h3 className="text-xl font-semibold">Обработка исследований</h3>
                  </div>
                  <p className="text-gray-600">
                    Автоматизированный анализ медицинских изображений и лабораторных данных с высокой точностью и скоростью.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start mb-4">
                    <Shield className="h-8 w-8 text-primary mr-4" />
                    <h3 className="text-xl font-semibold">Безопасность данных</h3>
                  </div>
                  <p className="text-gray-600">
                    Надежная защита персональных медицинских данных при использовании ИИ-технологий согласно международным стандартам.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start mb-4">
                    <Users className="h-8 w-8 text-primary mr-4" />
                    <h3 className="text-xl font-semibold">Поддержка врачей</h3>
                  </div>
                  <p className="text-gray-600">
                    ИИ как ассистент для медицинских специалистов, дополняющий их опыт и экспертизу, а не заменяющий их.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Откройте новые возможности для вашего здоровья</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
              Используйте преимущества искусственного интеллекта для профилактики заболеваний и поддержания здорового долголетия
            </p>
            <Button size="lg">Начать использовать EVERLIV</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIMedicine;
