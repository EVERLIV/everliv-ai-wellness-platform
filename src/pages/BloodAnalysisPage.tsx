
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BloodAnalysisForm from '@/components/blood-analysis/BloodAnalysisForm';
import BloodAnalysisResults from '@/components/blood-analysis/BloodAnalysisResults';
import { useBloodAnalysis } from '@/hooks/useBloodAnalysis';
import PageLayout from '@/components/PageLayout';

const BloodAnalysisPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    results,
    isAnalyzing,
    activeTab,
    apiError,
    setActiveTab,
    analyzeBloodTest
  } = useBloodAnalysis();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <PageLayout 
      title="Анализ крови с AI"
      description="Загрузите результаты вашего анализа крови для получения персонализированной расшифровки и рекомендаций"
      breadcrumbItems={[{ title: "Анализ крови" }]}
    >
      {results ? (
        <BloodAnalysisResults 
          results={results} 
          isAnalyzing={isAnalyzing} 
          apiError={apiError}
          onBack={() => setActiveTab("input")} 
        />
      ) : (
        <BloodAnalysisForm 
          isAnalyzing={isAnalyzing}
          onAnalyze={analyzeBloodTest}
        />
      )}
    </PageLayout>
  );
};

export default BloodAnalysisPage;
