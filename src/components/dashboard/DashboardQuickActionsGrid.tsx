
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
      icon: BookOpen,
      title: 'База знаний',
      description: 'Медицинская информация',
      path: '/medical-knowledge',
      gradient: 'bg-gradient-to-br from-teal-500 to-brand-secondary',
      iconColor: 'text-white/90'
    }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <h3 className={`font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent ${isMobile ? 'text-base' : 'text-lg'}`}>
          Быстрые действия
        </h3>
        <div className="w-16 h-0.5 bg-gradient-to-r from-brand-primary to-transparent rounded-full"></div>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-3 gap-4'}`}>
        {actions.map((action, index) => (
          <Button
            key={action.path}
            variant="ghost"
            className={`
              h-auto p-0 group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 hover:shadow-xl
              ${isMobile ? 'w-full' : ''}
            `}
            onClick={() => navigate(action.path)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`
              w-full ${action.gradient} rounded-xl p-4 text-left relative overflow-hidden
              shadow-card hover:shadow-xl transition-all duration-300
              ${isMobile ? 'min-h-[70px]' : 'min-h-[80px]'}
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100
            `}>
              <div className="relative z-10 flex items-center justify-between h-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <action.icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white flex-shrink-0`} />
                    </div>
                    <h4 className={`font-semibold text-white truncate ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {action.title}
                    </h4>
                  </div>
                  <p className={`text-white/90 ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed truncate`}>
                    {action.description}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                    <ChevronRight className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white group-hover:translate-x-0.5 transition-transform`} />
                  </div>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuickActionsGrid;
