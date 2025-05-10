
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Award, CalendarDays, MessageCircle } from "lucide-react";

const Community = () => {
  const testimonials = [
    {
      name: "Елена М.",
      age: 42,
      image: "https://placehold.co/100x100",
      text: "После 3 месяцев на платформе мой уровень воспаления снизился на 40%. Холодовые процедуры и интервальное голодание полностью изменили мою жизнь!",
      improvement: "Снижение СРБ на 40%"
    },
    {
      name: "Александр К.",
      age: 54,
      image: "https://placehold.co/100x100",
      text: "Мне удалось снизить биологический возраст на 5.2 года за полгода по программе EVERLIV. Наибольший эффект дали дыхательные практики и изменение режима питания.",
      improvement: "Снижение биовозраста на 5.2 года"
    },
    {
      name: "Наталья В.",
      age: 37,
      image: "https://placehold.co/100x100", 
      text: "Моя энергия и когнитивные способности значительно улучшились. Анализы показали улучшение всех метаболических маркеров. Спасибо за персонализированный подход!",
      improvement: "Улучшение метаболических маркеров"
    }
  ];

  const challenges = [
    {
      title: "30 дней холодного душа",
      period: "1-30 июня",
      participants: 1240,
      description: "Постепенное увеличение времени под холодной водой для укрепления иммунитета и повышения энергии."
    },
    {
      title: "Челлендж 16:8",
      period: "10-30 июля",
      participants: 865,
      description: "Интервальное голодание по схеме 16:8 для улучшения метаболического здоровья и чувствительности к инсулину."
    },
    {
      title: "21 день дыхательных практик",
      period: "1-21 августа",
      participants: 720,
      description: "Ежедневные 10-минутные сессии по методу Вим Хофа для улучшения стрессоустойчивости."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Сообщество EVERLIV</h1>
              <p className="text-lg text-gray-600 mb-8">
                Присоединяйтесь к растущему сообществу людей, стремящихся к долгой и здоровой жизни.
                Делитесь опытом, участвуйте в челленджах и вдохновляйте других.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Присоединиться
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Текущие челленджи
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Истории успеха</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{testimonial.name}, {testimonial.age}</h3>
                      <p className="text-sm text-green-600">{testimonial.improvement}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button variant="outline">Посмотреть больше историй</Button>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">Текущие челленджи</h2>
              <Link to="/challenges">
                <Button variant="link" className="text-primary">Все челленджи</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {challenges.map((challenge, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    <span>{challenge.period}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{challenge.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{challenge.participants} участников</span>
                    <Button size="sm">Присоединиться</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Forum Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Форум сообщества</h2>
            
            <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                Популярные обсуждения
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border border-gray-100">
                  <h4 className="font-medium mb-1">Как правильно начать холодовые процедуры?</h4>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>42 комментария</span>
                    <span>Последний ответ: 2 часа назад</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded border border-gray-100">
                  <h4 className="font-medium mb-1">Делимся опытом интервального голодания 20:4</h4>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>89 комментариев</span>
                    <span>Последний ответ: вчера</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded border border-gray-100">
                  <h4 className="font-medium mb-1">Какие добавки помогли вам снизить воспаление?</h4>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>56 комментариев</span>
                    <span>Последний ответ: 3 дня назад</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/forum">
                  <Button>Перейти на форум</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Станьте частью сообщества здоровья</h2>
              <p className="text-lg text-gray-600 mb-8">
                Присоединяйтесь к тысячам единомышленников, делитесь опытом и вдохновляйтесь историями успеха.
              </p>
              <Link to="/signup">
                <Button size="lg" className="px-8">Создать аккаунт</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
