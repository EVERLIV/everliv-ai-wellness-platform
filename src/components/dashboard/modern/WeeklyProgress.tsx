import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useHealthProfile } from '@/hooks/useHealthProfile';

export const WeeklyProgress: React.FC = () => {
  const { healthProfile } = useHealthProfile();
  
  // Генерируем данные на основе профиля здоровья
  const generateWeeklyData = () => {
    if (!healthProfile) {
      // Данные по умолчанию для незарегистрированных пользователей
      return [
        { day: 'Пн', steps: 6500, goal: 10000 },
        { day: 'Вт', steps: 8200, goal: 10000 },
        { day: 'Ср', steps: 7800, goal: 10000 },
        { day: 'Чт', steps: 9100, goal: 10000 },
        { day: 'Пт', steps: 7500, goal: 10000 },
        { day: 'Сб', steps: 12300, goal: 10000 },
        { day: 'Вс', steps: 5200, goal: 10000 }
      ];
    }

    // Базовый уровень активности на основе данных профиля
    const activityMultiplier = {
      'sedentary': 0.6,
      'light': 0.8,
      'moderate': 1.0,
      'active': 1.3,
      'very_active': 1.6
    };

    const baseActivity = healthProfile.physicalActivity || 'moderate';
    const exerciseFreq = healthProfile.exerciseFrequency || 2;
    const fitnessLevel = healthProfile.fitnessLevel || 'intermediate';
    
    // Рассчитываем базовое количество шагов
    let baseSteps = 6000;
    baseSteps *= activityMultiplier[baseActivity];
    baseSteps += exerciseFreq * 800; // Добавляем за каждую тренировку в неделю
    
    if (fitnessLevel === 'advanced') baseSteps *= 1.2;
    if (fitnessLevel === 'beginner') baseSteps *= 0.8;

    const goal = Math.max(8000, Math.round(baseSteps * 1.2));
    
    // Генерируем реалистичные данные с вариацией
    const weeklyVariations = [0.8, 1.1, 0.9, 1.2, 0.85, 1.4, 0.7]; // Пн-Вс
    
    return weeklyVariations.map((variation, index) => {
      const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      const steps = Math.round(baseSteps * variation + (Math.random() - 0.5) * 1000);
      return { 
        day: days[index], 
        steps: Math.max(2000, steps), // Минимум 2000 шагов
        goal 
      };
    });
  };

  const data = generateWeeklyData();

  const getBarColor = (steps: number, goal: number) => {
    if (steps >= goal) return '#10b981';
    if (steps >= goal * 0.8) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-0">Активность за неделю</h3>
        <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Цель достигнута</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Близко к цели</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Нужно больше</span>
          </div>
        </div>
      </div>
      
      <div className="h-40 md:h-52 mb-3 md:mb-4">
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
      <div className="grid grid-cols-3 gap-2 md:gap-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <div className="text-base md:text-xl font-bold text-gray-900">
            {Math.round(data.reduce((sum, day) => sum + day.steps, 0) / 1000)}k
          </div>
          <div className="text-xs md:text-sm text-gray-500">Всего шагов</div>
        </div>
        <div className="text-center">
          <div className="text-base md:text-xl font-bold text-gray-900">
            {Math.round(data.reduce((sum, day) => sum + day.steps, 0) / 7 / 1000 * 10) / 10}k
          </div>
          <div className="text-xs md:text-sm text-gray-500">Среднее в день</div>
        </div>
        <div className="text-center">
          <div className="text-base md:text-xl font-bold text-gray-900">
            {data.filter(day => day.steps >= day.goal).length}/7
          </div>
          <div className="text-xs md:text-sm text-gray-500">Цели достигнуты</div>
        </div>
      </div>
    </div>
  );
};