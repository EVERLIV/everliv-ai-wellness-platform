
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const CompanyInfoSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8 text-center">
          <Shield className="h-12 w-12 text-everliv-600 mb-4" />
          <h2 className="text-3xl font-bold mb-2">О компании</h2>
          <p className="text-gray-600 max-w-2xl">
            ООО «КЕЙ ДЖИ ИНЖИНИРИНГ» - разработчик платформы EVERLIV, 
            использующей технологии искусственного интеллекта для улучшения здоровья и качества жизни.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Сведения о компании</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Полное наименование:</strong> Общество с ограниченной ответственностью "КЕЙ ДЖИ ИНЖИНИРИНГ»</li>
                  <li><strong>Сокращенное наименование:</strong> ООО «КЕЙ ДЖИ ИНЖИНИРИНГ»</li>
                  <li><strong>Юридический адрес:</strong> 107045, г. Москва, Даев переулок, дом 20, пом.52Г</li>
                  <li><strong>ОГРН:</strong> 1177746965131</li>
                  <li><strong>ИНН:</strong> 7702423360</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Наши контакты</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Телефон:</strong> +7 (495) 123-45-67</li>
                  <li><strong>Email:</strong> support@everliv.ai</li>
                  <li><strong>Время работы:</strong> Пн-Пт с 9:00 до 18:00</li>
                </ul>
                <div className="mt-4">
                  <Link to="/contacts" className="text-everliv-600 hover:underline">
                    Подробная контактная информация →
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Узнайте больше о нашей компании, гарантиях и условиях оказания услуг
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/legal" className="text-everliv-600 hover:underline">
              Юридическая информация
            </Link>
            <Link to="/delivery" className="text-everliv-600 hover:underline">
              Условия оказания услуг
            </Link>
            <Link to="/about" className="text-everliv-600 hover:underline">
              О компании
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfoSection;
