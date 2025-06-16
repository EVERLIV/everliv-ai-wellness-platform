
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings } from 'lucide-react';

const DevModeIndicator = () => {
  if (!isDevelopmentMode()) {
    return null;
  }

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-yellow-400 text-yellow-800 rounded-none">
      <Settings className="h-4 w-4" />
      <AlertDescription className="text-center">
        🔧 Режим разработки: Вы автоматически авторизованы как тестовый пользователь
      </AlertDescription>
    </Alert>
  );
};

export default DevModeIndicator;
