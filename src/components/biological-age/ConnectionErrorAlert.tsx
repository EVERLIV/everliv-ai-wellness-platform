
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi } from 'lucide-react';

interface ConnectionErrorAlertProps {
  error: string;
  onRetry: () => void;
}

const ConnectionErrorAlert: React.FC<ConnectionErrorAlertProps> = ({ error, onRetry }) => {
  return (
    <Alert className="border-red-200 bg-red-50">
      <WifiOff className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Ошибка подключения:</strong> {error}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="ml-4"
        >
          <Wifi className="h-4 w-4 mr-2" />
          Повторить
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionErrorAlert;
