
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Target, 
  FileText,
  BarChart3,
  Utensils,
  Stethoscope,
  Activity,
  ChevronRight
} from 'lucide-react';

const DashboardQuickActionsGrid: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const quickActions = [
    { 
      icon: <FileText className={`${isMobile ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-5 w-5'}`} />, 
      label: isMobile ? "Анализы" : "Анализы крови", 
      description: isMobile ? "ИИ-анализ биомаркеров" : "Загружайте результаты лабораторных исследований и получайте ИИ-анализ ваших биомаркеров",
      action: () => navigate("/lab-analyses"), 
      color: "bg-blue-500",
      badge: "ИИ",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    { 
      icon: <BarChart3 className={`${isMobile ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-5 w-5'}`} />, 
      label: isMobile ? "Аналитика" : "Аналитика здоровья", 
      description: isMobile ? "Персональные рекомендации" : "Комплексная аналитика всех ваших данных с персональными рекомендациями и прогнозами",
      action: () => navigate("/analytics"), 
      color: "bg-purple-500",
      badge: "Pro",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    { 
      icon: <Utensils className={`${isMobile ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-5 w-5'}`} />, 
      label: isMobile ? "Питание" : "Дневник питания", 
      description: isMobile ? "Учет калорий и БЖУ" : "Отслеживайте потребление калорий, БЖУ и получайте рекомендации по питанию",
      action: () => navigate("/nutrition-diary"), 
      color: "bg-green-500",
      badge: "БЖУ",
      badgeColor: "bg-green-100 text-green-700"
    },
    { 
      icon: <Stethoscope className={`${isMobile ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-5 w-5'}`} />, 
      label: isMobile ? "ИИ-доктор" : "ИИ-доктор", 
      description: isMobile ? "Консультации 24/7" : "Персональные консультации с искусственным интеллектом 24/7 по вопросам здоровья",
      action: () => navigate("/ai-doctor"), 
      color: "bg-red-500",
      badge: "24/7",
      badgeColor: "bg-red-100 text-red-700"
    },
    { 
      icon: <Target className={`${isMobile ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-5 w-5'}`} />, 
      label: isMobile ? "Цели" : "Цели здоровья", 
      description: isMobile ? "Отслеживание целей" : "Устанавливайте и отслеживайте ваши цели по улучшению здоровья",
      action: () => navigate("/health-profile"), 
      color: "bg-orange-500",
      badge: "Цель",
      badgeColor: "bg-orange-100 text-orange-700"
    },
    { 
      icon: <Activity className={`${isMobile ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-5 w-5'}`} />, 
      label: isMobile ? "Био-возраст" : "Биологический возраст", 
      description: isMobile ? "ИИ-расчет возраста" : "Рассчитайте ваш биологический возраст на основе комплексного анализа биомаркеров",
      action: () => navigate("/biological-age"), 
      color: "bg-indigo-500",
      badge: "ИИ",
      badgeColor: "bg-indigo-100 text-indigo-700"
    },
  ];

  if (isMobile) {
    return (
      <>
        <h3 className="text-adaptive-sm font-semibold text-gray-900 mb-2 flex items-center adaptive-gap-sm">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          Быстрые действия
        </h3>
        <div className="dashboard-grid-mobile">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-2 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer group min-w-0"
              onClick={action.action}
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 ${action.color} rounded-lg flex items-center justify-center text-white shadow-sm mb-1.5`}>
                {action.icon}
              </div>
              <div className="text-center min-w-0 w-full">
                <h4 className="button-text-mobile font-medium text-gray-900 mb-0.5 truncate">{action.label}</h4>
                <Badge size="sm" className={`${action.badgeColor} border-0 mb-1`}>
                  {action.badge}
                </Badge>
                <p className="text-adaptive-xs text-gray-600 leading-tight mobile-text-wrap">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="text-adaptive-base font-semibold text-gray-900 mb-3 flex items-center adaptive-gap-sm">
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        Быстрые действия
      </h3>
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="flex items-center justify-between adaptive-p-md bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer group safe-container"
            onClick={action.action}
          >
            <div className="flex items-center adaptive-gap-md flex-1 min-w-0">
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center adaptive-gap-sm mb-1">
                  <h4 className="font-medium text-gray-900 text-adaptive-sm mobile-text-wrap">{action.label}</h4>
                  <Badge size="sm" className={`${action.badgeColor} border-0 flex-shrink-0`}>
                    {action.badge}
                  </Badge>
                </div>
                <p className="text-adaptive-xs text-gray-600 leading-relaxed mobile-text-wrap">{action.description}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardQuickActionsGrid;
