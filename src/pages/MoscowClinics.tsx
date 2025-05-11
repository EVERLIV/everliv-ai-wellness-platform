
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Calendar } from 'lucide-react';

interface ClinicProps {
  name: string;
  address: string;
  metro: string;
  phone: string;
  hours: string;
  services: string[];
  image?: string;
}

const ClinicCard: React.FC<ClinicProps> = ({ name, address, metro, phone, hours, services, image }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 h-full">
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/30 to-secondary/30 flex items-center justify-center">
            <span className="text-lg text-secondary font-medium">{name}</span>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-2 text-primary mt-0.5" />
            <div>
              <p className="text-gray-700">{address}</p>
              <p className="text-sm text-primary font-medium">{metro}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2 text-primary" />
            <p className="text-gray-700">{phone}</p>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-2 text-primary mt-0.5" />
            <p className="text-gray-700">{hours}</p>
          </div>
        </div>
        
        <div className="mb-5">
          <h4 className="font-medium mb-2">Услуги:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {services.map((service, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                {service}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Button variant="outline" className="flex-1">
            <MapPin className="h-4 w-4 mr-2" />
            Построить маршрут
          </Button>
          <Button className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Записаться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MoscowClinics = () => {
  const clinics: ClinicProps[] = [
    {
      name: "Клиника долголетия «Нева»",
      address: "ул. Тверская, 6, стр. 3",
      metro: "м. Охотный ряд",
      phone: "+7 (495) 123-45-67",
      hours: "Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-18:00",
      services: [
        "Комплексная диагностика",
        "Холодовые процедуры",
        "Дыхательные практики",
        "Гипербарическая оксигенация",
        "Нутрицевтическое консультирование"
      ],
      image: "/images/clinic-1.jpg"
    },
    {
      name: "Центр биохакинга «Генезис»",
      address: "Ленинский проспект, 90",
      metro: "м. Проспект Вернадского",
      phone: "+7 (495) 987-65-43",
      hours: "Ежедневно: 8:00-22:00",
      services: [
        "Генетическое тестирование",
        "Криосауна и криокамера",
        "Интервальная гипоксическая тренировка",
        "Персонализированное питание",
        "Телемедицинское сопровождение"
      ],
      image: "/images/clinic-2.jpg"
    },
    {
      name: "Институт долголетия на Арбате",
      address: "ул. Новый Арбат, 15",
      metro: "м. Арбатская",
      phone: "+7 (495) 111-22-33",
      hours: "Пн-Сб: 8:00-20:00, Вс: выходной",
      services: [
        "Биомаркеры старения",
        "Метаболическое тестирование",
        "Сопровождение голодания",
        "Кислородные капсулы",
        "Когнитивные тренировки"
      ],
      image: "/images/clinic-3.jpg"
    },
    {
      name: "Центр омоложения «Хроно»",
      address: "Кутузовский проспект, 32",
      metro: "м. Кутузовская",
      phone: "+7 (495) 555-12-34",
      hours: "Пн-Пт: 9:00-20:00, Сб: 10:00-17:00, Вс: выходной",
      services: [
        "Эпигенетический анализ",
        "Протоколы метфорнина",
        "Внутривенные инфузии NAD+",
        "Сенолитические программы",
        "Интегративная телемедицина"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-6">
                Клиники Москвы
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Наши специализированные центры долголетия в Москве предлагают полный спектр услуг для улучшения качества и продолжительности жизни, используя научно обоснованные методы и технологии
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg">Записаться на консультацию</Button>
                <Button variant="outline" size="lg">Узнать о выездных услугах</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Clinics List */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary mb-4">Наши клиники</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Выберите ближайшую клинику и запишитесь на бесплатную консультацию с нашими специалистами по долголетию
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clinics.map((clinic, index) => (
                <ClinicCard key={index} {...clinic} />
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary mb-4">Доступные услуги</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Все наши клиники предлагают комплексные программы для улучшения здоровья и долголетия
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Диагностика</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Комплексная оценка биологического возраста</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Генетическое тестирование</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Метаболомный анализ</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Оценка микробиома</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Функциональная диагностика</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Процедуры</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Криотерапия и холодовые воздействия</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Гипербарическая оксигенация</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Инфузионная терапия</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Лазерная терапия</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Дыхательные тренировки</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Консультации</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Нутрицевтическое сопровождение</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Разработка протоколов голодания</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Когнитивная оптимизация</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Персонализированные планы долголетия</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Телемедицинское сопровождение</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Получите консультацию специалиста</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Запишитесь на первичную консультацию в любой из наших клиник и начните свой путь к долголетию уже сегодня
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg">Записаться онлайн</Button>
              <Button variant="outline" size="lg">Позвонить нам</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MoscowClinics;
