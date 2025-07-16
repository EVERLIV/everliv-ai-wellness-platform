
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { QueryOptimizer } from "./components/performance/QueryOptimizer";
import ProtectedRoute from "./components/ProtectedRoute";

// Immediate load components (critical path)
import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoadingFallback from "./components/common/LoadingFallback";

// Lazy load route modules
const AdminRoutes = lazy(() => import("./modules/admin/AdminRoutes"));
const ServiceRoutes = lazy(() => import("./modules/services/ServiceRoutes"));
const PartnershipRoutes = lazy(() => import("./modules/partnerships/PartnershipRoutes"));

// Lazy load public pages
const Features = lazy(() => import("./pages/Features"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Science = lazy(() => import("./pages/Science"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Partnership = lazy(() => import("./pages/Partnership"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Support = lazy(() => import("./pages/Support"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Security = lazy(() => import("./pages/Security"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const MedicalKnowledge = lazy(() => import("./pages/MedicalKnowledge"));
const MoscowClinics = lazy(() => import("./pages/MoscowClinics"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const Community = lazy(() => import("./pages/Community"));
const Webinars = lazy(() => import("./pages/Webinars"));
const BiologicalAgePage = lazy(() => import("./pages/BiologicalAge"));
const DiagnosticsPage = lazy(() => import("./pages/DiagnosticsPage"));

// Auth pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AuthConfirm = lazy(() => import("./pages/AuthConfirm"));
const Welcome = lazy(() => import("./pages/Welcome"));

// Protected pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Settings = lazy(() => import("./pages/Settings"));
const HealthProfile = lazy(() => import("./pages/HealthProfile"));
const BloodAnalysis = lazy(() => import("./pages/BloodAnalysis"));
const LabAnalyses = lazy(() => import("./pages/LabAnalyses"));
const AnalysisDetails = lazy(() => import("./pages/AnalysisDetails"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AIDoctorPage = lazy(() => import("./pages/AIDoctorPage"));
const AIDoctorBasicPage = lazy(() => import("./pages/AIDoctorBasicPage"));
const AIDoctorPersonalPage = lazy(() => import("./pages/AIDoctorPersonalPage"));
const NutritionDiaryPage = lazy(() => import("./pages/NutritionDiary"));
const MyBiomarkers = lazy(() => import("./pages/MyBiomarkers"));
const MyRecommendations = lazy(() => import("./pages/MyRecommendations"));
const ProtocolTracking = lazy(() => import("./pages/ProtocolTracking"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const UserSubscription = lazy(() => import("./pages/UserSubscription"));
const Checkout = lazy(() => import("./pages/Checkout"));

import { SmartAuthProvider } from "./contexts/SmartAuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { SecureDataProvider } from "./components/common/SecureDataProvider";
import RealtimeNotifications from "./components/realtime/RealtimeNotifications";
import RealtimeMonitor from "./components/admin/RealtimeMonitor";
import DevModeIndicator from "./components/DevModeIndicator";

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryOptimizer>
        <TooltipProvider delayDuration={0}>
          <Toaster />
          <Sonner />
          <Suspense fallback={<LoadingFallback />}>
            <BrowserRouter>
              <SmartAuthProvider>
                <SubscriptionProvider>
                  <SecureDataProvider>
                    <DevModeIndicator />
                    <RealtimeNotifications />
                    <Routes>
                      {/* Critical path routes - no lazy loading */}
                      <Route path="/" element={<Index />} />
                      <Route path="/home" element={<Home />} />

                      {/* Auth routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/auth/confirm" element={<AuthConfirm />} />
                      <Route path="/welcome" element={<Welcome />} />

                      {/* Protected routes */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/notifications" element={
                        <ProtectedRoute>
                          <NotificationsPage />
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
                       <Route path="/my-biomarkers" element={
                        <ProtectedRoute>
                          <MyBiomarkers />
                        </ProtectedRoute>
                      } />
                      <Route path="/my-recommendations" element={
                        <ProtectedRoute>
                          <MyRecommendations />
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

                      {/* Public routes - lazy loaded */}
                      <Route path="/features" element={<Features />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="/science" element={<Science />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/pricing" element={<PricingPage />} />
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
                      <Route path="/knowledge-base" element={<Navigate to="/medical-knowledge" replace />} />
                      <Route path="/specialists" element={<MedicalKnowledge />} />
                      <Route path="/moscow-clinics" element={<MoscowClinics />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/webinars" element={<Webinars />} />
                      <Route path="/biological-age" element={<BiologicalAgePage />} />
                      <Route path="/diagnostics/*" element={
                        <ProtectedRoute>
                          <DiagnosticsPage />
                        </ProtectedRoute>
                      } />

                      {/* Route modules - lazy loaded */}
                      <Route path="/services/*" element={<ServiceRoutes />} />
                      <Route path="/partnerships/*" element={<PartnershipRoutes />} />
                      <Route path="/admin/*" element={<AdminRoutes />} />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </SecureDataProvider>
                </SubscriptionProvider>
              </SmartAuthProvider>
            </BrowserRouter>
          </Suspense>
        </TooltipProvider>
      </QueryOptimizer>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
