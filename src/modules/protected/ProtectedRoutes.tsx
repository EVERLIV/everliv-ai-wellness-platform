
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load protected components
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const Settings = lazy(() => import("@/pages/Settings"));
const HealthProfile = lazy(() => import("@/pages/HealthProfile"));
const BloodAnalysis = lazy(() => import("@/pages/BloodAnalysis"));
const LabAnalyses = lazy(() => import("@/pages/LabAnalyses"));
const AnalysisDetails = lazy(() => import("@/pages/AnalysisDetails"));
const Analytics = lazy(() => import("@/pages/Analytics"));

const AIDoctorBasicPage = lazy(() => import("@/pages/AIDoctorBasicPage"));

const ProtocolTracking = lazy(() => import("@/pages/ProtocolTracking"));
const SubscriptionPage = lazy(() => import("@/pages/SubscriptionPage"));
const UserSubscription = lazy(() => import("@/pages/UserSubscription"));
const Checkout = lazy(() => import("@/pages/Checkout"));

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/health-profile" element={
        <ProtectedRoute>
          <HealthProfile />
        </ProtectedRoute>
      } />
      <Route path="/blood-analysis" element={
        <ProtectedRoute>
          <BloodAnalysis />
        </ProtectedRoute>
      } />
      <Route path="/lab-analyses" element={
        <ProtectedRoute>
          <LabAnalyses />
        </ProtectedRoute>
      } />
      <Route path="/analysis-details" element={
        <ProtectedRoute>
          <AnalysisDetails />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/ai-doctor" element={
        <ProtectedRoute>
          <AIDoctorBasicPage />
        </ProtectedRoute>
      } />
      <Route path="/subscription" element={
        <ProtectedRoute>
          <SubscriptionPage />
        </ProtectedRoute>
      } />
      <Route path="/user-subscription" element={
        <ProtectedRoute>
          <UserSubscription />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default ProtectedRoutes;
