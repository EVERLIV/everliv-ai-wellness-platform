
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const DevModeIndicator = () => {
  if (!isDevelopmentMode()) {
    return null;
  }

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 bg-red-100 border-red-400 text-red-800 rounded-none">
      <Shield className="h-4 w-4" />
      <AlertDescription className="text-center">
        🔒 Development Mode: Enhanced security enabled - Authentication required
      </AlertDescription>
    </Alert>
  );
};

export default DevModeIndicator;
