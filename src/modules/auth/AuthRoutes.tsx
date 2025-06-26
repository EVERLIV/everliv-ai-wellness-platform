
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

// Lazy load auth components
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const RegistrationPage = lazy(() => import("@/pages/RegistrationPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const MagicLinkLoginPage = lazy(() => import("@/pages/MagicLinkLoginPage"));
const AuthConfirm = lazy(() => import("@/pages/AuthConfirm"));
const Welcome = lazy(() => import("@/pages/Welcome"));

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/magic-link" element={<MagicLinkLoginPage />} />
      <Route path="/auth/confirm" element={<AuthConfirm />} />
      <Route path="/welcome" element={<Welcome />} />
    </Routes>
  );
};

export default AuthRoutes;
