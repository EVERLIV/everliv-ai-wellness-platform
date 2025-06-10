
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserProfile from "./pages/UserProfile";
import Pricing from "./pages/Pricing";
import AIDoctorPage from "./pages/AIDoctorPage";
import AIDoctorChatPage from "./pages/AIDoctorChatPage";
import AIDoctorGeneralPage from "./pages/AIDoctorGeneralPage";
import AIDoctorPersonalPage from "./pages/AIDoctorPersonalPage";
import LabAnalyses from "./pages/LabAnalyses";
import Analytics from "./pages/Analytics";
import AnalysisDetails from "./pages/AnalysisDetails";

// Import new pages
import AccountSettings from "./pages/AccountSettings";
import Billing from "./pages/Billing";
import Support from "./pages/Support";
import HealthProfile from "./pages/HealthProfile";

// Import pages that exist in our read-only files list
import Science from './pages/Science';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Import partnership subpages
import MedicalInstitutions from './pages/partnerships/MedicalInstitutions';
import CorporateClients from './pages/partnerships/CorporateClients';
import MedicalSpecialists from './pages/partnerships/MedicalSpecialists';

// Import service pages
import ColdTherapy from './pages/services/ColdTherapy';
import Fasting from './pages/services/Fasting';
import BreathingPractices from './pages/services/BreathingPractices';
import OxygenTherapy from './pages/services/OxygenTherapy';
import AIRecommendations from './pages/services/AIRecommendations';
import PersonalizedSupplements from './pages/services/PersonalizedSupplements';
import LandingPage from './pages/LandingPage';

// Import new pages
import NutritionDiary from "@/pages/NutritionDiary";

const App: React.FC = () => {
  // Create QueryClient inside component to ensure proper React context
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/health-profile" element={<ProtectedRoute><HealthProfile /></ProtectedRoute>} />
                <Route path="/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
                <Route path="/ai-doctor" element={<ProtectedRoute><AIDoctorPage /></ProtectedRoute>} />
                <Route path="/ai-doctor/chat/:chatId" element={<ProtectedRoute><AIDoctorChatPage /></ProtectedRoute>} />
                <Route path="/ai-doctor/general" element={<ProtectedRoute><AIDoctorGeneralPage /></ProtectedRoute>} />
                <Route path="/ai-doctor/personal" element={<ProtectedRoute><AIDoctorPersonalPage /></ProtectedRoute>} />
                <Route path="/lab-analyses" element={<ProtectedRoute><LabAnalyses /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/analysis-details" element={<ProtectedRoute><AnalysisDetails /></ProtectedRoute>} />
                
                {/* Partnership subpages */}
                <Route path="/partnerships/medical-institutions" element={<MedicalInstitutions />} />
                <Route path="/partnerships/corporate-clients" element={<CorporateClients />} />
                <Route path="/partnerships/medical-specialists" element={<MedicalSpecialists />} />
                
                {/* Service pages */}
                <Route path="/services/cold-therapy" element={<ColdTherapy />} />
                <Route path="/services/fasting" element={<Fasting />} />
                <Route path="/services/breathing-practices" element={<BreathingPractices />} />
                <Route path="/services/oxygen-therapy" element={<OxygenTherapy />} />
                <Route path="/services/ai-recommendations" element={<AIRecommendations />} />
                <Route path="/services/personalized-supplements" element={<PersonalizedSupplements />} />
                
                {/* New Route */}
                <Route
                  path="/nutrition-diary"
                  element={
                    <ProtectedRoute>
                      <NutritionDiary />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </TooltipProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
