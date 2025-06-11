
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, TrendingUp, ArrowLeft, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NutritionDiaryHeaderProps {
  onQuickAdd?: () => void;
}

const NutritionDiaryHeader: React.FC<NutritionDiaryHeaderProps> = ({
  onQuickAdd
}) => {
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
                <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Дневник Питания
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Отслеживайте питание, анализируйте БЖУ и получайте персональные рекомендации
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Calendar className="h-4 w-4" />
              <span className="sm:hidden">Календарь</span>
              <span className="hidden sm:inline">Календарь питания</span>
            </Button>
            <Button 
              onClick={onQuickAdd}
              className="gap-2 bg-primary hover:bg-secondary text-white w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="sm:hidden">Добавить</span>
              <span className="hidden sm:inline">Быстрое добавление</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Сегодня</p>
                <p className="text-gray-900 font-semibold">Цели достигнуты</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Дней подряд</p>
                <p className="text-gray-900 font-semibold">7 дней</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Записей</p>
                <p className="text-gray-900 font-semibold">24 записи</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionDiaryHeader;
