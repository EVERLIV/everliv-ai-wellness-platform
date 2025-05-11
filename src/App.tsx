import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import LandingPage from "./pages/LandingPage";
import ServicesPage from "./pages/ServicesPage";
import BloodAnalysisPage from "./pages/BloodAnalysisPage";
import BiologicalAgePage from "./pages/BiologicalAgePage";
import ComprehensiveAnalysisPage from "./pages/ComprehensiveAnalysisPage";
import ColdTherapy from "./pages/services/ColdTherapy";
import SubscriptionPage from "./pages/SubscriptionPage";
import MyProtocols from "./pages/MyProtocols";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? children : null;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/blood-analysis",
    element: (
      <ProtectedRoute>
        <BloodAnalysisPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/biological-age",
    element: (
      <ProtectedRoute>
        <BiologicalAgePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/comprehensive-analysis",
    element: (
      <ProtectedRoute>
        <ComprehensiveAnalysisPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/services/cold-therapy",
    element: <ColdTherapy />,
  },
  {
    path: "/dashboard/subscription",
    element: (
      <ProtectedRoute>
        <SubscriptionPage />
      </ProtectedRoute>
    ),
  },
  
  {
    path: "/my-protocols",
    element: (
      <ProtectedRoute>
        <MyProtocols />
      </ProtectedRoute>
    ),
  },
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
