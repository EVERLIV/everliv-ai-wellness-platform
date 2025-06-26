
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from "react";

// Immediate load components (critical path)
import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoadingFallback from "./components/common/LoadingFallback";

// Lazy load route modules
const AdminRoutes = lazy(() => import("./modules/admin/AdminRoutes"));
const ServiceRoutes = lazy(() => import("./modules/services/ServiceRoutes"));
const PartnershipRoutes = lazy(() => import("./modules/partnerships/PartnershipRoutes"));
const AuthRoutes = lazy(() => import("./modules/auth/AuthRoutes"));
const ProtectedRoutes = lazy(() => import("./modules/protected/ProtectedRoutes"));

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

import { SmartAuthProvider } from "./contexts/SmartAuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
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
        <Suspense fallback={<LoadingFallback />}>
          <BrowserRouter>
            <SmartAuthProvider>
              <SubscriptionProvider>
                <DevModeIndicator />
                <RealtimeNotifications />
                <Routes>
                  {/* Critical path routes - no lazy loading */}
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<Home />} />

                  {/* Public routes - lazy loaded */}
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
                  <Route path="/biological-age" element={<BiologicalAgePage />} />

                  {/* Route modules - lazy loaded */}
                  <Route path="/services/*" element={<ServiceRoutes />} />
                  <Route path="/partnerships/*" element={<PartnershipRoutes />} />
                  <Route path="/admin/*" element={<AdminRoutes />} />
                  
                  {/* Auth routes */}
                  <Route path="/*" element={<AuthRoutes />} />
                  
                  {/* Protected routes */}
                  <Route path="/*" element={<ProtectedRoutes />} />

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
