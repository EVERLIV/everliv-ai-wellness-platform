
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages with correct paths
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import BloodAnalysisPage from './pages/BloodAnalysisPage';
import BloodAnalysisServicePage from "./pages/services/BloodAnalysisServicePage";
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Partnership from './pages/Partnership';
import Analytics from './pages/Analytics';
import LabAnalyses from './pages/LabAnalyses';

// Import pages that exist in our read-only files list
import Science from './pages/Science';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';

// Import partnership subpages
import MedicalInstitutions from './pages/partnerships/MedicalInstitutions';
import CorporateClients from './pages/partnerships/CorporateClients';
import MedicalSpecialists from './pages/partnerships/MedicalSpecialists';

// Import service pages
import ColdTherapy from './pages/services/ColdTherapy';
import Fasting from './pages/services/Fasting';
import BreathingPractices from './pages/services/BreathingPractices';
import OxygenTherapy from './pages/services/OxygenTherapy';
import AIRecommendations from './pages/services/AIRecommendations';
import PersonalizedSupplements from './pages/services/PersonalizedSupplements';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/science" element={<Science />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/partnership" element={<Partnership />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/lab-analyses" element={
        <ProtectedRoute>
          <LabAnalyses />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      
      {/* Partnership subpages */}
      <Route path="/partnerships/medical-institutions" element={<MedicalInstitutions />} />
      <Route path="/partnerships/corporate-clients" element={<CorporateClients />} />
      <Route path="/partnerships/medical-specialists" element={<MedicalSpecialists />} />
      
      <Route path="/blood-analysis" element={<BloodAnalysisPage />} />
      <Route path="/services/cold-therapy" element={<ColdTherapy />} />
      <Route path="/services/fasting" element={<Fasting />} />
      <Route path="/services/breathing-practices" element={<BreathingPractices />} />
      <Route path="/services/oxygen-therapy" element={<OxygenTherapy />} />
      <Route path="/services/ai-recommendations" element={<AIRecommendations />} />
      <Route path="/services/personalized-supplements" element={<PersonalizedSupplements />} />
      <Route path="/services/blood-analysis" element={<BloodAnalysisServicePage />} />
    </Routes>
  );
}

export default App;
