
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Utensils, 
  BarChart3, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const NutritionManagement = () => {
  const nutritionStats = [
    { label: "Записей за день", value: "1,247" },
    { label: "Активных пользователей", value: "834" },
    { label: "Средняя калорийность", value: "2,100" },
    { label: "Выполнение целей", value: "78%" }
  ];

  const recentEntries = [
    {
      user: "Иван П.",
      meal: "Завтрак",
      calories: 420,
      status: "normal",
      time: "08:30"
    },
    {
      user: "Мария С.",
      meal: "Обед",
      calories: 850,
      status: "high",
      time: "13:15"
    },
    {
      user: "Алексей К.",
      meal: "Ужин",
      calories: 320,
      status: "low",
      time: "19:45"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Дневник питания</h1>
        <p className="text-gray-600 mt-2">
          Анализ пищевых привычек и управление рекомендациями
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {nutritionStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Обзор
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Записи
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Рекомендации
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Тренды питания</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>График трендов питания</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Популярные продукты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Овсянка", "Куриная грудка", "Брокколи", "Яйца", "Авокадо"].map((food, index) => (
                    <div key={food} className="flex justify-between items-center">
                      <span>{food}</span>
                      <Badge variant="secondary">{100 - index * 15} записей</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="entries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Последние записи</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{entry.user}</p>
                        <p className="text-sm text-gray-600">{entry.meal} • {entry.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{entry.calories} ккал</span>
                      {entry.status === "normal" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {entry.status === "high" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      {entry.status === "low" && <AlertTriangle className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Персональные рекомендации</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Рекомендация для снижения веса</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Пользователям с избыточным весом рекомендуется снизить суточную калорийность на 20%
                  </p>
                  <Button size="sm" className="mt-3">Применить к группе</Button>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Повышение белка для спортсменов</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Активным пользователям рекомендуется увеличить потребление белка до 2г/кг веса
                  </p>
                  <Button size="sm" className="mt-3">Применить к группе</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionManagement;
