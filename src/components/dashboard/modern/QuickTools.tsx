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
    <div className="space-y-6 px-6 md:px-8">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Инструменты</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => navigate(tool.path)}
            className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left overflow-hidden"
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div
                  className="p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${tool.color}15, ${tool.color}25)`,
                    border: `1px solid ${tool.color}20`
                  }}
                >
                  <span style={{ color: tool.color }} className="block">
                    {tool.icon}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors duration-200">
                    {tool.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};