
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Добро пожаловать, {userName}!
            </h1>
            <p className="text-gray-600">
              Ваша персональная платформа для анализа здоровья и медицинских консультаций
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Уведомления
            </Button>
            <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600">
              <Plus className="h-4 w-4" />
              Добавить в закладки
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
