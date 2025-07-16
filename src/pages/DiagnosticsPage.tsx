import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DiagnosticsLayout from '@/components/diagnostics/DiagnosticsLayout';
import DiagnosticsDashboard from '@/components/diagnostics/DiagnosticsDashboard';
import ECGAnalysisPage from '@/components/diagnostics/ECGAnalysisPage';
import FileUploadPage from '@/components/diagnostics/FileUploadPage';
import DiagnosticsHistory from '@/components/diagnostics/DiagnosticsHistory';
import SessionDetailsPage from '@/components/diagnostics/SessionDetailsPage';
import SmartRecommendations from '@/components/diagnostics/SmartRecommendations';
import MedicalStandards from '@/components/diagnostics/MedicalStandards';

const DiagnosticsPage: React.FC = () => {
  return (
    <DiagnosticsLayout>
      <Routes>
        <Route index element={<DiagnosticsDashboard />} />
        <Route path="ecg" element={<ECGAnalysisPage />} />
        <Route path="upload" element={<FileUploadPage />} />
        <Route path="history" element={<DiagnosticsHistory />} />
        <Route path="session/:sessionId" element={<SessionDetailsPage />} />
        <Route path="recommendations" element={<SmartRecommendations />} />
        <Route path="standards" element={<MedicalStandards />} />
      </Routes>
    </DiagnosticsLayout>
  );
};

export default DiagnosticsPage;