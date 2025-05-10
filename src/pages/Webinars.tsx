
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Calendar, Clock, User, Filter } from "lucide-react";

const Webinars = () => {
  const upcomingWebinars = [
    {
      id: 1,
      title: "Холодовые практики и иммунитет: научный подход",
      speaker: "Дмитрий Соколов, MD, PhD",
      date: "15 июня 2025",
      time: "18:00 МСК",
      image: "https://placehold.co/800x450",
      topic: "Холод"
    },
    {
      id: 2,
      title: "Интервальное голодание для долголетия и метаболического здоровья",
      speaker: "Анна Петрова, нутрициолог",
      date: "20 июня 2025",
      time: "19:30 МСК",
      image: "https://placehold.co/800x450",
      topic: "Голодание"
    },
    {
      id: 3,
      title: "Дыхательные практики как инструмент управления стрессом и здоровьем",
      speaker: "Михаил Волков, MD",
      date: "25 июня 2025",
      time: "20:00 МСК",
      image: "https://placehold.co/800x450",
      topic: "Дыхание"
    }
  ];

  const pastWebinars = [
    {
      id: 4,
      title: "Анализы крови: на что обращать внимание для долголетия",
      speaker: "Ирина Смирнова, MD, PhD",
      date: "5 мая 2025",
      views: 1240,
      image: "https://placehold.co/800x450",
      topic: "Анализы"
    },
    {
      id: 5,
      title: "Кислородная терапия: мифы и научные факты",
      speaker: "Александр Иванов, PhD",
      date: "28 апреля 2025",
      views: 980,
      image: "https://placehold.co/800x450",
      topic: "Кислород"
    },
    {
      id: 6,
      title: "Добавки для когнитивного здоровья и профилактики нейродегенерации",
      speaker: "Елена Козлова, нутрициолог",
      date: "15 апреля 2025",
      views: 1560,
      image: "https://placehold.co/800x450",
      topic: "Добавки"
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
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Экспертные сессии и вебинары</h1>
              <p className="text-lg text-gray-600 mb-8">
                Обучайтесь у ведущих специалистов в области здоровья, долголетия и оптимизации образа жизни.
                Получайте знания напрямую от экспертов и задавайте им свои вопросы.
              </p>
              <Button size="lg" className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Календарь вебинаров
              </Button>
            </div>
          </div>
        </section>

        {/* Upcoming Webinars Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Ближайшие вебинары</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Фильтр
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {upcomingWebinars.map((webinar) => (
                <div key={webinar.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                  <div className="relative">
                    <img src={webinar.image} alt={webinar.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded">
                      {webinar.topic}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{webinar.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <User className="w-4 h-4 mr-1" />
                      <span>{webinar.speaker}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{webinar.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{webinar.time}</span>
                      </div>
                    </div>
                    <Button className="w-full">Зарегистрироваться</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Past Webinars Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Архив вебинаров</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pastWebinars.map((webinar) => (
                <div key={webinar.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="relative">
                    <img src={webinar.image} alt={webinar.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {webinar.topic}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{webinar.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <User className="w-4 h-4 mr-1" />
                      <span>{webinar.speaker}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{webinar.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span>{webinar.views} просмотров</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">Смотреть запись</Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button>Показать больше</Button>
            </div>
          </div>
        </section>

        {/* Expert Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Наши эксперты</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <img src="https://placehold.co/200x200" alt="Expert" className="w-32 h-32 rounded-full object-cover" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Дмитрий Соколов, MD, PhD</h3>
                    <p className="text-primary mb-3">Эксперт по холодовым практикам и иммунологии</p>
                    <p className="text-gray-700 mb-4">
                      Более 15 лет исследований в области влияния экстремальных температур на иммунную систему человека.
                      Автор более 40 научных публикаций и методологии по адаптации к холоду для оптимизации здоровья.
                    </p>
                    <Button variant="outline" size="sm">Все вебинары эксперта</Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link to="/experts">
                  <Button>Смотреть всех экспертов</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Предложите тему для следующего вебинара</h2>
              <p className="text-lg text-gray-600 mb-8">
                Какие темы о здоровье и долголетии интересуют именно вас? Поделитесь своими идеями, 
                и мы организуем вебинар с участием эксперта в этой области.
              </p>
              <Button size="lg">Предложить тему</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Webinars;
