import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import AuthConfirm from './pages/AuthConfirm';
import Welcome from './pages/Welcome';
import MedicalKnowledge from './pages/MedicalKnowledge';
import SubscriptionPage from './pages/SubscriptionPage';
import Profile from './pages/Profile';
import FoodDiary from './pages/FoodDiary';
import BloodTestAnalysisPage from './pages/BloodTestAnalysisPage';
import MedicalAnalysisPage from './pages/MedicalAnalysisPage';
import BiologicalAgePage from './pages/BiologicalAgePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminArticles from './pages/admin/AdminArticles';
import AdminProtocols from './pages/admin/AdminProtocols';
import AdminSpecializations from './pages/admin/AdminSpecializations';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSecurity from './pages/admin/AdminSecurity';
import RealtimeNotifications from './components/RealtimeNotifications';

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
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/food-diary" element={<FoodDiary />} />
                  <Route path="/blood-test-analysis" element={<BloodTestAnalysisPage />} />
                  <Route path="/medical-analysis/:analysisId" element={<MedicalAnalysisPage />} />
                  <Route path="/medical-analysis" element={<MedicalAnalysisPage />} />
                  <Route path="/biological-age" element={<BiologicalAgePage />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/articles" element={<AdminArticles />} />
                  <Route path="/admin/protocols" element={<AdminProtocols />} />
                  <Route path="/admin/specializations" element={<AdminSpecializations />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
                  <Route path="/admin/payments" element={<AdminPayments />} />
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
