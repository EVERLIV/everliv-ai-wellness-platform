import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Brain,
  User,
  BarChart3,
  Utensils,
  TestTube,
  Activity,
  Target,
  Calendar,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Bell,
  Shield,
  Settings,
  UserCog,
  Code,
  Stethoscope,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const location = useLocation();

  const navigationItems = [
    {
      section: 'Инструменты',
      items: [
        { icon: Brain, label: 'ИИ Доктор', path: '/ai-doctor' },
        { icon: User, label: 'Профиль здоровья', path: '/health-profile' },
        { icon: BarChart3, label: 'Аналитика', path: '/analytics' },
        { icon: Utensils, label: 'Дневник питания', path: '/nutrition' },
        { icon: TestTube, label: 'Лабораторные анализы', path: '/lab-analyses' },
        { icon: Activity, label: 'Мои биомаркеры', path: '/biomarkers' },
        { icon: Target, label: 'Рекомендации', path: '/recommendations' },
        { icon: Calendar, label: 'Биологический возраст', path: '/biological-age' },
        { icon: BookOpen, label: 'База знаний', path: '/knowledge-base' },
        { icon: Calendar, label: 'Календарь здоровья', path: '/health-calendar' },
      ]
    },
    {
      section: 'Поддержка',
      items: [
        { icon: HelpCircle, label: 'Центр помощи', path: '/help' },
        { icon: MessageSquare, label: 'Чат с командой', path: '/chat' },
        { icon: Bell, label: 'Уведомления', path: '/notifications' },
        { icon: Shield, label: 'Конфиденциальность', path: '/privacy' },
      ]
    },
    {
      section: 'Настройки',
      items: [
        { icon: Settings, label: 'Настройки профиля', path: '/settings' },
        { icon: Code, label: 'Инструменты разработчика', path: '/dev-tools' },
        { icon: Stethoscope, label: 'Медицинские услуги', path: '/medical-services' },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-start"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
          {!collapsed && "Свернуть"}
        </Button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((section, sectionIndex) => (
          <div key={section.section} className="mb-6">
            {!collapsed && (
              <div className="px-4 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {section.section}
                </h3>
              </div>
            )}
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium transition-colors",
                      "hover:bg-gray-100 hover:text-gray-900",
                      collapsed ? "justify-center" : "justify-start",
                      active 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                        : "text-gray-600"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
            
            {sectionIndex < navigationItems.length - 1 && !collapsed && (
              <Separator className="mx-4 mt-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;