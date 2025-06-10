
import React from "react";
import { Link } from "react-router-dom";

const HomeFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center text-lg font-semibold gap-2">
              <img src="/lovable-uploads/1d550229-884d-4912-81bb-d9b77b6f44bf.png" alt="EVERLIV Logo" className="h-6 w-auto" />
              EVERLIV
            </div>
            <p className="text-gray-600 text-sm">
              Персонализированная медицина и здоровое долголетие на основе ИИ
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="text-gray-600 hover:text-primary">Анализ крови</Link></li>
              <li><Link to="/services/ai-recommendations" className="text-gray-600 hover:text-primary">ИИ рекомендации</Link></li>
              <li><Link to="/services/personalized-supplements" className="text-gray-600 hover:text-primary">Добавки</Link></li>
              <li><Link to="/services/cold-therapy" className="text-gray-600 hover:text-primary">Холодовая терапия</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-primary">О нас</Link></li>
              <li><Link to="/science" className="text-gray-600 hover:text-primary">Научный подход</Link></li>
              <li><Link to="/partnership" className="text-gray-600 hover:text-primary">Партнерство</Link></li>
              <li><Link to="/contacts" className="text-gray-600 hover:text-primary">Контакты</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-gray-600 hover:text-primary">Вопросы и ответы</Link></li>
              <li><Link to="/support" className="text-gray-600 hover:text-primary">Техподдержка</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary">Блог</Link></li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Медицинский дисклеймер:</strong> Всегда обсуждайте результаты Everliv с врачом. 
              Everliv - это ИИ-доктор, а не лицензированный врач, не занимается медицинской практикой 
              и не предоставляет медицинские консультации или уход за пациентами. Используя Everliv, 
              вы соглашаетесь с нашими{' '}
              <Link to="/terms" className="text-yellow-700 underline hover:text-yellow-900">
                Условиями обслуживания
              </Link>{' '}
              и{' '}
              <Link to="/privacy" className="text-yellow-700 underline hover:text-yellow-900">
                Политикой конфиденциальности
              </Link>.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2024 EVERLIV. Все права защищены.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-primary">Политика конфиденциальности</Link>
              <Link to="/terms" className="hover:text-primary">Условия обслуживания</Link>
              <Link to="/legal" className="hover:text-primary">Правовая информация</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
