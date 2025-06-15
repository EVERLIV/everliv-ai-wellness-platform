
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import SEO from '@/components/SEO';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <SEO 
        title="EVERLIV - Персонализированная медицина и долголетие с ИИ"
        description="Откройте путь к оптимальному здоровью с EVERLIV. Анализ биомаркеров, персонализированные протоколы, AI-врач и научно обоснованные рекомендации для долголетия."
        keywords="персонализированная медицина, долголетие, биохакинг, анализ крови, биомаркеры, ИИ врач, протоколы здоровья, превентивная медицина, антиэйджинг, оптимальное здоровье, EVERLIV"
        url="https://everliv.online/"
      />
      <LandingPage />
    </>
  );
};

export default Index;
