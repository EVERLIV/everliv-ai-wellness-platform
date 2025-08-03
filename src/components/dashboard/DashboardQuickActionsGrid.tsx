
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
      description: 'Консультация',
      path: '/ai-doctor',
      color: 'brand-primary',
      bgColor: 'bg-brand-primary'
    },
    {
      icon: Heart,
      title: 'Профиль здоровья',
      description: 'Данные',
      path: '/health-profile',
      color: 'brand-error',
      bgColor: 'bg-brand-error'
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Отчеты',
      path: '/analytics',
      color: 'brand-success',
      bgColor: 'bg-brand-success'
    },
    {
      icon: TestTube,
      title: 'Анализы',
      description: 'Результаты',
      path: '/lab-analyses',
      color: 'brand-accent',
      bgColor: 'bg-brand-accent'
    },
    {
      icon: Activity,
      title: 'Биомаркеры',
      description: 'Показатели',
      path: '/my-biomarkers',
      color: 'brand-primary',
      bgColor: 'bg-brand-primary'
    },
    {
      icon: TrendingUp,
      title: 'Биовозраст',
      description: 'Анализ',
      path: '/biological-age',
      color: 'brand-accent',
      bgColor: 'bg-brand-accent'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
          Быстрые действия
        </h3>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-4'}`}>
        {actions.map((action) => (
          <Button
            key={action.path}
            variant="ghost"
            className="h-auto p-0 group hover:scale-[1.02] transition-all duration-200"
            onClick={() => navigate(action.path)}
          >
            <div className={`
              w-full ${action.bgColor} rounded-2xl p-4 text-left
              shadow-lg hover:shadow-xl transition-all duration-300
              ${isMobile ? 'min-h-[80px]' : 'min-h-[90px]'}
            `}>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-white mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {action.title}
                  </h4>
                  <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'} leading-tight`}>
                    {action.description}
                  </p>
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
