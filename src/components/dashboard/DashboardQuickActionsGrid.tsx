
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
  Activity,
  TrendingUp
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
      gradient: 'bg-gradient-to-br from-brand-primary to-brand-primary-dark',
      iconColor: 'text-white/90'
    },
    {
      icon: Heart,
      title: 'Профиль здоровья',
      description: 'Управление данными',
      path: '/health-profile',
      gradient: 'bg-gradient-to-br from-brand-error to-red-600',
      iconColor: 'text-white/90'
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Отчеты и тренды',
      path: '/analytics',
      gradient: 'bg-gradient-to-br from-brand-success to-green-600',
      iconColor: 'text-white/90'
    },
    {
      icon: TestTube,
      title: 'Лабораторные анализы',
      description: 'Результаты тестов',
      path: '/lab-analyses',
      gradient: 'bg-gradient-to-br from-brand-accent to-purple-600',
      iconColor: 'text-white/90'
    },
    {
      icon: Activity,
      title: 'Мои биомаркеры',
      description: 'Динамика показателей',
      path: '/my-biomarkers',
      gradient: 'bg-gradient-to-br from-brand-secondary to-cyan-600',
      iconColor: 'text-white/90'
    },
    {
      icon: TrendingUp,
      title: 'Биологический возраст',
      description: 'Пошаговый анализ',
      path: '/biological-age',
      gradient: 'bg-gradient-to-br from-pink-500 to-brand-accent',
      iconColor: 'text-white/90'
    },
    {
      icon: BookOpen,
      title: 'База знаний',
      description: 'Медицинские статьи',
      path: '/knowledge-base',
      gradient: 'bg-gradient-to-br from-teal-500 to-brand-secondary',
      iconColor: 'text-white/90'
    },
    {
      icon: Calendar,
      title: 'Календарь здоровья',
      description: 'Планирование и напоминания',
      path: '/health-calendar',
      gradient: 'bg-gradient-to-br from-brand-warning to-amber-600',
      iconColor: 'text-white/90'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
          Быстрые действия
        </h3>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 lg:grid-cols-3 gap-3'}`}>
        {actions.map((action) => (
          <Button
            key={action.path}
            variant="ghost"
            className={`
              h-auto p-0 group hover:scale-[1.01] transition-all duration-200
              ${isMobile ? 'w-full' : ''}
            `}
            onClick={() => navigate(action.path)}
          >
            <div className={`
              w-full ${action.gradient} rounded-lg p-3 text-left
              shadow-md hover:shadow-lg transition-all duration-200
              ${isMobile ? 'min-h-[60px]' : 'min-h-[70px]'}
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <action.icon className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} ${action.iconColor} flex-shrink-0`} />
                    <h4 className={`font-medium text-white truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {action.title}
                    </h4>
                  </div>
                  <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-xs'} leading-tight truncate`}>
                    {action.description}
                  </p>
                </div>
                <ChevronRight className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white/60 group-hover:text-white transition-colors flex-shrink-0 ml-2`} />
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuickActionsGrid;
