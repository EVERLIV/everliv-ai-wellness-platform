
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const NoHealthProfileAlert: React.FC = () => {
  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Сначала заполните профиль здоровья для использования калькулятора биологического возраста.
      </AlertDescription>
    </Alert>
  );
};

export default NoHealthProfileAlert;
