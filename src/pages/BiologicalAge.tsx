
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import BiologicalAgeCalculator from '@/components/biological-age/BiologicalAgeCalculator';
import BiologicalAgeHeader from '@/components/biological-age/BiologicalAgeHeader';
import MinimalFooter from '@/components/MinimalFooter';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';

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

  const handleAddAnalysis = (category: string) => {
    console.log('Add analysis for category:', category);
  };

  return (
    <PageLayoutWithHeader
      headerComponent={
        <BiologicalAgeHeader onAddAnalysis={handleAddAnalysis} />
      }
    >
      <BiologicalAgeCalculator />
    </PageLayoutWithHeader>
  );
};

export default BiologicalAge;
