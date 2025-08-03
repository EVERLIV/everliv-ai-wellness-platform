import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, BarChart3, User, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: number;
}

const MobileBottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: 'Главная',
      href: '/dashboard',
    },
    {
      icon: Target,
      label: 'Цели',
      href: '/dashboard/goals',
    },
    {
      icon: BarChart3,
      label: 'Анализ',
      href: '/dashboard/diagnostics',
    },
    {
      icon: BookOpen,
      label: 'Обучение',
      href: '/dashboard/learning',
    },
    {
      icon: User,
      label: 'Профиль',
      href: '/dashboard/profile',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="safe-area-bottom">
        <div className="flex justify-around px-6 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                  active ? "text-emerald-600" : "text-gray-600"
                )}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;