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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 border-t border-border/20 backdrop-blur-lg md:hidden safe-area-pb">
      <div className="grid grid-cols-5 h-14 sm:h-16">
        {navItems.map((item) => {
          const isItemActive = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center transition-all duration-300 ease-out",
                "active:scale-95 touch-manipulation min-h-[44px]",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0",
                isItemActive 
                  ? `${item.color}` 
                  : "text-muted-foreground/70 hover:text-foreground/80"
              )}
            >
              <div className={cn(
                "flex flex-col items-center transition-all duration-300",
                isItemActive ? "gap-1" : "gap-0"
              )}>
                <item.icon 
                  className={cn(
                    "transition-all duration-300 ease-out",
                    isItemActive 
                      ? "h-5 w-5 sm:h-6 sm:w-6 scale-110" 
                      : "h-5 w-5 sm:h-5 sm:w-5"
                  )} 
                />
                <span className={cn(
                  "text-[10px] sm:text-xs font-medium transition-all duration-300 ease-out leading-none",
                  isItemActive 
                    ? "opacity-100 transform translate-y-0 font-semibold" 
                    : "opacity-0 transform translate-y-1 absolute"
                )}>
                  {item.label}
                </span>
              </div>
              {isItemActive && (
                <div className={cn(
                  "absolute -bottom-[1px] left-1/2 transform -translate-x-1/2",
                  "w-6 h-[2px] rounded-full transition-all duration-300",
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