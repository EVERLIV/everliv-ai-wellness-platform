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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 border-t border-border/30 backdrop-blur-md md:hidden safe-area-pb">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const isItemActive = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "py-2 px-1 transition-all duration-300 ease-out",
                "active:scale-95 touch-manipulation",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                isItemActive 
                  ? `${item.color}` 
                  : "text-muted-foreground/60 hover:text-foreground/80 hover:scale-105"
              )}
              style={{ minHeight: '64px' }}
            >
              <div className={cn(
                "flex flex-col items-center justify-center transition-all duration-300 ease-out",
                isItemActive ? "gap-1.5" : "gap-0"
              )}>
                <div className={cn(
                  "p-1.5 rounded-full transition-all duration-300 ease-out",
                  isItemActive 
                    ? "bg-current/10 scale-110" 
                    : "scale-100 hover:bg-current/5"
                )}>
                  <item.icon 
                    className={cn(
                      "transition-all duration-300 ease-out",
                      isItemActive 
                        ? "h-5 w-5" 
                        : "h-4 w-4"
                    )} 
                  />
                </div>
                
                <span className={cn(
                  "text-[9px] font-medium leading-tight text-center px-0.5",
                  "transition-all duration-300 ease-out max-w-full",
                  isItemActive 
                    ? "opacity-100 transform translate-y-0 font-semibold scale-100" 
                    : "opacity-0 transform translate-y-2 scale-95 absolute pointer-events-none"
                )}>
                  {item.label}
                </span>
              </div>
              
              {isItemActive && (
                <div className={cn(
                  "absolute bottom-0 left-1/2 transform -translate-x-1/2",
                  "w-5 h-[2px] rounded-full transition-all duration-300 animate-scale-in",
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