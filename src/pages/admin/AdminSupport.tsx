
import React from "react";
import SupportRequestsManagement from "@/components/admin/support/SupportRequestsManagement";

const AdminSupport = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Тех Поддержка</h1>
        <p className="text-gray-600 mt-2">
          Управление обращениями пользователей и технической поддержкой
        </p>
      </div>
      
      <SupportRequestsManagement />
    </div>
  );
};

export default AdminSupport;
