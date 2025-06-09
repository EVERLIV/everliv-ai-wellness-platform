
import React from "react";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const currentTime = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Функция для определения времени суток и соответствующего приветствия
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Доброй ночи";
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {userName}!
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Онлайн</span>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              {currentDate} • {currentTime}
            </p>
            <p className="text-gray-500">
              Управляйте своим здоровьем с помощью персонализированной аналитики
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
