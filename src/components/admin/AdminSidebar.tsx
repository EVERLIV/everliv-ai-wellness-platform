
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Heart, 
  Utensils, 
  UserCheck,
  Settings,
  BarChart3,
  FileText,
  HeadphonesIcon
} from "lucide-react";

const navigation = [
  {
    name: "Обзор",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Основные метрики и статистика"
  },
  {
    name: "Пользователи",
    href: "/admin/users",
    icon: Users,
    description: "Управление аккаунтами"
  },
  {
    name: "Тех Поддержка",
    href: "/admin/support",
    icon: HeadphonesIcon,
    description: "Обращения пользователей"
  },
  {
    name: "ИИ Чат",
    href: "/admin/ai-chat",
    icon: MessageSquare,
    description: "Настройки чат-бота"
  },
  {
    name: "Рекомендации здоровья",
    href: "/admin/health-recommendations",
    icon: Heart,
    description: "Планы лечения и профилактики"
  },
  {
    name: "Дневник питания",
    href: "/admin/nutrition",
    icon: Utensils,
    description: "Анализ пищевых привычек"
  },
  {
    name: "Профили здоровья",
    href: "/admin/health-profiles",
    icon: UserCheck,
    description: "Медицинские данные пользователей"
  },
  {
    name: "Аналитика",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Детальная аналитика платформы"
  },
  {
    name: "Контент",
    href: "/admin/content",
    icon: FileText,
    description: "Блог и статьи"
  },
  {
    name: "Настройки",
    href: "/admin/settings",
    icon: Settings,
    description: "Системные настройки"
  }
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Админ-панель</h2>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    isActive ? "text-primary-foreground/80" : "text-gray-500"
                  )}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
