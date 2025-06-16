import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmartAuthProvider } from "@/contexts/SmartAuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import DevModeIndicator from "@/components/DevModeIndicator";
import ProtectedRoute from "./components/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AuthConfirm = lazy(() => import("./pages/AuthConfirm"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const WelcomePage = lazy(() => import("./pages/WelcomePage"));
const BloodAnalysisPage = lazy(() => import("./pages/BloodAnalysisPage"));
const ProtocolPage = lazy(() => import("./pages/ProtocolPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminLabsPage = lazy(() => import("./pages/admin/AdminLabsPage"));
const AdminLabOrdersPage = lazy(() => import("./pages/admin/AdminLabOrdersPage"));
const AdminLabAnalysisTypesPage = lazy(() => import("./pages/admin/AdminLabAnalysisTypesPage"));
const AdminLabAnalysesPage = lazy(() => import("./pages/admin/AdminLabAnalysesPage"));
const AdminLabAnalysisResultsPage = lazy(() => import("./pages/admin/AdminLabAnalysisResultsPage"));
const AdminLabOrdersNewPage = lazy(() => import("./pages/admin/AdminLabOrdersNewPage"));
const AdminLabAnalysesNewPage = lazy(() => import("./pages/admin/AdminLabAnalysesNewPage"));
const AdminLabAnalysisResultsNewPage = lazy(() => import("./pages/admin/AdminLabAnalysisResultsNewPage"));
const AdminProtocolsPage = lazy(() => import("./pages/admin/AdminProtocolsPage"));
const AdminProtocolsNewPage = lazy(() => import("./pages/admin/AdminProtocolsNewPage"));
const AdminArticlesPage = lazy(() => import("./pages/admin/AdminArticlesPage"));
const AdminArticlesNewPage = lazy(() => import("./pages/admin/AdminArticlesNewPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const UpdatePasswordPage = lazy(() => import("./pages/UpdatePasswordPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SmartAuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <DevModeIndicator />
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/update-password" element={<UpdatePasswordPage />} />
                <Route path="/auth-confirm" element={<AuthConfirm />} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
                <Route path="/blood-analysis" element={<ProtectedRoute><BloodAnalysisPage /></ProtectedRoute>} />
                <Route path="/protocol/:id" element={<ProtectedRoute><ProtocolPage /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />

                <Route path="/admin/labs" element={<ProtectedRoute><AdminLabsPage /></ProtectedRoute>} />
                <Route path="/admin/lab-orders" element={<ProtectedRoute><AdminLabOrdersPage /></ProtectedRoute>} />
                <Route path="/admin/lab-orders/new" element={<ProtectedRoute><AdminLabOrdersNewPage /></ProtectedRoute>} />

                <Route path="/admin/lab-analysis-types" element={<ProtectedRoute><AdminLabAnalysisTypesPage /></ProtectedRoute>} />

                <Route path="/admin/lab-analyses" element={<ProtectedRoute><AdminLabAnalysesPage /></ProtectedRoute>} />
                 <Route path="/admin/lab-analyses/new" element={<ProtectedRoute><AdminLabAnalysesNewPage /></ProtectedRoute>} />

                <Route path="/admin/lab-analysis-results" element={<ProtectedRoute><AdminLabAnalysisResultsPage /></ProtectedRoute>} />
                <Route path="/admin/lab-analysis-results/new" element={<ProtectedRoute><AdminLabAnalysisResultsNewPage /></ProtectedRoute>} />

                <Route path="/admin/protocols" element={<ProtectedRoute><AdminProtocolsPage /></ProtectedRoute>} />
                <Route path="/admin/protocols/new" element={<ProtectedRoute><AdminProtocolsNewPage /></ProtectedRoute>} />

                <Route path="/admin/articles" element={<ProtectedRoute><AdminArticlesPage /></ProtectedRoute>} />
                <Route path="/admin/articles/new" element={<ProtectedRoute><AdminArticlesNewPage /></ProtectedRoute>} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </SmartAuthProvider>
  </QueryClientProvider>
);

export default App;
