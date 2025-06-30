
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const NetworkStatusIndicator: React.FC = () => {
  const { isOnline, connectionQuality } = useNetworkStatus();

  if (isOnline && connectionQuality === 'good') {
    return null; // Не показываем индикатор при хорошем соединении
  }

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        title: 'Нет подключения к интернету',
        description: 'Проверьте соединение с интернетом и попробуйте еще раз.',
        className: 'border-red-200 bg-red-50'
      };
    }
    
    if (connectionQuality === 'poor') {
      return {
        icon: AlertTriangle,
        title: 'Слабое подключение',
        description: 'Медленное соединение может повлиять на работу приложения.',
        className: 'border-yellow-200 bg-yellow-50'
      };
    }
    
    return {
      icon: Wifi,
      title: 'Восстановлено подключение',
      description: 'Соединение с интернетом восстановлено.',
      className: 'border-green-200 bg-green-50'
    };
  };

  const { icon: Icon, title, description, className } = getStatusConfig();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className={className}>
        <Icon className="h-4 w-4" />
        <AlertDescription>
          <div>
            <strong>{title}</strong>
            <div className="text-sm mt-1">{description}</div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NetworkStatusIndicator;
