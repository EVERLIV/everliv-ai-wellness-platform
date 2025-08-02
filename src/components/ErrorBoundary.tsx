import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Download, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prodLogger } from '@/utils/production-logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Save error info to state
    this.setState({ errorInfo });
    
    // Log to production logger
    prodLogger.error('React Error Boundary', {
      component: errorInfo.componentStack,
      error: error.message,
      stack: error.stack
    }, error);
  }

  private handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null, 
      showDetails: false 
    });
  };

  private downloadLogs = () => {
    const logs = prodLogger.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  private clearCache = () => {
    // Clear all cache and storage
    localStorage.clear();
    sessionStorage.clear();
    prodLogger.clearLogs();
    
    // Clear service worker cache if available
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Force reload
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-destructive">Произошла ошибка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Что-то пошло не так. Попробуйте обновить страницу или обратитесь в поддержку.
              </p>
              
              {this.state.error && (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                    className="w-full"
                  >
                    {this.state.showDetails ? 'Скрыть детали' : 'Показать детали ошибки'}
                  </Button>
                  
                  {this.state.showDetails && (
                    <div className="p-3 bg-muted rounded text-xs text-muted-foreground space-y-2">
                      <div>
                        <strong>Ошибка:</strong> {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong>Стек:</strong>
                          <pre className="whitespace-pre-wrap mt-1 text-xs">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo && (
                        <div>
                          <strong>Компонент:</strong>
                          <pre className="whitespace-pre-wrap mt-1 text-xs">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={this.handleRetry}
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Повторить
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  size="sm"
                >
                  Обновить страницу
                </Button>
                <Button
                  variant="outline"
                  onClick={this.downloadLogs}
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Скачать логи
                </Button>
                <Button
                  variant="destructive"
                  onClick={this.clearCache}
                  size="sm"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Очистить кеш
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;