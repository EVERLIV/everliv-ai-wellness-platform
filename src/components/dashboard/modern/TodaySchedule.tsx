import React from 'react';
import { Clock, Utensils, Dumbbell, Pill, Moon } from 'lucide-react';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: 'meal' | 'workout' | 'medicine' | 'sleep' | 'other';
  completed: boolean;
  description?: string;
}

export const TodaySchedule: React.FC = () => {
  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      time: '07:00',
      title: 'Утренние витамины',
      type: 'medicine',
      completed: true,
      description: 'Витамин D, Омега-3'
    },
    {
      id: '2',
      time: '08:00',
      title: 'Завтрак',
      type: 'meal',
      completed: true,
      description: 'Овсянка с ягодами'
    },
    {
      id: '3',
      time: '09:30',
      title: 'Утренняя тренировка',
      type: 'workout',
      completed: false,
      description: '30 мин кардио'
    },
    {
      id: '4',
      time: '13:00',
      title: 'Обед',
      type: 'meal',
      completed: false,
      description: 'Салат с курицей'
    },
    {
      id: '5',
      time: '18:00',
      title: 'Силовая тренировка',
      type: 'workout',
      completed: false,
      description: 'Ноги и ягодицы'
    },
    {
      id: '6',
      time: '23:00',
      title: 'Подготовка ко сну',
      type: 'sleep',
      completed: false,
      description: 'Медитация 10 мин'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Utensils className="w-5 h-5" />;
      case 'workout': return <Dumbbell className="w-5 h-5" />;
      case 'medicine': return <Pill className="w-5 h-5" />;
      case 'sleep': return <Moon className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meal': return '#10b981';
      case 'workout': return '#ef4444';
      case 'medicine': return '#3b82f6';
      case 'sleep': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'meal': return '#ecfdf5';
      case 'workout': return '#fef2f2';
      case 'medicine': return '#eff6ff';
      case 'sleep': return '#f5f3ff';
      default: return '#f9fafb';
    }
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-gray-100 mx-2 md:mx-0">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">Расписание на сегодня</h3>
        <div className="text-xs md:text-sm text-gray-500">
          {scheduleItems.filter(item => item.completed).length} из {scheduleItems.length} выполнено
        </div>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {scheduleItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl border transition-all duration-200 ${
              item.completed 
                ? 'bg-gray-50 border-gray-200 opacity-75' 
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="text-xs md:text-sm font-medium text-gray-500 w-10 md:w-12">
                {item.time}
              </div>
              
              <div
                className="p-1.5 md:p-2 rounded-lg"
                style={{ 
                  backgroundColor: getTypeBgColor(item.type),
                  color: getTypeColor(item.type)
                }}
              >
                {React.cloneElement(getIcon(item.type) as React.ReactElement, {
                  className: "w-3 h-3 md:w-5 md:h-5"
                })}
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className={`text-sm md:text-base font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {item.title}
              </h4>
              {item.description && (
                <p className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">
                  {item.description}
                </p>
              )}
            </div>
            
            <button
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-200 ${
                item.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-400'
              }`}
              onClick={() => {
                // Toggle completion logic here
              }}
            >
              {item.completed && (
                <svg className="w-2 h-2 md:w-3 md:h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Прогресс дня</span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round((scheduleItems.filter(item => item.completed).length / scheduleItems.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(scheduleItems.filter(item => item.completed).length / scheduleItems.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};