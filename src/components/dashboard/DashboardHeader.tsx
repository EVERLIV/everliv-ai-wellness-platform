
import React from "react";
import { useProfile } from "@/hooks/useProfile";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const { profileData } = useProfile();
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

  // Получаем имя из профиля или используем fallback
  const displayName = profileData?.first_name || userName || "Пользователь";

  // Проверяем, работаем ли мы в режиме разработки
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {displayName}!
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Онлайн{isDevelopment ? " (разработка)" : ""}</span>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              {currentDate} • {currentTime}
            </p>
            <p className="text-gray-500">
              Управляйте своим здоровьем с помощью персонализированной аналитики
            </p>
            
            {/* Дисклеймер */}
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mt-2 inline-block">
              <p>
                Сервис находится в альфа-разработке, спасибо за поддержку! 
                {" "}
                <a 
                  href="/contact" 
                  className="text-primary hover:underline font-medium"
                >
                  Рассказать о баге
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
