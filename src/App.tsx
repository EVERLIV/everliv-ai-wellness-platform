import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MedicalKnowledge from './pages/MedicalKnowledge';
import MedicalArticleDetail from './components/medical-knowledge/MedicalArticleDetail';
import MoscowClinics from './pages/MoscowClinics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/medical-knowledge" element={<MedicalKnowledge />} />
        <Route path="/medical-knowledge/article/:articleId" element={<MedicalArticleDetail />} />
        <Route path="/moscow-clinics" element={<MoscowClinics />} />
      </Routes>
    </Router>
  );
}

export default App;
