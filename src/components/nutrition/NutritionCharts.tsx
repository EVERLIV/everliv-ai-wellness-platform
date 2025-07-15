
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
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
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
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
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

        {/* Круговая диаграмма макронутриентов за сегодня */}
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm flex items-center gap-1">
              <Target className="h-3 w-3 text-purple-600" />
              Баланс макронутриентов сегодня
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="grid grid-cols-1 gap-3">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '0px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {macroData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center p-2 bg-gray-50 border border-gray-200/50">
                    <div 
                      className="w-4 h-4 rounded-full mb-1" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-center">{item.name}</span>
                    <span className="text-sm font-semibold">{item.value}г</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика достижения целей */}
        {goals && (
          <Card className="shadow-none border-gray-200/80 rounded-none">
            <CardHeader className="pb-1 px-2 py-1">
              <CardTitle className="text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3 text-indigo-600" />
                Достижение целей сегодня
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-1 pt-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 border border-gray-200/50">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {goalAchievement.calories}%
                  </div>
                  <div className="text-sm text-purple-700">Калории</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {todayTotals.calories} / {goals.daily_calories}
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-gray-200/50">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {goalAchievement.protein}%
                  </div>
                  <div className="text-sm text-blue-700">Белки</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(todayTotals.protein)}г / {goals.daily_protein}г
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 border border-gray-200/50">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {goalAchievement.carbs}%
                  </div>
                  <div className="text-sm text-green-700">Углеводы</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(todayTotals.carbs)}г / {goals.daily_carbs}г
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 border border-gray-200/50">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {goalAchievement.fat}%
                  </div>
                  <div className="text-sm text-orange-700">Жиры</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(todayTotals.fat)}г / {goals.daily_fat}г
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NutritionCharts;
