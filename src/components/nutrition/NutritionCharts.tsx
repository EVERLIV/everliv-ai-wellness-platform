
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
    <div className="mobile-content-spacing">
      <div className="mb-6">
        <div className="mobile-flex-header">
          <div>
            <h2 className="mobile-heading-primary text-gray-900">
              Аналитика питания
            </h2>
            <p className="mobile-text-small text-gray-600 mt-1">
              Отслеживайте динамику потребления калорий и макронутриентов
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={dateRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('week')}
              className="mobile-button-sm"
            >
              Неделя
            </Button>
            <Button
              variant={dateRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('month')}
              className="mobile-button-sm"
            >
              Месяц
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* График калорий */}
        <Card className="mobile-card">
          <CardHeader className="mobile-card-header">
            <CardTitle className="mobile-heading-secondary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Потребление калорий
            </CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-content">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#6366F1" radius={4} />
                  {goals && (
                    <Bar 
                      dataKey={() => goals.daily_calories} 
                      fill="#E5E7EB" 
                      opacity={0.3} 
                      name="Цель калорий"
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* График макронутриентов */}
        <Card className="mobile-card">
          <CardHeader className="mobile-card-header">
            <CardTitle className="mobile-heading-secondary flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Макронутриенты
            </CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-content">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="protein" fill="#3B82F6" name="Белки (г)" radius={2} />
                  <Bar dataKey="carbs" fill="#10B981" name="Углеводы (г)" radius={2} />
                  <Bar dataKey="fat" fill="#F59E0B" name="Жиры (г)" radius={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Круговая диаграмма макронутриентов за сегодня */}
        <Card className="mobile-card">
          <CardHeader className="mobile-card-header">
            <CardTitle className="mobile-heading-secondary flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Баланс макронутриентов сегодня
            </CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {macroData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="mobile-text-body font-medium">{item.name}</span>
                    </div>
                    <span className="mobile-text-body font-semibold">{item.value}г</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика достижения целей */}
        {goals && (
          <Card className="mobile-card">
            <CardHeader className="mobile-card-header">
              <CardTitle className="mobile-heading-secondary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Достижение целей сегодня
              </CardTitle>
            </CardHeader>
            <CardContent className="mobile-card-content">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {goalAchievement.calories}%
                  </div>
                  <div className="mobile-text-small text-purple-700">Калории</div>
                  <div className="mobile-text-small text-gray-500 mt-1">
                    {todayTotals.calories} / {goals.daily_calories}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {goalAchievement.protein}%
                  </div>
                  <div className="mobile-text-small text-blue-700">Белки</div>
                  <div className="mobile-text-small text-gray-500 mt-1">
                    {Math.round(todayTotals.protein)}г / {goals.daily_protein}г
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {goalAchievement.carbs}%
                  </div>
                  <div className="mobile-text-small text-green-700">Углеводы</div>
                  <div className="mobile-text-small text-gray-500 mt-1">
                    {Math.round(todayTotals.carbs)}г / {goals.daily_carbs}г
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {goalAchievement.fat}%
                  </div>
                  <div className="mobile-text-small text-orange-700">Жиры</div>
                  <div className="mobile-text-small text-gray-500 mt-1">
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
