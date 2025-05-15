
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Import pages with correct paths
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import BloodAnalysisPage from './pages/BloodAnalysisPage';
import BloodAnalysisServicePage from "./pages/services/BloodAnalysisServicePage";

// Import pages that exist in our read-only files list
import Science from './pages/Science';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Import service pages
import ColdTherapy from './pages/services/ColdTherapy';
import Fasting from './pages/services/Fasting';
import BreathingPractices from './pages/services/BreathingPractices';
import OxygenTherapy from './pages/services/OxygenTherapy';
import AIRecommendations from './pages/services/AIRecommendations';
import PersonalizedSupplements from './pages/services/PersonalizedSupplements';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/science" element={<Science />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blood-analysis" element={<BloodAnalysisPage />} />
            <Route path="/services/cold-therapy" element={<ColdTherapy />} />
            <Route path="/services/fasting" element={<Fasting />} />
            <Route path="/services/breathing-practices" element={<BreathingPractices />} />
            <Route path="/services/oxygen-therapy" element={<OxygenTherapy />} />
            <Route path="/services/ai-recommendations" element={<AIRecommendations />} />
            <Route path="/services/personalized-supplements" element={<PersonalizedSupplements />} />
            <Route path="/services/blood-analysis" element={<BloodAnalysisServicePage />} />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
