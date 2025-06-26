
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
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

  const quickActions = [
    { 
      icon: <FileText className="h-5 w-5" />, 
      label: "Анализы крови", 
      description: "Загружайте результаты лабораторных исследований и получайте ИИ-анализ ваших биомаркеров",
      action: () => navigate("/lab-analyses"), 
      color: "bg-blue-500",
      badge: "ИИ-анализ",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    { 
      icon: <BarChart3 className="h-5 w-5" />, 
      label: "Аналитика здоровья", 
      description: "Комплексная аналитика всех ваших данных с персональными рекомендациями и прогнозами",
      action: () => navigate("/analytics"), 
      color: "bg-purple-500",
      badge: "Премиум",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    { 
      icon: <Utensils className="h-5 w-5" />, 
      label: "Дневник питания", 
      description: "Отслеживайте потребление калорий, БЖУ и получайте рекомендации по питанию",
      action: () => navigate("/nutrition-diary"), 
      color: "bg-green-500",
      badge: "Pro",
      badgeColor: "bg-green-100 text-green-700"
    },
    { 
      icon: <Stethoscope className="h-5 w-5" />, 
      label: "ИИ-доктор", 
      description: "Персональные консультации с искусственным интеллектом 24/7 по вопросам здоровья",
      action: () => navigate("/ai-doctor"), 
      color: "bg-red-500",
      badge: "ИИ",
      badgeColor: "bg-red-100 text-red-700"
    },
    { 
      icon: <Target className="h-5 w-5" />, 
      label: "Цели здоровья", 
      description: "Устанавливайте и отслеживайте ваши цели по улучшению здоровья",
      action: () => navigate("/health-profile"), 
      color: "bg-orange-500",
      badge: "Основа",
      badgeColor: "bg-orange-100 text-orange-700"
    },
    { 
      icon: <Activity className="h-5 w-5" />, 
      label: "Биологический возраст", 
      description: "Рассчитайте ваш биологический возраст на основе комплексного анализа биомаркеров",
      action: () => navigate("/biological-age"), 
      color: "bg-indigo-500",
      badge: "ИИ-расчет",
      badgeColor: "bg-indigo-100 text-indigo-700"
    },
  ];

  return (
    <>
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        Быстрые действия
      </h3>
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer group"
            onClick={action.action}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{action.label}</h4>
                  <Badge className={`text-xs px-2 py-0.5 ${action.badgeColor} border-0`}>
                    {action.badge}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardQuickActionsGrid;
