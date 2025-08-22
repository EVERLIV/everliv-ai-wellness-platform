
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NewCard } from '@/components/ui/new-card';
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
      gradient: 'gradient-primary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      icon: Heart,
      title: 'Профиль здоровья',
      description: 'Управление данными',
      path: '/health-profile',
      gradient: 'gradient-secondary',
      iconBg: 'bg-error/10',
      iconColor: 'text-error'
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Отчеты и тренды',
      path: '/analytics',
      gradient: 'gradient-accent',
      iconBg: 'bg-success/10',
      iconColor: 'text-success'
    },
    {
      icon: TestTube,
      title: 'Лабораторные анализы',
      description: 'Результаты тестов',
      path: '/lab-analyses',
      gradient: 'gradient-secondary',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary'
    },
    {
      icon: Activity,
      title: 'Мои биомаркеры',
      description: 'Динамика показателей',
      path: '/my-biomarkers',
      gradient: 'gradient-primary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      icon: BookOpen,
      title: 'База знаний',
      description: 'Медицинская информация',
      path: '/medical-knowledge',
      gradient: 'gradient-accent',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Быстрые действия
        </h2>
        <p className="text-foreground-medium">
          Основные функции платформы здоровья
        </p>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {actions.map((action) => (
          <NewCard
            key={action.path}
            variant="glass"
            hover="lift"
            className="group cursor-pointer transition-all duration-300 hover:shadow-glow-primary"
            onClick={() => navigate(action.path)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <ChevronRight className="w-5 h-5 text-foreground-light group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                  {action.title}
                </h3>
                <p className="text-foreground-medium text-sm leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          </NewCard>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuickActionsGrid;
