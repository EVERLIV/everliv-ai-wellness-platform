
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import UserProfile from "@/pages/UserProfile";
import BloodAnalysis from "@/pages/BloodAnalysis";
import ComprehensiveAnalysis from "@/pages/ComprehensiveAnalysis";
import UserSubscription from "@/pages/UserSubscription";
import MyProtocols from "@/pages/MyProtocols";
import ProtocolTracking from "@/pages/ProtocolTracking";
import ProtocolTrackingDashboard from "@/pages/ProtocolTrackingDashboard";
import NutritionDiary from "@/pages/NutritionDiary";
import HealthProfile from "@/pages/HealthProfile";
import MedicalKnowledge from "@/pages/MedicalKnowledge";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AccountSettings from "@/pages/AccountSettings";
import LabAnalyses from "@/pages/LabAnalyses";
import Analytics from "@/pages/Analytics";
import AIDoctorPage from "@/pages/AIDoctorPage";
import ServicesPage from "@/pages/ServicesPage";
import Pricing from "@/pages/Pricing";
import Partnership from "@/pages/Partnership";
import Contact from "@/pages/Contact";
import AnalysisDetails from "@/pages/AnalysisDetails";
import SubscriptionPage from "@/pages/SubscriptionPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/blood-analysis" element={<BloodAnalysis />} />
                <Route path="/comprehensive-analysis" element={<ComprehensiveAnalysis />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/my-protocols" element={<MyProtocols />} />
                <Route path="/protocol/:id" element={<ProtocolTracking />} />
                <Route path="/protocol-dashboard" element={<ProtocolTrackingDashboard />} />
                <Route path="/nutrition-diary" element={<NutritionDiary />} />
                <Route path="/health-profile" element={<HealthProfile />} />
                <Route path="/medical-knowledge" element={<MedicalKnowledge />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/lab-analyses" element={<LabAnalyses />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ai-doctor" element={<AIDoctorPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/partnership" element={<Partnership />} />
                <Route path="/support" element={<AccountSettings />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/analysis-details" element={<AnalysisDetails />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Routes>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
