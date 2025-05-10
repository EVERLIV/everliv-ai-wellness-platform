
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Award, Share2, BarChart3, Calendar, Building, User, Pill } from "lucide-react";

const Partnership = () => {
  const benefits = [
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: "Растущий доход",
      description: "Получайте до 30% комиссии с каждой продажи, привлеченной вами. Наша партнерская программа предлагает высокие ставки вознаграждения и долгосрочное сотрудничество."
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Помогайте другим",
      description: "Делитесь действительно полезными продуктами со своей аудиторией. Помогая людям улучшить их здоровье, вы создаете позитивное влияние и укрепляете доверие."
    },
    {
      icon: <Award className="w-12 h-12 text-primary" />,
      title: "Бонусы и вознаграждения",
      description: "Эксклюзивный доступ к новым функциям, особые промокоды для вашей аудитории, дополнительные бонусы за активное продвижение и достижение целей."
    }
  ];

  const partnerTypes = [
    {
      icon: <Building className="w-10 h-10 text-blue-500" />,
      title: "Лаборатории",
      description: "Предоставляйте анализы для наших пользователей и получайте стабильный поток клиентов.",
      commission: "15-20% за каждый анализ"
    },
    {
      icon: <User className="w-10 h-10 text-green-500" />,
      title: "Врачи и консультанты",
      description: "Проводите консультации, интерпретируйте данные и предоставляйте экспертное мнение.",
      commission: "20-25% с каждой консультации"
    },
    {
      icon: <Pill className="w-10 h-10 text-amber-500" />,
      title: "Бренды добавок",
      description: "Интегрируйте свои продукты в наши персонализированные рекомендации для пользователей.",
      commission: "25-30% с продаж"
    },
    {
      icon: <Share2 className="w-10 h-10 text-purple-500" />,
      title: "Блогеры и инфлюенсеры",
      description: "Делитесь ценностями здоровья и долголетия со своей аудиторией, получая вознаграждение.",
      commission: "До 30% за каждого привлеченного пользователя"
    }
  ];

  const topPartners = [
    { name: "Алексей К.", earnings: "₽257,890", period: "За последний месяц" },
    { name: "Центр Здоровья \"Вита\"", earnings: "₽198,650", period: "За последний месяц" },
    { name: "Марина П.", earnings: "₽145,720", period: "За последний месяц" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Партнерская программа EVERLIV</h1>
              <p className="text-lg text-gray-600 mb-8">
                Присоединяйтесь к экосистеме здоровья и долголетия. Зарабатывайте,
                помогая другим улучшать качество жизни и продлевать активное долголетие.
              </p>
              <Button size="lg">Стать партнером</Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Преимущества партнерства</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Types Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Кто может стать партнером</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {partnerTypes.map((type, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-center mb-4">
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">{type.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{type.description}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                    <span className="text-primary font-medium">{type.commission}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">Лидеры партнерской программы</h2>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-500">Май 2025</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {topPartners.map((partner, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-5 ${
                      index < topPartners.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-4 ${
                        index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{partner.name}</h3>
                        <p className="text-sm text-gray-500">{partner.period}</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-primary">{partner.earnings}</div>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-gray-500 mt-4 text-sm">Обновляется в режиме реального времени</p>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Как стать партнером</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Step 1 */}
                <div className="flex items-start mb-12">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-6 z-10">1</div>
                  <div className="bg-white p-6 rounded-lg shadow-sm flex-grow">
                    <h3 className="text-lg font-semibold mb-3">Заполните заявку</h3>
                    <p className="text-gray-600">
                      Расскажите о себе, вашей компании или аудитории. Мы рассмотрим вашу заявку в течение 24 часов.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-start mb-12">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-6 z-10">2</div>
                  <div className="bg-white p-6 rounded-lg shadow-sm flex-grow">
                    <h3 className="text-lg font-semibold mb-3">Получите доступ к партнерской программе</h3>
                    <p className="text-gray-600">
                      После одобрения заявки вы получите доступ к партнерскому кабинету, материалам, рекламным креативам и уникальным ссылкам.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-start mb-12">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-6 z-10">3</div>
                  <div className="bg-white p-6 rounded-lg shadow-sm flex-grow">
                    <h3 className="text-lg font-semibold mb-3">Приглашайте клиентов</h3>
                    <p className="text-gray-600">
                      Делитесь своими реферальными ссылками, промокодами или интегрируйте ваши услуги с нашей платформой.
                    </p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex items-start">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-6 z-10">4</div>
                  <div className="bg-white p-6 rounded-lg shadow-sm flex-grow">
                    <h3 className="text-lg font-semibold mb-3">Получайте вознаграждение</h3>
                    <p className="text-gray-600">
                      Отслеживайте статистику, конверсии и заработок в реальном времени. Выплаты производятся ежемесячно.
                    </p>
                  </div>
                </div>
                
                {/* Connecting Line */}
                <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gray-200 hidden md:block"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-gray-50 p-6 rounded-lg">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">₽12.5M+</div>
                <p className="text-gray-600">Выплачено партнерам</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">500+</div>
                <p className="text-gray-600">Активных партнеров</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <Share2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">10K+</div>
                <p className="text-gray-600">Привлеченных клиентов</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Присоединяйтесь к партнерской программе EVERLIV</h2>
              <p className="text-lg text-gray-600 mb-8">
                Начните зарабатывать, помогая людям улучшать своё здоровье и качество жизни
              </p>
              <Button size="lg" className="px-8">Стать партнером</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partnership;
