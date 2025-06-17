
import React from 'react';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { Navigate } from 'react-router-dom';
import Home from './Home';
import SEO from '@/components/SEO';

const Index = () => {
  const { user, isLoading } = useSmartAuth();

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
      <Home />
    </>
  );
};

export default Index;
