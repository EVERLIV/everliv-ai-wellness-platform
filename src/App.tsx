
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
import ServicesPage from "./pages/ServicesPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Science from "./pages/Science";
import Partnership from "./pages/Partnership";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Features from "./pages/Features";
import AIDoctorPage from "./pages/AIDoctorPage";
import BloodAnalysisPage from "./pages/BloodAnalysisPage";
import HealthProfile from "./pages/HealthProfile";
import NutritionDiary from "./pages/NutritionDiary";
import Analytics from "./pages/Analytics";
import LabAnalyses from "./pages/LabAnalyses";
import AnalysisDetails from "./pages/AnalysisDetails";
import AccountSettings from "./pages/AccountSettings";
import UserSubscription from "./pages/UserSubscription";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<RegistrationPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/science" element={<Science />} />
              <Route path="/partnership" element={<Partnership />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/features" element={<Features />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-doctor"
                element={
                  <ProtectedRoute>
                    <AIDoctorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blood-analysis"
                element={
                  <ProtectedRoute>
                    <BloodAnalysisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/health-profile"
                element={
                  <ProtectedRoute>
                    <HealthProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/nutrition-diary"
                element={
                  <ProtectedRoute>
                    <NutritionDiary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lab-analyses"
                element={
                  <ProtectedRoute>
                    <LabAnalyses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis-details"
                element={
                  <ProtectedRoute>
                    <AnalysisDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <UserSubscription />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
