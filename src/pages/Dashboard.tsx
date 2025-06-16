
import { Helmet } from 'react-helmet-async';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Дашборд - EverLiv</title>
        <meta name="description" content="Ваш персональный дашборд здоровья с AI-рекомендациями" />
      </Helmet>
      
      <PageLayoutWithHeader
        headerComponent={<DashboardHeader userName={user?.email || 'Пользователь'} />}
      >
        <div className="space-y-8">
          <DashboardTabs />
        </div>
      </PageLayoutWithHeader>
    </ProtectedRoute>
  );
};

export default Dashboard;
