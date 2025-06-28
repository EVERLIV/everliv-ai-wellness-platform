
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ leftColumn, rightColumn }) => {
  const isMobile = useIsMobile();

  return (
    <div className={`container mx-auto px-2 sm:px-3 py-2 sm:py-3 max-w-[1400px] ${isMobile ? 'mobile-compact' : ''}`}>
      <div className={`grid h-full ${
        isMobile 
          ? 'grid-cols-1 gap-2' 
          : 'grid-cols-12 gap-3'
      }`}>
        <div className={`${isMobile ? 'col-span-1' : 'col-span-12 lg:col-span-8'} space-y-2 sm:space-y-3`}>
          {leftColumn}
        </div>
        {!isMobile && (
          <div className="col-span-12 lg:col-span-4 space-y-2 sm:space-y-3">
            {rightColumn}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
