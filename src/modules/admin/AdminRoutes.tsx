
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load admin components
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminAnalytics"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminAIChat = lazy(() => import("@/pages/admin/AdminAIChat"));
const AdminNutrition = lazy(() => import("@/pages/admin/AdminNutrition"));
const AdminHealthProfiles = lazy(() => import("@/pages/admin/AdminHealthProfiles"));
const AdminHealthRecommendations = lazy(() => import("@/pages/admin/AdminHealthRecommendations"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminPricing = lazy(() => import("@/pages/admin/AdminPricing"));
const AdminStatistics = lazy(() => import("@/pages/admin/AdminStatistics"));
const AdminBlog = lazy(() => import("@/pages/AdminBlog"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <AdminAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/content" element={
        <ProtectedRoute>
          <AdminContent />
        </ProtectedRoute>
      } />
      <Route path="/ai-chat" element={
        <ProtectedRoute>
          <AdminAIChat />
        </ProtectedRoute>
      } />
      <Route path="/nutrition" element={
        <ProtectedRoute>
          <AdminNutrition />
        </ProtectedRoute>
      } />
      <Route path="/health-profiles" element={
        <ProtectedRoute>
          <AdminHealthProfiles />
        </ProtectedRoute>
      } />
      <Route path="/health-recommendations" element={
        <ProtectedRoute>
          <AdminHealthRecommendations />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      } />
      <Route path="/pricing" element={
        <ProtectedRoute>
          <AdminPricing />
        </ProtectedRoute>
      } />
      <Route path="/statistics" element={
        <ProtectedRoute>
          <AdminStatistics />
        </ProtectedRoute>
      } />
      <Route path="/blog" element={
        <ProtectedRoute>
          <AdminBlog />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;
