import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ECGSynthesisWorkspace from '@/components/diagnostics/ECGSynthesisWorkspace';

const DiagnosticsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ECGSynthesisWorkspace />} />
      <Route path="*" element={<ECGSynthesisWorkspace />} />
    </Routes>
  );
};

export default DiagnosticsPage;