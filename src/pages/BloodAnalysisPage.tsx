
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BloodAnalysisForm from '@/components/blood-analysis/BloodAnalysisForm';
import BloodAnalysisResults from '@/components/blood-analysis/BloodAnalysisResults';

const BloodAnalysisPage = () => {
  const [results, setResults] = useState(null);
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
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">Анализ крови с AI</h1>
          <p className="text-lg text-gray-700 mb-8">
            Загрузите результаты вашего анализа крови для получения персонализированной расшифровки и рекомендаций
          </p>
          
          {results ? (
            <BloodAnalysisResults results={results} />
          ) : (
            <BloodAnalysisForm onAnalysisComplete={setResults} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BloodAnalysisPage;
