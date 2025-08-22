
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EVAButton } from '@/design-system/components/EVAButton';
import { HealthMetricsGrid, HealthSection } from '@/design-system/components/HealthLayout';
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
      variant: 'primary' as const
    },
    {
      icon: Heart,
      title: 'Профиль здоровья',
      description: 'Управление данными',
      path: '/health-profile',
      variant: 'danger' as const
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Отчеты и тренды',
      path: '/analytics',
      variant: 'success' as const
    },
    {
      icon: TestTube,
      title: 'Лабораторные анализы',
      description: 'Результаты тестов',
      path: '/lab-analyses',
      variant: 'secondary' as const
    },
    {
      icon: Activity,
      title: 'Мои биомаркеры',
      description: 'Динамика показателей',
      path: '/my-biomarkers',
      variant: 'primary' as const
    },
    {
      icon: BookOpen,
      title: 'База знаний',
      description: 'Медицинская информация',
      path: '/medical-knowledge',
      variant: 'secondary' as const
    }
  ];

  return (
    <HealthSection 
      title="Быстрые действия" 
      background="surface"
      className="eva-mobile-section"
    >
      <HealthMetricsGrid 
        layout={isMobile ? "1x3" : "2x3"} 
        className={isMobile ? "gap-3" : "gap-4"}
      >
        {actions.map((action) => (
          <div
            key={action.path}
            className="group cursor-pointer"
            onClick={() => navigate(action.path)}
          >
            <div className="bg-eva-surface border border-neutral-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 eva-touch-target">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-eva-primary/10 flex items-center justify-center group-hover:bg-eva-primary/20 transition-colors">
                      <action.icon className="h-5 w-5 text-eva-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-eva-text-primary text-sm truncate group-hover:text-eva-primary transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-eva-text-secondary text-xs leading-tight truncate">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-eva-text-muted group-hover:text-eva-primary transition-colors flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </HealthMetricsGrid>
    </HealthSection>
  );
};

export default DashboardQuickActionsGrid;
