
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NutritionCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Прогресс по неделям</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">График прогресса БЖУ</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Распределение калорий</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Круговая диаграмма БЖУ</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Средние значения за месяц</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Калории</span>
              <span className="font-medium">1850 ккал/день</span>
            </div>
            <div className="flex justify-between">
              <span>Белки</span>
              <span className="font-medium">120г/день</span>
            </div>
            <div className="flex justify-between">
              <span>Углеводы</span>
              <span className="font-medium">200г/день</span>
            </div>
            <div className="flex justify-between">
              <span>Жиры</span>
              <span className="font-medium">70г/день</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                7
              </div>
              <span className="text-green-700">Дней подряд соблюдения цели по белкам</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <span className="text-blue-700">Недели ведения дневника</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionCharts;
