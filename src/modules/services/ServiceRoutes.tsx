
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

// Lazy load service components
const BloodAnalysisServicePage = lazy(() => import("@/pages/services/BloodAnalysisServicePage"));
const AIRecommendations = lazy(() => import("@/pages/services/AIRecommendations"));
const PersonalizedSupplements = lazy(() => import("@/pages/services/PersonalizedSupplements"));
const Fasting = lazy(() => import("@/pages/services/Fasting"));
const ColdTherapy = lazy(() => import("@/pages/services/ColdTherapy"));
const OxygenTherapy = lazy(() => import("@/pages/services/OxygenTherapy"));
const BreathingPractices = lazy(() => import("@/pages/services/BreathingPractices"));

const ServiceRoutes = () => {
  return (
    <Routes>
      <Route path="/blood-analysis" element={<BloodAnalysisServicePage />} />
      <Route path="/ai-recommendations" element={<AIRecommendations />} />
      <Route path="/supplements" element={<PersonalizedSupplements />} />
      <Route path="/fasting" element={<Fasting />} />
      <Route path="/cold-therapy" element={<ColdTherapy />} />
      <Route path="/oxygen-therapy" element={<OxygenTherapy />} />
      <Route path="/breathing" element={<BreathingPractices />} />
    </Routes>
  );
};

export default ServiceRoutes;
