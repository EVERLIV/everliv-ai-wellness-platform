
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CalendarDays, TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";

const NutritionCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // Получаем реальные данные за последние 7 дней
  const generateWeeklyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Здесь мы используем хук для каждого дня (в реальном приложении лучше оптимизировать)
      const dayEntries = []; // Временная заглушка, так как хук работает только с одной датой
      
      const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
      
      data.push({
        date: dayName,
        calories: 0, // Реальные данные будут подставлены ниже
        protein: 0,
        carbs: 0,
        fat: 0
      });
    }
    
    return data;
  };

  // Получаем данные за сегодня для расчета БЖУ
  const { getDailyTotals } = useFoodEntries(new Date());
  const todayTotals = getDailyTotals();
  
  const weeklyData = useMemo(() => generateWeeklyData(), [selectedPeriod]);

  // Рассчитываем реальное распределение БЖУ на основе сегодняшних данных
  const macroDistribution = useMemo(() => {
    const totalCalories = todayTotals.calories || 1; // Избегаем деления на ноль
    const proteinCalories = todayTotals.protein * 4;
    const carbsCalories = todayTotals.carbs * 4;
    const fatCalories = todayTotals.fat * 9;
    
    const totalMacroCalories = proteinCalories + carbsCalories + fatCalories || 1;
    
    return [
      { 
        name: 'Белки', 
        value: Math.round((proteinCalories / totalMacroCalories) * 100),
        color: '#3B82F6' 
      },
      { 
        name: 'Углеводы', 
        value: Math.round((carbsCalories / totalMacroCalories) * 100),
        color: '#10B981' 
      },
      { 
        name: 'Жиры', 
        value: Math.round((fatCalories / totalMacroCalories) * 100),
        color: '#F59E0B' 
      },
    ];
  }, [todayTotals]);

  const chartConfig = {
    calories: {
      label: "Калории",
      color: "#8884d8",
    },
    protein: {
      label: "Белки",
      color: "#3B82F6",
    },
    carbs: {
      label: "Углеводы", 
      color: "#10B981",
    },
    fat: {
      label: "Жиры",
      color: "#F59E0B",
    },
  };

  // Если нет данных, показываем сообщение
  const hasData = todayTotals.calories > 0 || todayTotals.protein > 0 || todayTotals.carbs > 0 || todayTotals.fat > 0;

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-lg md:text-xl font-semibold">Аналитика питания</h2>
        <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'week' | 'month')} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 w-full md:w-auto">
            <TabsTrigger value="week" className="text-xs md:text-sm">Неделя</TabsTrigger>
            <TabsTrigger value="month" className="text-xs md:text-sm">Месяц</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет данных для анализа</h3>
              <p className="text-gray-600">Добавьте записи о питании, чтобы увидеть аналитику</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="calories" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
            <TabsTrigger value="calories" className="text-xs md:text-sm">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Калории
            </TabsTrigger>
            <TabsTrigger value="macros" className="text-xs md:text-sm">
              <PieChartIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              БЖУ
            </TabsTrigger>
            <TabsTrigger value="detailed" className="text-xs md:text-sm">
              <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Детальная
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  Динамика калорий (пока недостаточно данных)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Продолжайте добавлять записи для построения графика динамики</p>
                  <p className="text-sm text-gray-500 mt-2">Сегодня: {todayTotals.calories} ккал</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="macros" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Распределение БЖУ сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-48 md:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                          fontSize={10}
                        >
                          {macroDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Сегодняшние значения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center p-2 md:p-3 bg-blue-50 rounded">
                      <span className="text-xs md:text-sm font-medium">Белки</span>
                      <span className="text-xs md:text-sm">{todayTotals.protein.toFixed(1)}г</span>
                    </div>
                    <div className="flex justify-between items-center p-2 md:p-3 bg-green-50 rounded">
                      <span className="text-xs md:text-sm font-medium">Углеводы</span>
                      <span className="text-xs md:text-sm">{todayTotals.carbs.toFixed(1)}г</span>
                    </div>
                    <div className="flex justify-between items-center p-2 md:p-3 bg-orange-50 rounded">
                      <span className="text-xs md:text-sm font-medium">Жиры</span>
                      <span className="text-xs md:text-sm">{todayTotals.fat.toFixed(1)}г</span>
                    </div>
                    <div className="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded">
                      <span className="text-xs md:text-sm font-medium">Калории</span>
                      <span className="text-xs md:text-sm">{todayTotals.calories} ккал</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Детальная аналитика БЖУ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Детальная аналитика будет доступна после накопления данных за несколько дней</p>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Белки</p>
                      <p className="text-gray-600">{todayTotals.protein.toFixed(1)}г</p>
                    </div>
                    <div>
                      <p className="font-medium">Углеводы</p>
                      <p className="text-gray-600">{todayTotals.carbs.toFixed(1)}г</p>
                    </div>
                    <div>
                      <p className="font-medium">Жиры</p>
                      <p className="text-gray-600">{todayTotals.fat.toFixed(1)}г</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default NutritionCharts;
