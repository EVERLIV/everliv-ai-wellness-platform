
import { Helmet } from 'react-helmet-async';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import ProtectedRoute from '@/components/ProtectedRoute';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <Helmet>
        <title>Дашборд - EverLiv</title>
        <meta name="description" content="Ваш персональный дашборд здоровья с AI-рекомендациями" />
      </Helmet>
      
      <PageLayoutWithHeader>
        <div className="space-y-8">
          <DashboardHeader />
          <DashboardTabs />
        </div>
      </PageLayoutWithHeader>
    </ProtectedRoute>
  );
};

export default Dashboard;
