
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BiologicalAgeCalculator from '@/components/biological-age/BiologicalAgeCalculator';

const BiologicalAgePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Определение биологического возраста</h1>
              <p className="text-lg text-gray-700">
                Узнайте свой биологический возраст на основе комплексной оценки биомаркеров и показателей здоровья
              </p>
            </div>
            
            <BiologicalAgeCalculator />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BiologicalAgePage;
