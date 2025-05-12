
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
import Signup from "./pages/Signup";
import Science from "./pages/Science";
import RestrictedService from "./pages/RestrictedService";
import Index from "./pages/Index";
import LegalInfo from "./pages/LegalInfo";
import Contacts from "./pages/Contacts";
import DeliveryInfo from "./pages/DeliveryInfo";
import PaymentInfo from "./pages/PaymentInfo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Checkout from "./pages/Checkout";
import TermsOfUse from "./pages/TermsOfUse";
import About from "./pages/About";
import Blog from "./pages/Blog";
import HelpCenter from "./pages/HelpCenter";
import Security from "./pages/Security";
import AIMedicine from "./pages/AIMedicine";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

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
      <Route path="/signup" element={<Signup />} />
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
      
      <Route path="/" element={<Index />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:serviceId" element={<RestrictedService />} />
      
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
      
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/webinars" element={<Webinars />} />
      <Route path="/subscription" element={<UserSubscription />} />
      <Route path="/science" element={<Science />} />
      
      <Route path="/legal" element={<LegalInfo />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/delivery" element={<DeliveryInfo />} />
      <Route path="/payment-info" element={<PaymentInfo />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/checkout" element={<Checkout />} />
      
      {/* New Routes */}
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/security" element={<Security />} />
      <Route path="/ai-medicine" element={<AIMedicine />} />
      <Route path="/faq" element={<FAQ />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
