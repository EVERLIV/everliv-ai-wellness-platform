
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
            ООО «КЕЙ ДЖИ ИНЖИНИРИНГ» является официальным оператором платформы EVERLIV
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-everliv-600" />
                Юридическая информация
              </h3>
              <ul className="space-y-2">
                <li><strong>Полное наименование:</strong> Общество с ограниченной ответственностью "КЕЙ ДЖИ ИНЖИНИРИНГ»</li>
                <li><strong>Сокращенное наименование:</strong> ООО «КЕЙ ДЖИ ИНЖИНИРИНГ»</li>
                <li><strong>Юридический адрес:</strong> 107045, г. Москва, Даев переулок, дом 20, пом.52Г</li>
                <li><strong>ОГРН:</strong> 1177746965131</li>
                <li><strong>ИНН:</strong> 7702423360</li>
              </ul>
              <div className="mt-4">
                <Link to="/legal" className="text-everliv-600 hover:underline">Подробная юридическая информация</Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-everliv-600" />
                Контактная информация
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-everliv-600 mt-0.5 flex-shrink-0" />
                  <span>107045, г. Москва, Даев переулок, дом 20, пом.52Г</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-everliv-600 mt-0.5 flex-shrink-0" />
                  <span>+7 (495) 123-45-67</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-everliv-600 mt-0.5 flex-shrink-0" />
                  <span>support@everliv.ai</span>
                </li>
              </ul>
              <div className="mt-4">
                <Link to="/contacts" className="text-everliv-600 hover:underline">Посмотреть все контакты</Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-everliv-600" />
                Оплата услуг
              </h3>
              <p className="mb-4">
                Оплата услуг осуществляется через АО «АЛЬФА-БАНК». К оплате принимаются карты VISA, MasterCard, МИР.
              </p>
              <p className="mb-4">
                Все платежи обрабатываются в соответствии с правилами международных платежных систем на защищенной платежной странице банка.
              </p>
              <div className="mt-4">
                <Link to="/payment-info" className="text-everliv-600 hover:underline">Подробнее об оплате</Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-everliv-600" />
                Условия оказания услуг
              </h3>
              <p className="mb-4">
                Полная информация об условиях оказания услуг, возврате денежных средств и гарантийных обязательствах представлена в соответствующих разделах.
              </p>
              <div className="mt-4 space-y-2">
                <div>
                  <Link to="/delivery" className="text-everliv-600 hover:underline">Условия оказания услуг</Link>
                </div>
                <div>
                  <Link to="/payment-info" className="text-everliv-600 hover:underline">Правила возврата</Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfoSection;
