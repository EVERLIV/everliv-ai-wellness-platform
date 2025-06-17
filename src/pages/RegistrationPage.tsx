
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import RegistrationForm from '@/components/registration/RegistrationForm';
import RegistrationFooter from '@/components/registration/RegistrationFooter';
import { useSmartAuth } from '@/hooks/useSmartAuth';

const RegistrationPage = () => {
  const { user } = useSmartAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuthLayout 
        title="Создать аккаунт" 
        description="Присоединяйтесь к EVERLIV и начните путь к оптимальному здоровью."
        type="signup"
      >
        <RegistrationForm />
      </AuthLayout>
      <RegistrationFooter />
    </div>
  );
};

export default RegistrationPage;
