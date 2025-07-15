
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Target, Activity } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useNutritionGoals } from "@/hooks/useNutritionGoals";
import { useHistoricalFoodData } from "@/hooks/useHistoricalFoodData";

const NutritionCharts: React.FC = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month'>('week');
  const { goals } = useNutritionGoals();
  const [macroData, setMacroData] = useState<any[]>([]);
  
  // Получаем исторические данные за период
  const days = dateRange === 'week' ? 7 : 30;
  const { data: chartData, isLoading: chartLoading } = useHistoricalFoodData(days);
  
  // Получаем данные для сегодняшнего дня
  const { getDailyTotals } = useFoodEntries(new Date());
  const todayTotals = getDailyTotals();

  useEffect(() => {
    // Данные для круговой диаграммы макронутриентов за сегодня
    setMacroData([
      { name: 'Белки', value: Math.round(todayTotals.protein), color: '#3B82F6' },
      { name: 'Углеводы', value: Math.round(todayTotals.carbs), color: '#10B981' },
      { name: 'Жиры', value: Math.round(todayTotals.fat), color: '#F59E0B' }
    ]);
  }, [todayTotals]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  // Вычисляем статистику достижения целей на основе реальных данных
  const calculateGoalAchievement = () => {
    if (!goals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return {
      calories: Math.min(100, Math.round((todayTotals.calories / goals.daily_calories) * 100)),
      protein: Math.min(100, Math.round((todayTotals.protein / goals.daily_protein) * 100)),
      carbs: Math.min(100, Math.round((todayTotals.carbs / goals.daily_carbs) * 100)),
      fat: Math.min(100, Math.round((todayTotals.fat / goals.daily_fat) * 100))
    };
  };

  const goalAchievement = calculateGoalAchievement();

  if (chartLoading) {
    return (
      <div className="mobile-content-spacing">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600">Загрузка аналитики питания...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-end">
        <Button
          variant={dateRange === 'week' ? 'default' : 'outline'}
          onClick={() => setDateRange('week')}
          className="text-xs py-1 px-2 h-auto rounded-none"
        >
          Неделя
        </Button>
        <Button
          variant={dateRange === 'month' ? 'default' : 'outline'}
          onClick={() => setDateRange('month')}
          className="text-xs py-1 px-2 h-auto rounded-none"
        >
          Месяц
        </Button>
      </div>

      <div className="space-y-3">
        {/* График калорий */}
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              Потребление калорий
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    axisLine={true}
                    tickLine={true}
                    height={50}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    axisLine={true}
                    tickLine={true}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="calories" fill="url(#colorCalories)" radius={[2, 2, 0, 0]} />
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* График макронутриентов */}
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm flex items-center gap-1">
              <Activity className="h-3 w-3 text-green-600" />
              Макронутриенты
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    axisLine={true}
                    tickLine={true}
                    height={50}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    axisLine={true}
                    tickLine={true}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="protein" fill="#3b82f6" name="Белки (г)" radius={[1, 1, 0, 0]} />
                  <Bar dataKey="carbs" fill="#10b981" name="Углеводы (г)" radius={[1, 1, 0, 0]} />
                  <Bar dataKey="fat" fill="#f59e0b" name="Жиры (г)" radius={[1, 1, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default NutritionCharts;
