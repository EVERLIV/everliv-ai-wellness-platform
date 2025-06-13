
import React from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Navigate } from "react-router-dom";
import AnalyticsManagement from "@/components/admin/analytics/AnalyticsManagement";

const AdminAnalytics = () => {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AnalyticsManagement />;
};

export default AdminAnalytics;
