
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import MedicalAnalysis from "./pages/MedicalAnalysis";
import AnalysisDetails from "./pages/AnalysisDetails";
import Analytics from "./pages/Analytics";
import Specialists from "./pages/Specialists";
import AIDoctorPage from "./pages/AIDoctorPage";
import BasicAIDoctorPage from "./pages/BasicAIDoctorPage";
import PersonalAIDoctorPage from "./pages/PersonalAIDoctorPage";
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
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RealtimeNotifications from "./components/realtime/RealtimeNotifications";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>
              <RealtimeNotifications />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/specialists" element={<Specialists />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/medical-analysis" element={
                  <ProtectedRoute>
                    <MedicalAnalysis />
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
                    <BasicAIDoctorPage />
                  </ProtectedRoute>
                } />
                <Route path="/ai-doctor/personal" element={
                  <ProtectedRoute>
                    <PersonalAIDoctorPage />
                  </ProtectedRoute>
                } />
                <Route path="/nutrition-diary" element={
                  <ProtectedRoute>
                    <NutritionDiaryPage />
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
              </Routes>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
