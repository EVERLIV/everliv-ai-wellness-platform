
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Upload, Brain, ListChecks, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      icon: <CheckCircle className="w-10 h-10 text-green-500" />,
      title: "Зарегистрируйтесь",
      description: "Создайте личный аккаунт, заполните информацию о себе и вашем здоровье для более точных рекомендаций."
    },
    {
      icon: <Upload className="w-10 h-10 text-blue-500" />,
      title: "Загрузите анализы крови",
      description: "Загрузите результаты ваших анализов крови в систему. Поддерживаются все основные форматы лабораторий."
    },
    {
      icon: <Brain className="w-10 h-10 text-purple-500" />,
      title: "Получите ИИ-анализ",
      description: "Наша система искусственного интеллекта проанализирует ваши показатели и выявит потенциальные проблемы и возможности для улучшения."
    },
    {
      icon: <ListChecks className="w-10 h-10 text-amber-500" />,
      title: "Следуйте персональному плану",
      description: "Получите индивидуальный план по улучшению здоровья, включающий рекомендации по питанию, добавкам и процедурам."
    },
    {
      icon: <Share2 className="w-10 h-10 text-pink-500" />,
      title: "Следите за прогрессом и делитесь им",
      description: "Отслеживайте изменения в показателях здоровья со временем и делитесь успехами с друзьями или сообществом."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Как работает EVERLIV</h1>
              <p className="text-lg text-gray-600 mb-8">
                Узнайте, как наша платформа использует искусственный интеллект и научные методы для улучшения вашего здоровья и продления жизни.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg">Начать бесплатно</Button>
                </Link>
                <Link to="/science">
                  <Button variant="outline" size="lg">Узнать о научной базе</Button>
                </Link>
              </div>
              <div className="mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80" 
                  alt="EVERLIV процесс"
                  className="rounded-lg shadow-md mx-auto max-w-full h-auto"
                  style={{ maxHeight: "350px" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Пошаговый процесс</h2>
            
            <div className="max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="mb-16 relative">
                  <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-shrink-0 bg-white p-4 rounded-full shadow-lg">
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3">Шаг {index + 1}: {step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Connect line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-10 top-full h-8 w-0.5 bg-gray-200 hidden md:block mx-auto"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Посмотрите, как это работает на практике</h2>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                  alt="Видеодемонстрация платформы" 
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Часто задаваемые вопросы</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Какие форматы анализов вы поддерживаете?</h3>
                  <p className="text-gray-600">Мы поддерживаем все основные форматы, включая PDF, фотографии и данные из большинства крупных лабораторий. Вы можете загрузить документы или ввести данные вручную.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Безопасны ли мои данные?</h3>
                  <p className="text-gray-600">Мы используем шифрование и соблюдаем все стандарты защиты медицинских данных. Ваша приватность - наш приоритет. Вы всегда контролируете, кто имеет доступ к вашей информации.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Как часто я должен загружать новые анализы?</h3>
                  <p className="text-gray-600">Для оптимального отслеживания прогресса рекомендуется обновлять анализы каждые 2-3 месяца. Это позволит системе точнее оценивать эффективность рекомендаций.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Готовы начать свой путь к лучшему здоровью?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Присоединяйтесь к тысячам пользователей, которые уже улучшили свое здоровье с помощью EVERLIV.
              </p>
              <Link to="/signup">
                <Button size="lg" className="px-8">Начать бесплатно</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
