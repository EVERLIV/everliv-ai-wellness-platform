
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import AuthConfirm from './pages/AuthConfirm';
import Welcome from './pages/Welcome';
import MedicalKnowledge from './pages/MedicalKnowledge';
import SubscriptionPage from './pages/SubscriptionPage';
import UserProfile from './pages/UserProfile';
import NutritionDiary from './pages/NutritionDiary';
import BloodAnalysisPage from './pages/BloodAnalysisPage';
import AnalysisDetails from './pages/AnalysisDetails';
import BiologicalAgePage from './pages/BiologicalAgePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBlog from './pages/admin/AdminBlog';
import AdminOverview from './pages/admin/AdminOverview';
import AdminSettings from './pages/admin/AdminSettings';
import AdminPricing from './pages/admin/AdminPricing';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminContent from './pages/admin/AdminContent';
import AdminSecurity from './pages/admin/AdminSecurity';
import RealtimeNotifications from './components/realtime/RealtimeNotifications';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import SecurityHeaders from '@/components/SecurityHeaders';
import DevModeIndicator from '@/components/DevModeIndicator';

const queryClient = new QueryClient()

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SecurityHeaders />
        <DevModeIndicator />
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <SubscriptionProvider>
              <Toaster />
              <RealtimeNotifications />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/auth-confirm" element={<AuthConfirm />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/medical-knowledge" element={<MedicalKnowledge />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/food-diary" element={<NutritionDiary />} />
                  <Route path="/blood-test-analysis" element={<BloodAnalysisPage />} />
                  <Route path="/medical-analysis/:analysisId" element={<AnalysisDetails />} />
                  <Route path="/medical-analysis" element={<AnalysisDetails />} />
                  <Route path="/biological-age" element={<BiologicalAgePage />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/articles" element={<AdminBlog />} />
                  <Route path="/admin/protocols" element={<AdminOverview />} />
                  <Route path="/admin/specializations" element={<AdminSettings />} />
                  <Route path="/admin/categories" element={<AdminContent />} />
                  <Route path="/admin/subscriptions" element={<AdminPricing />} />
                  <Route path="/admin/payments" element={<AdminStatistics />} />
                  <Route path="/admin/security" element={<AdminSecurity />} />
                </Routes>
              </BrowserRouter>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
