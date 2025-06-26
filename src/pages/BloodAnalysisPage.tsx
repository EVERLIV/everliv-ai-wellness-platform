
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BloodAnalysisForm from '@/components/blood-analysis/BloodAnalysisForm';
import EnhancedBloodAnalysisResults from '@/components/blood-analysis/EnhancedBloodAnalysisResults';
import BloodAnalysisEducation from '@/components/blood-analysis/BloodAnalysisEducation';
import { useBloodAnalysis } from '@/hooks/useBloodAnalysis';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube, BookOpen, Brain } from 'lucide-react';

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
      title="AI Анализ крови с расширенными возможностями"
      description="Загрузите результаты анализа или изучите образовательные материалы о показателях крови"
      breadcrumbItems={[{ title: "Анализ крови" }]}
    >
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Анализ результатов
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Образовательные материалы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {results ? (
            <EnhancedBloodAnalysisResults 
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
        </TabsContent>

        <TabsContent value="education">
          <BloodAnalysisEducation />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default BloodAnalysisPage;
