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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border/50 md:hidden shadow-lg">
      <div className="safe-area-bottom">
        <div className="flex justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all duration-200 min-w-[60px]",
                  active 
                    ? "text-brand-primary bg-brand-primary/10" 
                    : "text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/5"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "w-5 h-5 transition-transform",
                    active && "scale-110"
                  )} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-brand-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium leading-tight",
                  active && "font-semibold"
                )}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;