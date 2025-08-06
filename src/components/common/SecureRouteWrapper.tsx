import React from 'react';
import { SecureDataProvider } from '@/components/common/SecureDataProvider';

interface SecureRouteWrapperProps {
  children: React.ReactNode;
}

const SecureRouteWrapper = ({ children }: SecureRouteWrapperProps) => {
  return (
    <SecureDataProvider>
      {children}
    </SecureDataProvider>
  );
};

export default SecureRouteWrapper;