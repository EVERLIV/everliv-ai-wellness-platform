
import React from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Navigate } from "react-router-dom";
import HealthRecommendationsManagement from "@/components/admin/health-recommendations/HealthRecommendationsManagement";

const AdminHealthRecommendations = () => {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <HealthRecommendationsManagement />;
};

export default AdminHealthRecommendations;
