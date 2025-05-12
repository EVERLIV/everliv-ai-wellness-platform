
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contacts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">Контакты</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center p-6">
                <MapPin className="h-10 w-10 text-everliv-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Наш адрес</h3>
                <p className="text-gray-700">107045, г. Москва, Даев переулок, дом 20, пом.52Г</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center p-6">
                <Phone className="h-10 w-10 text-everliv-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Телефон</h3>
                <p className="text-gray-700">+7 (495) 123-45-67</p>
                <p className="text-sm text-gray-500 mt-2">Пн-Пт: 9:00 - 18:00</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center p-6">
                <Mail className="h-10 w-10 text-everliv-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-gray-700">support@everliv.ai</p>
                <p className="text-sm text-gray-500 mt-2">Мы отвечаем в течение 24 часов</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Юридическая информация</h2>
              <div className="space-y-2">
                <p><strong>Полное наименование организации:</strong> Общество с ограниченной ответственностью "КЕЙ ДЖИ ИНЖИНИРИНГ»</p>
                <p><strong>Сокращенное наименование организации:</strong> ООО «КЕЙ ДЖИ ИНЖИНИРИНГ»</p>
                <p><strong>Юридический адрес:</strong> 107045, г. Москва, Даев переулок, дом 20, пом.52Г</p>
                <p><strong>ОГРН:</strong> 1177746965131</p>
                <p><strong>ИНН:</strong> 7702423360</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Способы связи</h2>
              <p className="mb-4">
                У вас есть вопросы или предложения? Свяжитесь с нами любым удобным способом:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>По телефону: +7 (495) 123-45-67</li>
                <li>По электронной почте: support@everliv.ai</li>
                <li>Через форму обратной связи на сайте</li>
              </ul>
              <p className="text-sm text-gray-500">
                Мы стремимся ответить на все запросы в течение одного рабочего дня.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
