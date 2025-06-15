
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
import MoscowClinics from "@/pages/MoscowClinics";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AccountSettings from "@/pages/AccountSettings";
import LabAnalyses from "@/pages/LabAnalyses";
import Analytics from "@/pages/Analytics";
import AIDoctorPage from "@/pages/AIDoctorPage";
import AIDoctorChatPage from "@/pages/AIDoctorChatPage";
import AIDoctorBasicPage from "@/pages/AIDoctorBasicPage";
import AIDoctorPersonalPage from "@/pages/AIDoctorPersonalPage";
import ServicesPage from "@/pages/ServicesPage";
import Pricing from "@/pages/Pricing";
import Partnership from "@/pages/Partnership";
import Contact from "@/pages/Contact";
import AnalysisDetails from "@/pages/AnalysisDetails";
import SubscriptionPage from "@/pages/SubscriptionPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AuthConfirm from "@/pages/AuthConfirm";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminAIChat from "@/pages/admin/AdminAIChat";
import AdminNutrition from "@/pages/admin/AdminNutrition";
import AdminHealthRecommendations from "@/pages/admin/AdminHealthRecommendations";
import AdminHealthProfiles from "@/pages/admin/AdminHealthProfiles";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminContent from "@/pages/admin/AdminContent";
import AdminSettings from "@/pages/admin/AdminSettings";

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
                <Route path="/moscow-clinics" element={<MoscowClinics />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/confirm" element={<AuthConfirm />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/lab-analyses" element={<LabAnalyses />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ai-doctor" element={<AIDoctorPage />} />
                <Route path="/ai-doctor/basic" element={<AIDoctorBasicPage />} />
                <Route path="/ai-doctor/personal" element={<AIDoctorPersonalPage />} />
                <Route path="/ai-doctor/chat/:chatId" element={<AIDoctorChatPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/partnership" element={<Partnership />} />
                <Route path="/support" element={<AccountSettings />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/analysis-details" element={<AnalysisDetails />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboardLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="ai-chat" element={<AdminAIChat />} />
                  <Route path="nutrition" element={<AdminNutrition />} />
                  <Route path="health-recommendations" element={<AdminHealthRecommendations />} />
                  <Route path="health-profiles" element={<AdminHealthProfiles />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
