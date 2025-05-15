
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import SciencePage from './pages/SciencePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import BloodAnalysisPage from './pages/BloodAnalysisPage';
import ColdTherapyPage from './pages/services/ColdTherapyPage';
import FastingPage from './pages/services/FastingPage';
import BreathingPracticesPage from './pages/services/BreathingPracticesPage';
import OxygenTherapyPage from './pages/services/OxygenTherapyPage';
import AiRecommendationsPage from './pages/services/AiRecommendationsPage';
import PersonalizedSupplements from './pages/services/PersonalizedSupplements';
import AuthProvider from './contexts/AuthContext';
import SubscriptionProvider from './contexts/SubscriptionContext';
import PartnerClinicsPage from './pages/services/PartnerClinicsPage';

// Add the import for our new page
import BloodAnalysisServicePage from "./pages/services/BloodAnalysisServicePage";

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/science" element={<SciencePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/blood-analysis" element={<BloodAnalysisPage />} />
            <Route path="/services/cold-therapy" element={<ColdTherapyPage />} />
            <Route path="/services/fasting" element={<FastingPage />} />
            <Route path="/services/breathing-practices" element={<BreathingPracticesPage />} />
            <Route path="/services/oxygen-therapy" element={<OxygenTherapyPage />} />
            <Route path="/services/ai-recommendations" element={<AiRecommendationsPage />} />
            <Route path="/services/personalized-supplements" element={<PersonalizedSupplements />} />
            <Route path="/services/partner-clinics" element={<PartnerClinicsPage />} />
            <Route path="/services/blood-analysis" element={<BloodAnalysisServicePage />} />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
