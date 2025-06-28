
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, User, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HealthProfilePageHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Назад к панели</span>
              <span className="sm:hidden">Назад</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Профиль Здоровья
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Управляйте своими данными здоровья и получайте персональные рекомендации
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Личные данные</p>
                <p className="text-gray-900 font-semibold">Заполнено</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Активность</p>
                <p className="text-gray-900 font-semibold">Отслеживается</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Здоровье</p>
                <p className="text-gray-900 font-semibold">Мониторинг</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfilePageHeader;
