
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  User, 
  BarChart3, 
  FileText, 
  Calendar,
  Utensils,
  Heart,
  TestTube,
  ChevronRight,
  BookOpen,
  Activity
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardQuickActionsGrid: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const actions = [
    {
      icon: MessageSquare,
      title: 'ИИ Доктор',
      description: 'Персональная консультация',
      path: '/ai-doctor',
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-100'
    },
    {
      icon: Heart,
      title: 'Профиль здоровья',
      description: 'Управление данными',
      path: '/health-profile',
      gradient: 'from-red-500 to-red-600',
      iconColor: 'text-red-100'
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Отчеты и тренды',
      path: '/analytics',
      gradient: 'from-green-500 to-green-600',
      iconColor: 'text-green-100'
    },
    {
      icon: Utensils,
      title: 'Дневник питания',
      description: 'Трекинг рациона',
      path: '/nutrition-diary',
      gradient: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-100'
    },
    {
      icon: TestTube,
      title: 'Лабораторные анализы',
      description: 'Результаты тестов',
      path: '/lab-analyses',
      gradient: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-100'
    },
    {
      icon: FileText,
      title: 'Рекомендации',
      description: 'Персональные советы',
      path: '/my-recommendations',
      gradient: 'from-indigo-500 to-indigo-600',
      iconColor: 'text-indigo-100'
    },
    {
      icon: Activity,
      title: 'Биологический возраст',
      description: 'Оценка и улучшение',
      path: '/biological-age',
      gradient: 'from-pink-500 to-pink-600',
      iconColor: 'text-pink-100'
    },
    {
      icon: BookOpen,
      title: 'База знаний',
      description: 'Медицинские статьи',
      path: '/knowledge-base',
      gradient: 'from-teal-500 to-teal-600',
      iconColor: 'text-teal-100'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Быстрые действия
        </h3>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-3 gap-4'}`}>
        {actions.map((action) => (
          <Button
            key={action.path}
            variant="ghost"
            className={`
              h-auto p-0 group hover:scale-[1.02] transition-all duration-200
              ${isMobile ? 'w-full' : ''}
            `}
            onClick={() => navigate(action.path)}
          >
            <div className={`
              w-full bg-gradient-to-br ${action.gradient} rounded-lg p-4 text-left
              shadow-lg hover:shadow-xl transition-all duration-200
              ${isMobile ? 'min-h-[80px]' : 'min-h-[100px]'}
            `}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <action.icon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} ${action.iconColor}`} />
                    <h4 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {action.title}
                    </h4>
                  </div>
                  <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                    {action.description}
                  </p>
                </div>
                <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white/60 group-hover:text-white transition-colors flex-shrink-0 ml-2`} />
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuickActionsGrid;
