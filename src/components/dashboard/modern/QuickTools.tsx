import React from 'react';
import { Brain, Heart, BarChart3, TestTube, Activity, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickToolsProps {}

export const QuickTools: React.FC<QuickToolsProps> = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'ai-doctor',
      title: 'ИИ Доктор',
      description: 'Консультация с ИИ',
      icon: <Brain className="w-5 h-5" />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      path: '/ai-doctor'
    },
    {
      id: 'health-profile',
      title: 'Профиль здоровья',
      description: 'Управление профилем',
      icon: <Heart className="w-5 h-5" />,
      color: '#ef4444',
      bgColor: '#fef2f2',
      path: '/health-profile'
    },
    {
      id: 'analytics',
      title: 'Аналитика',
      description: 'Отчеты и статистика',
      icon: <BarChart3 className="w-5 h-5" />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      path: '/analytics'
    },
    {
      id: 'lab-analyses',
      title: 'Анализы',
      description: 'Лабораторные данные',
      icon: <TestTube className="w-5 h-5" />,
      color: '#06b6d4',
      bgColor: '#ecfeff',
      path: '/lab-analyses'
    },
    {
      id: 'biomarkers',
      title: 'Биомаркеры',
      description: 'Показатели здоровья',
      icon: <Activity className="w-5 h-5" />,
      color: '#10b981',
      bgColor: '#ecfdf5',
      path: '/my-biomarkers'
    },
    {
      id: 'knowledge',
      title: 'База знаний',
      description: 'Медицинская информация',
      icon: <BookOpen className="w-5 h-5" />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      path: '/medical-knowledge'
    }
  ];

  return (
    <div className="space-y-3 md:space-y-4 px-4 md:px-0">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 px-0">Инструменты</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 px-0">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => navigate(tool.path)}
            className="group bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left hover:-translate-y-1"
          >
            <div className="flex flex-col md:flex-row items-start md:items-start space-y-3 md:space-y-0 md:space-x-4">
              <div
                className="p-2 md:p-3 rounded-lg md:rounded-xl group-hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: tool.bgColor }}
              >
                <span style={{ color: tool.color }} className="block">
                  {tool.icon}
                </span>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-medium md:font-semibold text-sm md:text-base text-gray-900 mb-1 group-hover:text-gray-700">
                  {tool.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                  {tool.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};