import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import ECGSynthesisWorkspace from '@/components/diagnostics/ECGSynthesisWorkspace';

const DiagnosticsPage: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route index element={<ECGSynthesisWorkspace />} />
        <Route path="*" element={<ECGSynthesisWorkspace />} />
      </Routes>
    </AppLayout>
  );
};

export default DiagnosticsPage;