
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const NutritionCharts: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [todayData, setTodayData] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0
  });

  useEffect(() => {
    fetchWeeklyData();
    fetchTodayData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', startDate.toISOString().split('T')[0])
        .lte('entry_date', endDate.toISOString().split('T')[0]);

      if (error) throw error;

      // Группируем данные по дням
      const groupedData = data.reduce((acc: any, entry: any) => {
        const date = entry.entry_date;
        if (!acc[date]) {
          acc[date] = {
            date,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          };
        }
        acc[date].calories += entry.calories;
        acc[date].protein += parseFloat(entry.protein);
        acc[date].carbs += parseFloat(entry.carbs);
        acc[date].fat += parseFloat(entry.fat);
        return acc;
      }, {});

      const chartData = Object.values(groupedData).map((day: any) => ({
        ...day,
        date: new Date(day.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
      }));

      setWeeklyData(chartData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const fetchTodayData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', today);

      if (error) throw error;

      const totals = data.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + parseFloat(entry.protein),
        carbs: acc.carbs + parseFloat(entry.carbs),
        fat: acc.fat + parseFloat(entry.fat)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      setTodayData(totals);
    } catch (error) {
      console.error('Error fetching today data:', error);
    }
  };

  const pieData = [
    { name: 'Белки', value: todayData.protein * 4, color: '#3B82F6' },
    { name: 'Углеводы', value: todayData.carbs * 4, color: '#10B981' },
    { name: 'Жиры', value: todayData.fat * 9, color: '#F59E0B' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Прогресс по неделям</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="protein" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Распределение калорий сегодня</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${Math.round(value)} ккал`, 'Калории']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Сводка за сегодня</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Калории</span>
              <span className="font-medium">{todayData.calories} ккал</span>
            </div>
            <div className="flex justify-between">
              <span>Белки</span>
              <span className="font-medium">{todayData.protein.toFixed(1)}г</span>
            </div>
            <div className="flex justify-between">
              <span>Углеводы</span>
              <span className="font-medium">{todayData.carbs.toFixed(1)}г</span>
            </div>
            <div className="flex justify-between">
              <span>Жиры</span>
              <span className="font-medium">{todayData.fat.toFixed(1)}г</span>
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
                ✓
              </div>
              <span className="text-green-700">Цель по калориям достигнута</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                7
              </div>
              <span className="text-blue-700">Дней ведения дневника</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionCharts;
