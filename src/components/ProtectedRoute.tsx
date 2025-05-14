import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminRequired = false }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (adminRequired && user?.user_metadata?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router, adminRequired]);

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
