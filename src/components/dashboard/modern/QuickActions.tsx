import React from 'react';
import { Plus, Camera, MessageCircle, Target, Activity, Calendar } from 'lucide-react';

interface ActionButton {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  action: () => void;
}

export const QuickActions: React.FC = () => {
  const actions: ActionButton[] = [
    {
      id: 'add-meal',
      title: 'Добавить прием пищи',
      description: 'Записать завтрак, обед или ужин',
      icon: <Plus className="w-6 h-6" />,
      color: '#10b981',
      bgColor: '#ecfdf5',
      action: () => console.log('Add meal')
    },
    {
      id: 'photo-progress',
      title: 'Фото прогресса',
      description: 'Сделать фото для трекинга',
      icon: <Camera className="w-6 h-6" />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      action: () => console.log('Photo progress')
    },
    {
      id: 'ai-chat',
      title: 'ИИ консультант',
      description: 'Задать вопрос о здоровье',
      icon: <MessageCircle className="w-6 h-6" />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      action: () => console.log('AI chat')
    },
    {
      id: 'set-goal',
      title: 'Новая цель',
      description: 'Поставить цель на сегодня',
      icon: <Target className="w-6 h-6" />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      action: () => console.log('Set goal')
    },
    {
      id: 'start-workout',
      title: 'Начать тренировку',
      description: 'Запустить таймер активности',
      icon: <Activity className="w-6 h-6" />,
      color: '#ef4444',
      bgColor: '#fef2f2',
      action: () => console.log('Start workout')
    },
    {
      id: 'schedule',
      title: 'Расписание',
      description: 'Посмотреть план на день',
      icon: <Calendar className="w-6 h-6" />,
      color: '#06b6d4',
      bgColor: '#ecfeff',
      action: () => console.log('Schedule')
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 px-4 md:px-0">Быстрые действия</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 px-4 md:px-0">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="group bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left hover:-translate-y-1"
          >
            <div className="flex flex-col md:flex-row items-start md:items-start space-y-3 md:space-y-0 md:space-x-4">
              <div
                className="p-2 md:p-3 rounded-lg md:rounded-xl group-hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: action.bgColor }}
              >
                <span style={{ color: action.color }} className="block">
                  {action.icon}
                </span>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-medium md:font-semibold text-sm md:text-base text-gray-900 mb-1 group-hover:text-gray-700">
                  {action.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};