
import { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';

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
    <PageLayout title={title} description={description}>
      <div className="flex flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-grow p-4 lg:p-8">
          <div className="space-y-8">
            {children}
          </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default DashboardLayout;
