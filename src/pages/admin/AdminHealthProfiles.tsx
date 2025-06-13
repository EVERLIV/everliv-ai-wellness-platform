
import React from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Navigate } from "react-router-dom";
import HealthProfilesManagement from "@/components/admin/health-profiles/HealthProfilesManagement";

const AdminHealthProfiles = () => {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <HealthProfilesManagement />;
};

export default AdminHealthProfiles;
