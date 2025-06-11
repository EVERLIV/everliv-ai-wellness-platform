
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, TrendingUp } from "lucide-react";

interface NutritionDiaryHeaderProps {
  onQuickAdd?: () => void;
}

const NutritionDiaryHeader: React.FC<NutritionDiaryHeaderProps> = ({
  onQuickAdd
}) => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Дневник Питания
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              Отслеживайте ваше питание, анализируйте БЖУ и получайте персональные рекомендации для достижения ваших целей
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="secondary" 
              className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Calendar className="h-4 w-4" />
              Календарь питания
            </Button>
            <Button 
              onClick={onQuickAdd}
              className="gap-2 bg-white text-primary hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Быстрое добавление
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Сегодня</p>
                <p className="text-white font-semibold">Цели достигнуты</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Дней подряд</p>
                <p className="text-white font-semibold">7 дней</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Записей</p>
                <p className="text-white font-semibold">24 записи</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionDiaryHeader;
