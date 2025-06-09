
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Search } from "lucide-react";

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

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Добро пожаловать, {userName}
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
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Поиск
            </Button>
            <Button variant="outline" size="sm" className="gap-2 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Новый анализ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
