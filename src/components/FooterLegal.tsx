
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLegal = () => {
  const currentYear = new Date().getFullYear();
  
  return <div className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            &copy; {currentYear} EVERLIV | ООО «КЕЙ ДЖИ ИНЖИНИРИНГ» | ИНН: 7702423360 | ОГРН: 1177746965131
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <Link to="/terms" className="hover:text-primary">Условия использования</Link>
            <Link to="/privacy" className="hover:text-primary">Политика конфиденциальности</Link>
            <Link to="/security" className="hover:text-primary">Безопасность данных</Link>
            <Link to="/partnership" className="hover:text-primary">Партнерство</Link>
            {/* Only show Help Center link if user is logged in */}
            <Link to="/help" className="hover:text-primary">Центр помощи</Link>
          </div>
        </div>
      </div>
    </div>;
};

export default FooterLegal;
