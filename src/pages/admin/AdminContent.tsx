
import React from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Navigate } from "react-router-dom";
import ContentManagement from "@/components/admin/content/ContentManagement";

const AdminContent = () => {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ContentManagement />;
};

export default AdminContent;
