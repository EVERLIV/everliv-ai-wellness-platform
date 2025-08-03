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
      label: 'ИИ доктор',
      href: '/ai-doctor',
    },
    {
      icon: BarChart3,
      label: 'Профиль здоровья',
      href: '/health-profile',
    },
    {
      icon: User,
      label: 'Анализы',
      href: '/diagnostics',
    },
    {
      icon: BookOpen,
      label: 'Аналитика',
      href: '/analytics',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-xl border border-border/20 rounded-2xl shadow-2xl md:hidden">
      <div className="flex justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 py-3 px-3 rounded-xl transition-all duration-300 min-w-[44px] justify-center",
                active 
                  ? "text-white bg-brand-primary shadow-lg scale-105 min-w-[140px] justify-start" 
                  : "text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/10"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-brand-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              {active && (
                <span className="text-[11px] font-medium leading-tight truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;