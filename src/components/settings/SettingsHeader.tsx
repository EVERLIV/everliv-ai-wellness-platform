
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Назад к панели</span>
              <span className="sm:hidden">Назад</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Настройки аккаунта
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Управление профилем, подпиской и уведомлениями
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
