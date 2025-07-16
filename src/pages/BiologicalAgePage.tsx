
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import BiologicalAgeCalculator from '@/components/biological-age/BiologicalAgeCalculator';

const BiologicalAgePage = () => {
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
      <div className="space-y-3">
        <div className="mb-3">
          <h1 className="bio-heading-primary mb-1">
            Определение биологического возраста
          </h1>
          <p className="bio-text-body">
            Узнайте свой биологический возраст на основе комплексной оценки биомаркеров и показателей здоровья
          </p>
        </div>
        
        <BiologicalAgeCalculator />
      </div>
    </AppLayout>
  );
};

export default BiologicalAgePage;
