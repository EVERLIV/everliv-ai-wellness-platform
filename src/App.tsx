
import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import LandingPage from "./pages/LandingPage";
import ServicesPage from "./pages/ServicesPage";
import BloodAnalysisPage from "./pages/BloodAnalysisPage";
import BiologicalAgePage from "./pages/BiologicalAgePage";
import ComprehensiveAnalysisPage from "./pages/ComprehensiveAnalysisPage";
import ColdTherapy from "./pages/services/ColdTherapy";
import SubscriptionPage from "./pages/SubscriptionPage";
import MyProtocols from "./pages/MyProtocols";
import ProtocolTracking from "./pages/ProtocolTracking";
import Pricing from "./pages/Pricing";
import Webinars from "./pages/Webinars";
import UserSubscription from "./pages/UserSubscription";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/blood-analysis" element={
        <ProtectedRoute>
          <BloodAnalysisPage />
        </ProtectedRoute>
      } />
      <Route path="/biological-age" element={
        <ProtectedRoute>
          <BiologicalAgePage />
        </ProtectedRoute>
      } />
      <Route path="/comprehensive-analysis" element={
        <ProtectedRoute>
          <ComprehensiveAnalysisPage />
        </ProtectedRoute>
      } />
      <Route path="/services/cold-therapy" element={<ColdTherapy />} />
      <Route path="/dashboard/subscription" element={
        <ProtectedRoute>
          <SubscriptionPage />
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
      <Route path="/protocols/:id" element={
        <ProtectedRoute>
          <ProtocolTracking />
        </ProtectedRoute>
      } />
      
      {/* Adding missing routes */}
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/webinars" element={<Webinars />} />
      <Route path="/subscription" element={<UserSubscription />} />
      
      {/* Add catch-all route for 404 errors */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
