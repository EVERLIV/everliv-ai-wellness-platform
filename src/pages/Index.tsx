import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Home from './Home';
import SEO from '@/components/SEO';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [forceShowContent, setForceShowContent] = useState(false);

  // Принудительно показываем контент через 5 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('🚨 Index: принудительное завершение загрузки через 5 секунд');
        setForceShowContent(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading && !forceShowContent) {
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
