
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Partnership from "./pages/Partnership";
import BloodAnalysis from "./pages/BloodAnalysis";
import BiologicalAge from "./pages/BiologicalAge";
import HowItWorks from "./pages/HowItWorks";
import Science from "./pages/Science";
import Community from "./pages/Community";
import Webinars from "./pages/Webinars";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import UserSubscription from "./pages/UserSubscription";
import PageBuilder from "./pages/PageBuilder";
import AdminBlog from "./pages/AdminBlog";
import ComprehensiveAnalysis from "./pages/ComprehensiveAnalysis";
import UserProfile from "./pages/UserProfile";
import ColdTherapy from "./pages/services/ColdTherapy";
import Fasting from "./pages/services/Fasting";
import BreathingPractices from "./pages/services/BreathingPractices";
import OxygenTherapy from "./pages/services/OxygenTherapy";
import PersonalizedSupplements from "./pages/services/PersonalizedSupplements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider delayDuration={0}>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/partnership" element={<Partnership />} />
              <Route path="/blood-analysis" element={<BloodAnalysis />} />
              <Route path="/biological-age" element={<BiologicalAge />} />
              <Route path="/comprehensive-analysis" element={<ComprehensiveAnalysis />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/science" element={<Science />} />
              <Route path="/community" element={<Community />} />
              <Route path="/webinars" element={<Webinars />} />
              
              {/* Service Pages */}
              <Route path="/services/cold-therapy" element={<ColdTherapy />} />
              <Route path="/services/fasting" element={<Fasting />} />
              <Route path="/services/breathing-practices" element={<BreathingPractices />} />
              <Route path="/services/oxygen-therapy" element={<OxygenTherapy />} />
              <Route path="/services/personalized-supplements" element={<PersonalizedSupplements />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/subscription" element={
                <ProtectedRoute>
                  <UserSubscription />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/page-builder" element={
                <ProtectedRoute>
                  <PageBuilder />
                </ProtectedRoute>
              } />
              <Route path="/page-builder/:pageId" element={
                <ProtectedRoute>
                  <PageBuilder />
                </ProtectedRoute>
              } />
              <Route path="/admin-blog" element={
                <ProtectedRoute>
                  <AdminBlog />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
