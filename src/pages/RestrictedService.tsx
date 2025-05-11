
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RestrictedServicePlaceholder from '@/components/RestrictedServicePlaceholder';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const serviceInfo: Record<string, { name: string; description: string }> = {
  'breathing': {
    name: 'Дыхательные практики',
    description: 'Улучшите свое здоровье с помощью научно обоснованных дыхательных техник.'
  },
  'nutrition': {
    name: 'Питание и нутрициология',
    description: 'Персонализированные рекомендации по питанию на основе ваших биомаркеров.'
  },
  'sleep': {
    name: 'Оптимизация сна',
    description: 'Научные подходы к улучшению качества сна и восстановления.'
  },
  'longevity': {
    name: 'Протоколы долголетия',
    description: 'Индивидуальные протоколы для замедления процессов старения.'
  }
};

const RestrictedService = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { user } = useAuth();
  
  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  const service = serviceId && serviceInfo[serviceId] 
    ? serviceInfo[serviceId] 
    : { name: 'Сервис EVERLIV', description: undefined };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <RestrictedServicePlaceholder 
        serviceName={service.name}
        description={service.description}
      />
      <Footer />
    </div>
  );
};

export default RestrictedService;
