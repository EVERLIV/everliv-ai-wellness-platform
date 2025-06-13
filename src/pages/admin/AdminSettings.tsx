
import React from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Navigate } from "react-router-dom";
import SystemSettings from "@/components/admin/settings/SystemSettings";

const AdminSettings = () => {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <SystemSettings />;
};

export default AdminSettings;
