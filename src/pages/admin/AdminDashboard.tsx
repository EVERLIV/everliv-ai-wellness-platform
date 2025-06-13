
import React from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AdminOverview from "@/components/admin/dashboard/AdminOverview";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useIsAdmin();

  console.log('AdminDashboard render:', { 
    user: user?.email, 
    isAdmin, 
    isLoading 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Проверяем права администратора...</p>
          <p className="text-sm text-gray-500 mt-2">Пользователь: {user?.email}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('Redirecting to dashboard - user is not admin');
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminOverview />;
};

export default AdminDashboard;
