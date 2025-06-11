
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown } from 'lucide-react';

const SubscriptionHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="flex items-center gap-2 hover:bg-white/80 px-3 py-2"
            >
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Назад к панели</span>
                <span className="sm:hidden">Назад</span>
              </Link>
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  Подписки
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Выберите подходящий план для доступа ко всем возможностям
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHeader;
