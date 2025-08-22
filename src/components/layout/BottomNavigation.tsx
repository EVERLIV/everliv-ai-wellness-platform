import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Heart, 
  BarChart3, 
  User,
  TestTube,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Главная',
      path: '/dashboard',
      color: 'text-brand-primary'
    },
    {
      icon: MessageSquare,
      label: 'ИИ Доктор',
      path: '/ai-doctor',
      color: 'text-brand-accent'
    },
    {
      icon: Heart,
      label: 'Профиль',
      path: '/health-profile',
      color: 'text-brand-error'
    },
    {
      icon: BarChart3,
      label: 'Аналитика',
      path: '/analytics',
      color: 'text-brand-success'
    },
    {
      icon: Activity,
      label: 'Биомаркеры',
      path: '/my-biomarkers',
      color: 'text-brand-secondary'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/50 backdrop-blur-lg bg-white/95 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isItemActive = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200",
                "active:scale-95 touch-manipulation",
                isItemActive 
                  ? `${item.color} bg-current/5` 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isItemActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isItemActive && "font-semibold"
              )}>
                {item.label}
              </span>
              {isItemActive && (
                <div className={cn(
                  "absolute bottom-0 left-1/2 transform -translate-x-1/2",
                  "w-8 h-0.5 rounded-full",
                  item.color.replace('text-', 'bg-')
                )} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;