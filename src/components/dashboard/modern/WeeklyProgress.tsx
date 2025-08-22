import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export const WeeklyProgress: React.FC = () => {
  const data = [
    { day: 'Пн', steps: 8500, goal: 10000 },
    { day: 'Вт', steps: 12300, goal: 10000 },
    { day: 'Ср', steps: 9800, goal: 10000 },
    { day: 'Чт', steps: 11200, goal: 10000 },
    { day: 'Пт', steps: 9500, goal: 10000 },
    { day: 'Сб', steps: 13800, goal: 10000 },
    { day: 'Вс', steps: 7200, goal: 10000 }
  ];

  const getBarColor = (steps: number, goal: number) => {
    if (steps >= goal) return '#10b981';
    if (steps >= goal * 0.8) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Активность за неделю</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Цель достигнута</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Близко к цели</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Нужно больше</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            />
            <Bar dataKey="steps" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.steps, entry.goal)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">72k</div>
          <div className="text-sm text-gray-500">Всего шагов</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">10.3k</div>
          <div className="text-sm text-gray-500">Среднее в день</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">5/7</div>
          <div className="text-sm text-gray-500">Цели достигнуты</div>
        </div>
      </div>
    </div>
  );
};