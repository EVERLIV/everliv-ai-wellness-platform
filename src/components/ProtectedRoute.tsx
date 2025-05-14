
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminRequired = false }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (adminRequired && user?.user_metadata?.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate, adminRequired]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (adminRequired && user?.user_metadata?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
