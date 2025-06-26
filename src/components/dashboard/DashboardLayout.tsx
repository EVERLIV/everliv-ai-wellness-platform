
import React from 'react';

interface DashboardLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ leftColumn, rightColumn }) => {
  return (
    <div className="container mx-auto px-3 py-3 max-w-[1400px]">
      <div className="grid grid-cols-12 gap-3 h-full">
        <div className="col-span-12 lg:col-span-8 space-y-3">
          {leftColumn}
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-3">
          {rightColumn}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
