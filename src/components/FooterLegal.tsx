
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLegal = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            &copy; {currentYear} EVERLIV | ООО «КЕЙ ДЖИ ИНЖИНИРИНГ» | ИНН: 7702423360 | ОГРН: 1177746965131
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-everliv-600">
              Условия использования
            </Link>
            <Link to="/legal" className="text-sm text-gray-500 hover:text-everliv-600">
              Юридическая информация
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-everliv-600">
              Политика конфиденциальности
            </Link>
            <Link to="/delivery" className="text-sm text-gray-500 hover:text-everliv-600">
              Оказание услуг
            </Link>
            <Link to="/payment-info" className="text-sm text-gray-500 hover:text-everliv-600">
              Правила оплаты
            </Link>
            <Link to="/contacts" className="text-sm text-gray-500 hover:text-everliv-600">
              Контакты
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterLegal;
