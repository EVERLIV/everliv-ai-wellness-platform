import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prodLogger } from '@/utils/production-logger';
import { isDevelopmentMode } from '@/utils/devMode';
import { Eye, EyeOff, Download, Trash, RefreshCw } from 'lucide-react';

const ProductionDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState(prodLogger.getLogs());

  const refreshLogs = () => {
    setLogs(prodLogger.getLogs());
  };

  const downloadLogs = () => {
    const logsData = prodLogger.exportLogs();
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    prodLogger.clearLogs();
    setLogs([]);
  };

  // Показываем только если есть ошибки или в dev режиме
  const shouldShow = isDevelopmentMode() || prodLogger.getErrorLogs().length > 0;

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-background shadow-lg"
        >
          <Eye className="h-4 w-4 mr-2" />
          Debug
          {prodLogger.getErrorLogs().length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {prodLogger.getErrorLogs().length}
            </Badge>
          )}
        </Button>
      ) : (
        <Card className="w-96 max-h-96 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Debug Panel</CardTitle>
              <div className="flex gap-1">
                <Button
                  onClick={refreshLogs}
                  variant="ghost"
                  size="sm"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button
                  onClick={downloadLogs}
                  variant="ghost"
                  size="sm"
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  onClick={clearLogs}
                  variant="ghost"
                  size="sm"
                >
                  <Trash className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="ghost"
                  size="sm"
                >
                  <EyeOff className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            <div className="flex gap-2 text-xs">
              <Badge variant="outline">
                Mode: {isDevelopmentMode() ? 'Dev' : 'Prod'}
              </Badge>
              <Badge variant="outline">
                Total: {logs.length}
              </Badge>
              <Badge variant="destructive">
                Errors: {prodLogger.getErrorLogs().length}
              </Badge>
            </div>
            
            {logs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No logs available</p>
            ) : (
              <div className="space-y-1">
                {logs.slice(-10).reverse().map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-xs ${
                      log.level === 'error' 
                        ? 'bg-destructive/10 text-destructive' 
                        : log.level === 'warn'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {log.level}
                      </Badge>
                      <span className="text-xs opacity-70">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-1 font-mono">
                      {log.message}
                    </div>
                    {log.data && (
                      <pre className="mt-1 text-xs opacity-70 whitespace-pre-wrap">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionDebugPanel;