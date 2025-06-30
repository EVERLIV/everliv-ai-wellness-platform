
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

interface ConnectionErrorAlertProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

const ConnectionErrorAlert: React.FC<ConnectionErrorAlertProps> = ({ 
  error, 
  onRetry,
  isRetrying = false 
}) => {
  const isNetworkError = error.toLowerCase().includes('network') || 
                        error.toLowerCase().includes('connection') ||
                        error.toLowerCase().includes('fetch');

  return (
    <Alert className="border-red-200 bg-red-50">
      <WifiOff className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>Ошибка подключения:</strong> 
          <div className="mt-1 text-sm">
            {isNetworkError 
              ? 'Проверьте подключение к интернету и попробуйте еще раз'
              : error
            }
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          disabled={isRetrying}
          className="ml-4 flex-shrink-0"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Повтор...
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 mr-2" />
              Повторить
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionErrorAlert;
