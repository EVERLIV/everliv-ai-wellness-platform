
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
    <div className="bg-background border-l-4 border-l-red-500">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <WifiOff className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-medium text-red-700 mb-1">Ошибка соединения</div>
            <div className="text-xs text-red-600">
              {isNetworkError 
                ? 'Проверьте подключение к интернету'
                : error
              }
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            disabled={isRetrying}
            className="h-6 px-2 text-xs"
          >
            {isRetrying ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Wifi className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionErrorAlert;
