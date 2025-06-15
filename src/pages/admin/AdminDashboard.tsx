
import React from "react";
import { useSecureAdminCheck } from "@/hooks/useSecureAdminCheck";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AdminOverview from "@/components/admin/dashboard/AdminOverview";

const AdminDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useSecureAdminCheck();

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Проверяем права доступа...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminOverview />;
};

export default AdminDashboard;
