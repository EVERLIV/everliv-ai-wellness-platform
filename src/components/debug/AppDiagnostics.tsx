import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AppDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    reactLoaded: false,
    domReady: false,
    serviceWorkerRegistered: false,
    supabaseConnected: false,
    authInitialized: false,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    // Проверка загрузки React
    setDiagnostics(prev => ({
      ...prev,
      reactLoaded: typeof React !== 'undefined',
      domReady: document.readyState === 'complete',
    }));

    // Проверка Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        setDiagnostics(prev => ({
          ...prev,
          serviceWorkerRegistered: registrations.length > 0,
        }));
      });
    }

    // Проверка Supabase
    try {
      const supabaseCheck = localStorage.getItem('sb-dajowxmdmnsvckdkugmd-auth-token');
      setDiagnostics(prev => ({
        ...prev,
        supabaseConnected: !!supabaseCheck,
      }));
    } catch (error) {
      console.error('Supabase check failed:', error);
    }

    console.log('🔍 App Diagnostics initialized:', diagnostics);
  }, []);

  const clearAllCaches = async () => {
    try {
      // Очистка localStorage
      localStorage.clear();
      
      // Очистка sessionStorage
      sessionStorage.clear();
      
      // Очистка cache API
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }
      
      console.log('✅ All caches cleared');
      alert('Кеш очищен! Страница будет перезагружена.');
      window.location.reload();
    } catch (error) {
      console.error('❌ Failed to clear caches:', error);
      alert('Ошибка при очистке кеша');
    }
  };

  const forceReload = () => {
    window.location.href = window.location.href + '?t=' + Date.now();
  };

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">🔧 Диагностика приложения</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs space-y-1">
          <div>React: {diagnostics.reactLoaded ? '✅' : '❌'}</div>
          <div>DOM: {diagnostics.domReady ? '✅' : '❌'}</div>
          <div>SW: {diagnostics.serviceWorkerRegistered ? '✅' : '❌'}</div>
          <div>Supabase: {diagnostics.supabaseConnected ? '✅' : '❌'}</div>
          <div className="text-xs text-muted-foreground">
            {diagnostics.timestamp}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={clearAllCaches}>
            Очистить кеш
          </Button>
          <Button size="sm" variant="outline" onClick={forceReload}>
            Перезагрузить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppDiagnostics;