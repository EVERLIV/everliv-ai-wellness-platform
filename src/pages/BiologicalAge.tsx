
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import BiologicalAgeCalculator from '@/components/biological-age/BiologicalAgeCalculator';

const BiologicalAge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-3 py-2 sm:py-3 max-w-5xl space-y-4">
        <div className="mb-4">
          <h1 className="text-xl font-semibold mb-2 text-gray-900">
            Определение биологического возраста
          </h1>
          <p className="text-sm text-gray-600">
            Узнайте свой биологический возраст на основе комплексной оценки биомаркеров
          </p>
        </div>
        
        <BiologicalAgeCalculator />
      </div>
    </AppLayout>
  );
};

export default BiologicalAge;
