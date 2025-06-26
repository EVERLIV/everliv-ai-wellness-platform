
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';
import { useSmartAuth } from '@/hooks/useSmartAuth';

const DevModeIndicator = () => {
  const { user, signInWithMagicLink } = useSmartAuth();
  
  // Only show in development mode
  if (!isDevelopmentMode()) {
    return null;
  }

  const handleDevLogin = async () => {
    try {
      console.log('🔧 Dev admin login initiated');
      await signInWithMagicLink('admin@dev.local');
      console.log('🔧 Dev admin login completed');
    } catch (error) {
      console.error('Dev login failed:', error);
    }
  };

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 bg-blue-100 border-blue-400 text-blue-800 rounded-none">
      <Shield className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="flex items-center">
          🔧 Development Mode: Enhanced dev features enabled
          {user && (
            <span className="ml-2 font-medium">
              | Logged in as: {user.user_metadata?.nickname || user.email} (ID: {user.id?.slice(0, 8)}...)
            </span>
          )}
        </span>
        {!user && (
          <Button 
            onClick={handleDevLogin}
            size="sm" 
            variant="outline"
            className="ml-4 bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <User className="h-3 w-3 mr-1" />
            Quick Admin Login
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DevModeIndicator;
