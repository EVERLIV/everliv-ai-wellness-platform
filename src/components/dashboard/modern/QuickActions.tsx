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
      <h3 className="text-xl font-bold text-gray-900">Быстрые действия</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 text-left hover:-translate-y-1"
          >
            <div className="flex items-start space-x-4">
              <div
                className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: action.bgColor }}
              >
                <span style={{ color: action.color }}>
                  {action.icon}
                </span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-500">
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