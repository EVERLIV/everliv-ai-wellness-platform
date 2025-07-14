import React from 'react';
import AIDoctorSidebar from './AIDoctorSidebar';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';

interface AIDoctorLayoutProps {
  children: React.ReactNode;
}

const AIDoctorLayout: React.FC<AIDoctorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 pt-16 flex">
        <AIDoctorSidebar />
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AIDoctorLayout;