import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHeader from './MobileHeader';
import MobileBottomNavigation from './MobileBottomNavigation';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
  headerProps?: any;
  className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showHeader = true,
  showBottomNav = true,
  headerProps = {},
  className
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <MobileHeader title={title} {...headerProps} />
      )}
      
      <main className={cn(
        "flex-1",
        showHeader && "pt-16",
        showBottomNav && "pb-20",
        className
      )}>
        <div className="safe-area-inset">
          {children}
        </div>
      </main>

      {showBottomNav && <MobileBottomNavigation />}
    </div>
  );
};

export default MobileLayout;