import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHeader from './MobileHeader';
import MobileBottomNavigation from './MobileBottomNavigation';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  headerProps?: any;
  className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  subtitle,
  showHeader = true,
  showBottomNav = true,
  showBack = false,
  onBack,
  headerProps = {},
  className
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <MobileHeader 
          title={title} 
          subtitle={subtitle}
          showBack={showBack}
          onBack={onBack}
          {...headerProps} 
        />
      )}
      
      <main className={cn(
        "flex-1",
        showBottomNav && "pb-20",
        className
      )}>
        {children}
      </main>

      {showBottomNav && <MobileBottomNavigation />}
    </div>
  );
};

export default MobileLayout;