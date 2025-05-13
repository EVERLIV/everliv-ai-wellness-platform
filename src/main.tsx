
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import { Toaster } from '@/components/ui/sonner'
import { BrowserRouter } from 'react-router-dom'

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
