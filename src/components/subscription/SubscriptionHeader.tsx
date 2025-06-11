
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const SubscriptionHeader = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-primary">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Назад к дашборду
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Подписки</h1>
      <p className="text-lg text-gray-700 mb-8">
        Выберите подходящий план для доступа ко всем возможностям платформы
      </p>
    </div>
  );
};

export default SubscriptionHeader;
