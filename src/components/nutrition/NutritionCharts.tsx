
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CalendarDays, TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

const NutritionCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // Данные для демонстрации
  const weeklyData = [
    { date: 'Пн', calories: 1800, protein: 120, carbs: 200, fat: 70 },
    { date: 'Вт', calories: 2000, protein: 130, carbs: 220, fat: 80 },
    { date: 'Ср', calories: 1900, protein: 125, carbs: 210, fat: 75 },
    { date: 'Чт', calories: 2100, protein: 140, carbs: 230, fat: 85 },
    { date: 'Пт', calories: 1950, protein: 135, carbs: 215, fat: 78 },
    { date: 'Сб', calories: 2200, protein: 145, carbs: 240, fat: 90 },
    { date: 'Вс', calories: 2050, protein: 138, carbs: 225, fat: 82 },
  ];

  const macroDistribution = [
    { name: 'Белки', value: 30, color: '#3B82F6' },
    { name: 'Углеводы', value: 45, color: '#10B981' },
    { name: 'Жиры', value: 25, color: '#F59E0B' },
  ];

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
                Динамика калорий
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickMargin={5}
                    />
                    <YAxis 
                      fontSize={12}
                      tickMargin={5}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="var(--color-calories)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macros" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Распределение БЖУ</CardTitle>
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
                <CardTitle className="text-base md:text-lg">Средние значения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center p-2 md:p-3 bg-blue-50 rounded">
                    <span className="text-xs md:text-sm font-medium">Белки</span>
                    <span className="text-xs md:text-sm">132г/день</span>
                  </div>
                  <div className="flex justify-between items-center p-2 md:p-3 bg-green-50 rounded">
                    <span className="text-xs md:text-sm font-medium">Углеводы</span>
                    <span className="text-xs md:text-sm">220г/день</span>
                  </div>
                  <div className="flex justify-between items-center p-2 md:p-3 bg-orange-50 rounded">
                    <span className="text-xs md:text-sm font-medium">Жиры</span>
                    <span className="text-xs md:text-sm">80г/день</span>
                  </div>
                  <div className="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded">
                    <span className="text-xs md:text-sm font-medium">Калории</span>
                    <span className="text-xs md:text-sm">2000 ккал/день</span>
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
              <ChartContainer config={chartConfig} className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickMargin={5}
                    />
                    <YAxis 
                      fontSize={12}
                      tickMargin={5}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="protein" fill="var(--color-protein)" name="Белки" />
                    <Bar dataKey="carbs" fill="var(--color-carbs)" name="Углеводы" />
                    <Bar dataKey="fat" fill="var(--color-fat)" name="Жиры" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionCharts;
