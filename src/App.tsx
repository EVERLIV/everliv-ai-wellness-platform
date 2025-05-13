
import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/LandingPage';
import Pricing from '@/pages/Pricing';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import UserProfile from '@/pages/UserProfile';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtocolDetailPage from '@/pages/ProtocolTracking';
import MyProtocolsPage from '@/pages/MyProtocols';
import AddProtocolPage from '@/pages/ProtocolTracking';
import BloodAnalysisPage from '@/pages/BloodAnalysisPage';
import AIRecommendationsPage from '@/pages/AI';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminUserDetail from '@/pages/admin/AdminStatistics';
import AdminProtocols from '@/pages/admin/AdminPricing';
import AdminPricing from '@/pages/admin/AdminPricing';
import ProtocolPage from '@/pages/ProtocolTracking';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BlogPage from '@/pages/Blog';
import BlogPostPage from '@/pages/Blog';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import AboutPage from '@/pages/About';
import ContactPage from '@/pages/Contact';
import FeaturesPage from '@/pages/Features';
import NotFoundPage from '@/pages/NotFound';
import UserSubscription from '@/pages/UserSubscription';
import Checkout from '@/pages/Checkout';

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Check Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
          console.error('Supabase connection error:', error);
          setIsConnected(false);
          toast({
            title: 'Ошибка соединения с базой данных',
            description: 'Не удалось подключиться к Supabase',
            variant: 'destructive'
          });
        } else {
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Supabase connection check failed:', err);
        setIsConnected(false);
        toast({
          title: 'Ошибка соединения с базой данных',
          description: 'Пожалуйста, проверьте подключение к интернету',
          variant: 'destructive'
        });
      }
    };

    checkConnection();
  }, []);

  if (isConnected === null) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-everliv-600 mb-4" />
        <p className="text-lg font-medium">Загрузка приложения...</p>
        <p className="text-gray-500 mt-2">Проверка подключения к базе данных</p>
      </div>
    );
  }

  if (isConnected === false) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-700 mb-2">Ошибка соединения с базой данных</h1>
        <p className="text-gray-600 max-w-md mb-6">
          Не удалось подключиться к Supabase. Пожалуйста, проверьте подключение к интернету или
          повторите попытку позже.
        </p>
        <button
          className="px-4 py-2 bg-everliv-600 text-white rounded-md hover:bg-everliv-700 transition"
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </button>
      </div>
    );
  }

  return (
    // Removed the BrowserRouter component that was here before
    <>
      <Routes>
        {/* Публичные страницы */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        
        {/* Защищенные страницы */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
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
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/protocols" 
          element={
            <ProtectedRoute>
              <ProtocolPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-protocols" 
          element={
            <ProtectedRoute>
              <MyProtocolsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/protocols/:id" 
          element={
            <ProtectedRoute>
              <ProtocolDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/protocols/add" 
          element={
            <ProtectedRoute>
              <AddProtocolPage />
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
          path="/recommendations" 
          element={
            <ProtectedRoute>
              <AIRecommendationsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Страницы администратора */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminRequired={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute adminRequired={true}>
              <AdminUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users/:id" 
          element={
            <ProtectedRoute adminRequired={true}>
              <AdminUserDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/protocols" 
          element={
            <ProtectedRoute adminRequired={true}>
              <AdminProtocols />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/pricing" 
          element={
            <ProtectedRoute adminRequired={true}>
              <AdminPricing />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 страница */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
