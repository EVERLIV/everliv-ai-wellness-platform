
import { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const DashboardLayout = ({ 
  children,
  title = "Панель управления",
  description = "Управление вашими протоколами здоровья и анализами"
}: DashboardLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <PageLayout>
      <div className="flex flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-grow p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          <div className="space-y-8">
            {children}
          </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default DashboardLayout;
