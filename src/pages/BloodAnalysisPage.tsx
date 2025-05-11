
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BloodAnalysisForm from '@/components/blood-analysis/BloodAnalysisForm';
import BloodAnalysisResults from '@/components/blood-analysis/BloodAnalysisResults';
import { useBloodAnalysis } from '@/hooks/useBloodAnalysis';

const BloodAnalysisPage = () => {
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAnalysisComplete = (analysisResults: any) => {
    setResults(analysisResults);
    setIsAnalyzing(false);
  };
  
  const handleBack = () => {
    setResults(null);
  };

  const handleAnalyze = (data: { text: string, photoUrl: string, inputMethod: "text" | "photo" }) => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      handleAnalysisComplete({
        markers: [
          {
            name: 'Гемоглобин',
            value: '140 г/л',
            normalRange: '130-160 г/л',
            status: 'normal',
            recommendation: 'В норме, особых рекомендаций нет'
          },
          {
            name: 'Лейкоциты',
            value: '10.5 тыс/мкл',
            normalRange: '4.0-9.0 тыс/мкл',
            status: 'high',
            recommendation: 'Повышены, рекомендуется консультация врача'
          }
        ],
        supplements: [
          {
            name: 'Витамин C',
            reason: 'Поддержка иммунной системы',
            dosage: '500-1000 мг в день'
          }
        ],
        generalRecommendation: 'Рекомендуется повторить анализ через 1 месяц для контроля показателей.'
      });
    }, 2000);
  };

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
            <BloodAnalysisResults 
              results={results} 
              isAnalyzing={isAnalyzing} 
              onBack={handleBack} 
            />
          ) : (
            <BloodAnalysisForm 
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BloodAnalysisPage;
