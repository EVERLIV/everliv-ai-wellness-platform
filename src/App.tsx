
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/blood-analysis" element={<BloodAnalysis />} />
                <Route path="/comprehensive-analysis" element={<ComprehensiveAnalysis />} />
                <Route path="/subscription" element={<UserSubscription />} />
                <Route path="/my-protocols" element={<MyProtocols />} />
                <Route path="/protocol/:id" element={<ProtocolTracking />} />
                <Route path="/protocol-dashboard" element={<ProtocolTrackingDashboard />} />
                <Route path="/nutrition-diary" element={<NutritionDiary />} />
                <Route path="/health-profile" element={<HealthProfile />} />
                <Route path="/medical-knowledge" element={<MedicalKnowledge />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/lab-analyses" element={<LabAnalyses />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
