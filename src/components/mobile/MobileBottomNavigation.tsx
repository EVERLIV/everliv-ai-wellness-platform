import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, MessageCircle, Activity } from 'lucide-react';
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
      icon: Activity,
      label: 'Здоровье',
      href: '/dashboard/health',
    },
    {
      icon: MessageCircle,
      label: 'AI Врач',
      href: '/dashboard/ai-consultation',
    },
    {
      icon: Calendar,
      label: 'План',
      href: '/dashboard/plan',
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-h-[60px] px-2 py-1 rounded-lg transition-all duration-200",
                  "relative overflow-hidden",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute top-0 left-1/2 w-8 h-1 bg-primary rounded-full transform -translate-x-1/2" />
                )}
                
                <div className="relative">
                  <Icon 
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      active && "scale-110"
                    )} 
                  />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                
                <span className={cn(
                  "text-xs font-medium mt-1 transition-all duration-200",
                  active ? "text-primary scale-105" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;