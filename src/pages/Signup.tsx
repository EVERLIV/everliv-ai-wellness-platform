
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import RegistrationForm from '@/components/registration/RegistrationForm';
import { useSmartAuth } from '@/hooks/useSmartAuth';

const Signup = () => {
  const { user } = useSmartAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthLayout 
      title="Создать аккаунт" 
      description="Присоединяйтесь к EVERLIV и начните путь к оптимальному здоровью."
      type="signup"
    >
      <RegistrationForm />
    </AuthLayout>
  );
};

export default Signup;
