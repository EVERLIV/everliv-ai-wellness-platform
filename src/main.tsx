
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import PerformanceProvider from './components/performance/PerformanceProvider'
import { prodLogger } from './utils/production-logger'

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Initialize production logging
prodLogger.info('Application starting', {
  environment: import.meta.env.MODE,
  userAgent: navigator.userAgent,
  url: window.location.href
});

try {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <PerformanceProvider>
        <App />
      </PerformanceProvider>
    </HelmetProvider>
  );
  
  prodLogger.info('Application rendered successfully');
} catch (error) {
  prodLogger.error('Failed to render application', {}, error as Error);
  throw error;
}
