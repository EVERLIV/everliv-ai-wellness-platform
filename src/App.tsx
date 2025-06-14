import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MedicalKnowledge from './pages/MedicalKnowledge';
import MedicalArticleDetailPage from './pages/MedicalArticleDetailPage';
import MoscowClinics from './pages/MoscowClinics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medical-knowledge" element={<MedicalKnowledge />} />
        <Route path="/medical-knowledge/article/:articleId" element={<MedicalArticleDetailPage />} />
        <Route path="/moscow-clinics" element={<MoscowClinics />} />
      </Routes>
    </Router>
  );
}

export default App;
