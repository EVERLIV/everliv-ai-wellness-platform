
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load protected components
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const Settings = lazy(() => import("@/pages/Settings"));
const HealthProfile = lazy(() => import("@/pages/HealthProfile"));
const HealthTracking = lazy(() => import("@/pages/HealthTracking"));
const BloodAnalysis = lazy(() => import("@/pages/BloodAnalysis"));
const LabAnalyses = lazy(() => import("@/pages/LabAnalyses"));
const AnalysisDetails = lazy(() => import("@/pages/AnalysisDetails"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const AIDoctorPage = lazy(() => import("@/pages/AIDoctorPage"));
const AIDoctorBasicPage = lazy(() => import("@/pages/AIDoctorBasicPage"));
const AIDoctorPersonalPage = lazy(() => import("@/pages/AIDoctorPersonalPage"));
const NutritionDiaryPage = lazy(() => import("@/pages/NutritionDiary"));
const MyProtocols = lazy(() => import("@/pages/MyProtocols"));
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
      <Route path="/health-tracking" element={
        <ProtectedRoute>
          <HealthTracking />
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
          <AIDoctorPage />
        </ProtectedRoute>
      } />
      <Route path="/ai-doctor/basic" element={
        <ProtectedRoute>
          <AIDoctorBasicPage />
        </ProtectedRoute>
      } />
      <Route path="/ai-doctor/personal" element={
        <ProtectedRoute>
          <AIDoctorPersonalPage />
        </ProtectedRoute>
      } />
      <Route path="/nutrition-diary" element={
        <ProtectedRoute>
          <NutritionDiaryPage />
        </ProtectedRoute>
      } />
      <Route path="/my-protocols" element={
        <ProtectedRoute>
          <MyProtocols />
        </ProtectedRoute>
      } />
      <Route path="/protocol-tracking" element={
        <ProtectedRoute>
          <ProtocolTracking />
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
