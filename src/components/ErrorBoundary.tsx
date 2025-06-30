
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Проверяем, является ли это сетевой ошибкой
    const isNetworkError = error.message?.includes('fetch') ||
                          error.message?.includes('network') ||
                          error.message?.includes('connection');
    
    if (isNetworkError) {
      toast.error('Проблемы с подключением. Проверьте соединение с интернетом.');
    } else {
      toast.error('Произошла ошибка. Пожалуйста, обновите страницу.');
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900">
              Что-то пошло не так
            </h2>
            
            <p className="text-gray-600">
              {this.state.error?.message?.includes('fetch') || 
               this.state.error?.message?.includes('network') 
                ? 'Проблемы с подключением к серверу. Проверьте соединение с интернетом.'
                : 'Произошла непредвиденная ошибка при загрузке страницы.'
              }
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button onClick={this.handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Попробовать снова
              </Button>
              
              <Button onClick={this.handleReload}>
                Обновить страницу
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Детали ошибки (только для разработки)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
