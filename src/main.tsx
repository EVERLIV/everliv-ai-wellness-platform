
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <SubscriptionProvider>
        <App />
        <Toaster />
      </SubscriptionProvider>
    </AuthProvider>
  </BrowserRouter>
);
