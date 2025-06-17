
import React from 'react';
import { isLovableDevelopment } from '@/utils/environmentDetection';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, User } from 'lucide-react';

const DevModeIndicator = () => {
  const { user } = useSmartAuth();
  const isLovableDev = isLovableDevelopment();

  if (!isLovableDev) {
    return null;
  }

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 bg-green-100 border-green-400 text-green-800 rounded-none">
      <Shield className="h-4 w-4" />
      <AlertDescription className="text-center flex items-center justify-center gap-2">
        🔧 Lovable Development Mode
        {user && (
          <>
            <User className="h-4 w-4" />
            <span className="font-medium">Dev Admin: {user.email}</span>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DevModeIndicator;
