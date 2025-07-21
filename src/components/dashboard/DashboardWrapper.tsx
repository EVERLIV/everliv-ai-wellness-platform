
import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import SubscriptionDebugPanel from '@/components/debug/SubscriptionDebugPanel';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
  return (
    <div className="relative">
      {children}
      <SubscriptionDebugPanel />
    </div>
  );
};

export default DashboardWrapper;
