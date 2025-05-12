
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Phone, Mail, FileText, CreditCard } from 'lucide-react';

const CompanyInfoSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Информация о компании</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ООО «КЕЙ ДЖИ ИНЖИНИРИНГ» — разработчик инновационной платформы EVERLIV для здорового долголетия
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link to="/contacts">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 flex flex-col items-center text-center h-full p-6">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Контакты</h3>
                <p className="text-gray-600">
                  Наш адрес, телефон и электронная почта для связи с нами
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/security">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 flex flex-col items-center text-center h-full p-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Безопасность данных</h3>
                <p className="text-gray-600">
                  Как мы защищаем ваши персональные данные и медицинскую информацию
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/legal">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 flex flex-col items-center text-center h-full p-6">
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Юридическая информация</h3>
                <p className="text-gray-600">
                  Официальные данные компании, лицензии и сертификаты
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/help">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 flex flex-col items-center text-center h-full p-6">
                <Mail className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Центр помощи</h3>
                <p className="text-gray-600">
                  Ответы на частые вопросы и форма обратной связи
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/terms">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 flex flex-col items-center text-center h-full p-6">
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Условия использования</h3>
                <p className="text-gray-600">
                  Правила использования сервиса EVERLIV
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/payment-info">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 flex flex-col items-center text-center h-full p-6">
                <CreditCard className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Информация об оплате</h3>
                <p className="text-gray-600">
                  Способы оплаты и правила возврата средств
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfoSection;
