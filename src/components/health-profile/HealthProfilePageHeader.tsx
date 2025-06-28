
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, User, Activity, Target, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HealthProfilePageHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Назад</span>
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  Профиль Здоровья
                </h1>
                <p className="text-white/80 text-sm sm:text-base hidden sm:block">
                  Персональный подход к вашему здоровью
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/25 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Данные</p>
                <p className="text-white font-semibold">Заполнено</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/25 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Активность</p>
                <p className="text-white font-semibold">Мониторинг</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/25 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Цели</p>
                <p className="text-white font-semibold">Активные</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfilePageHeader;
