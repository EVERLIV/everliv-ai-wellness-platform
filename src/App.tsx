
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthConfirm from './pages/AuthConfirm';
import Welcome from './pages/Welcome';
import MedicalKnowledge from './pages/MedicalKnowledge';
import SubscriptionPage from './pages/SubscriptionPage';
import UserProfile from './pages/UserProfile';
import NutritionDiary from './pages/NutritionDiary';
import BloodAnalysisPage from './pages/BloodAnalysisPage';
import AnalysisDetails from './pages/AnalysisDetails';
import BiologicalAgePage from './pages/BiologicalAgePage';
import AIDoctorPage from './pages/AIDoctorPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBlog from './pages/AdminBlog';
import AdminOverview from './pages/admin/AdminOverview';
import AdminSettings from './pages/admin/AdminSettings';
import AdminPricing from './pages/admin/AdminPricing';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminContent from './pages/admin/AdminContent';
import AdminSecurity from './pages/admin/AdminSecurity';
import RealtimeNotifications from './components/realtime/RealtimeNotifications';
import ProtectedRoute from './components/ProtectedRoute';

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
          <BrowserRouter>
            <AuthProvider>
              <SubscriptionProvider>
                <Toaster />
                <RealtimeNotifications />
                <Routes>
                  {/* Публичные страницы - без ProtectedRoute */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/auth-confirm" element={<AuthConfirm />} />
                  <Route path="/welcome" element={<Welcome />} />
                  
                  {/* Приватные страницы пользователя - с ProtectedRoute */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-doctor" element={
                    <ProtectedRoute>
                      <AIDoctorPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/medical-knowledge" element={
                    <ProtectedRoute>
                      <MedicalKnowledge />
                    </ProtectedRoute>
                  } />
                  <Route path="/subscription" element={
                    <ProtectedRoute>
                      <SubscriptionPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/food-diary" element={
                    <ProtectedRoute>
                      <NutritionDiary />
                    </ProtectedRoute>
                  } />
                  <Route path="/blood-test-analysis" element={
                    <ProtectedRoute>
                      <BloodAnalysisPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/medical-analysis/:analysisId" element={
                    <ProtectedRoute>
                      <AnalysisDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/medical-analysis" element={
                    <ProtectedRoute>
                      <AnalysisDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/biological-age" element={
                    <ProtectedRoute>
                      <BiologicalAgePage />
                    </ProtectedRoute>
                  } />

                  {/* Админские страницы - с ProtectedRoute */}
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
                  <Route path="/admin/articles" element={
                    <ProtectedRoute>
                      <AdminBlog />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/protocols" element={
                    <ProtectedRoute>
                      <AdminOverview />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/specializations" element={
                    <ProtectedRoute>
                      <AdminSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute>
                      <AdminContent />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/subscriptions" element={
                    <ProtectedRoute>
                      <AdminPricing />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/payments" element={
                    <ProtectedRoute>
                      <AdminStatistics />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/security" element={
                    <ProtectedRoute>
                      <AdminSecurity />
                    </ProtectedRoute>
                  } />
                </Routes>
              </SubscriptionProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
