
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AdminSidebar from "./AdminSidebar";

const AdminDashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow flex pt-16">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default AdminDashboardLayout;
