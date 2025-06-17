
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import RegistrationPage from "./pages/RegistrationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import LabAnalyses from "./pages/LabAnalyses";
import AnalysisDetails from "./pages/AnalysisDetails";
import Analytics from "./pages/Analytics";
import MedicalKnowledge from "./pages/MedicalKnowledge";
import AIDoctorPage from "./pages/AIDoctorPage";
import AIDoctorBasicPage from "./pages/AIDoctorBasicPage";
import AIDoctorPersonalPage from "./pages/AIDoctorPersonalPage";
import NutritionDiaryPage from "./pages/NutritionDiary";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminContent from "./pages/admin/AdminContent";
import AdminAIChat from "./pages/admin/AdminAIChat";
import AdminNutrition from "./pages/admin/AdminNutrition";
import AdminHealthProfiles from "./pages/admin/AdminHealthProfiles";
import AdminHealthRecommendations from "./pages/admin/AdminHealthRecommendations";
import AdminSettings from "./pages/admin/AdminSettings";

// Import additional pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Science from "./pages/Science";
import Partnership from "./pages/Partnership";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Security from "./pages/Security";
import HelpCenter from "./pages/HelpCenter";
import ServicesPage from "./pages/ServicesPage";
import BloodAnalysis from "./pages/BloodAnalysis";
import HealthProfile from "./pages/HealthProfile";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import MagicLinkLoginPage from "./pages/MagicLinkLoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AuthConfirm from "./pages/AuthConfirm";
import SubscriptionPage from "./pages/SubscriptionPage";
import UserSubscription from "./pages/UserSubscription";
import Checkout from "./pages/Checkout";
import MoscowClinics from "./pages/MoscowClinics";
import ProtocolTracking from "./pages/ProtocolTracking";
import MyProtocols from "./pages/MyProtocols";
import Community from "./pages/Community";
import Webinars from "./pages/Webinars";

// Import service pages
import BloodAnalysisServicePage from "./pages/services/BloodAnalysisServicePage";
import AIRecommendations from "./pages/services/AIRecommendations";
import PersonalizedSupplements from "./pages/services/PersonalizedSupplements";
import Fasting from "./pages/services/Fasting";
import ColdTherapy from "./pages/services/ColdTherapy";
import OxygenTherapy from "./pages/services/OxygenTherapy";
import BreathingPractices from "./pages/services/BreathingPractices";

// Import partnership pages
import CorporateClients from "./pages/partnerships/CorporateClients";
import MedicalInstitutions from "./pages/partnerships/MedicalInstitutions";
import MedicalSpecialists from "./pages/partnerships/MedicalSpecialists";

// Import admin pages
import AdminPricing from "./pages/admin/AdminPricing";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminBlog from "./pages/AdminBlog";

import { SmartAuthProvider } from "./contexts/SmartAuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RealtimeNotifications from "./components/realtime/RealtimeNotifications";
import DevModeIndicator from "./components/DevModeIndicator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <Toaster />
        <Sonner />
        <DevModeIndicator />
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <SmartAuthProvider>
              <SubscriptionProvider>
                <RealtimeNotifications />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/science" element={<Science />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/partnership" element={<Partnership />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/terms" element={<TermsOfUse />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/medical-knowledge" element={<MedicalKnowledge />} />
                  <Route path="/specialists" element={<MedicalKnowledge />} />
                  <Route path="/moscow-clinics" element={<MoscowClinics />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/webinars" element={<Webinars />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/register" element={<RegistrationPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/magic-link" element={<MagicLinkLoginPage />} />
                  <Route path="/auth/confirm" element={<AuthConfirm />} />
                  <Route path="/welcome" element={<Welcome />} />

                  {/* Service Pages */}
                  <Route path="/services/blood-analysis" element={<BloodAnalysisServicePage />} />
                  <Route path="/services/ai-recommendations" element={<AIRecommendations />} />
                  <Route path="/services/supplements" element={<PersonalizedSupplements />} />
                  <Route path="/services/fasting" element={<Fasting />} />
                  <Route path="/services/cold-therapy" element={<ColdTherapy />} />
                  <Route path="/services/oxygen-therapy" element={<OxygenTherapy />} />
                  <Route path="/services/breathing" element={<BreathingPractices />} />

                  {/* Partnership Pages */}
                  <Route path="/partnerships/corporate" element={<CorporateClients />} />
                  <Route path="/partnerships/medical-institutions" element={<MedicalInstitutions />} />
                  <Route path="/partnerships/specialists" element={<MedicalSpecialists />} />

                  {/* Protected Routes */}
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
                      <UserProfile />
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
                  <Route path="/medical-analysis" element={
                    <ProtectedRoute>
                      <LabAnalyses />
                    </ProtectedRoute>
                  } />
                  <Route path="/analysis/:id" element={
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
                  <Route path="/protocols" element={
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

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute>
                      <AdminUsers />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/analytics" element={
                    <ProtectedRoute>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/content" element={
                    <ProtectedRoute>
                      <AdminContent />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/ai-chat" element={
                    <ProtectedRoute>
                      <AdminAIChat />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/nutrition" element={
                    <ProtectedRoute>
                      <AdminNutrition />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/health-profiles" element={
                    <ProtectedRoute>
                      <AdminHealthProfiles />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/health-recommendations" element={
                    <ProtectedRoute>
                      <AdminHealthRecommendations />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute>
                      <AdminSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/pricing" element={
                    <ProtectedRoute>
                      <AdminPricing />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/statistics" element={
                    <ProtectedRoute>
                      <AdminStatistics />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/blog" element={
                    <ProtectedRoute>
                      <AdminBlog />
                    </ProtectedRoute>
                  } />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SubscriptionProvider>
            </SmartAuthProvider>
          </BrowserRouter>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
