
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { AnalysisData } from "@/types/analysis";
import { processAnalysisData } from "@/utils/analysisUtils";
import AnalysisHeader from "@/components/analysis-details/AnalysisHeader";
import BiomarkersList from "@/components/analysis-details/BiomarkersList";

const AnalysisDetails: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AnalysisDetails component mounted, analysisId:', analysisId);
    if (user && analysisId) {
      loadAnalysisDetails();
    }
  }, [user, analysisId]);

  const loadAnalysisDetails = async () => {
    try {
      setIsLoading(true);
      console.log('Загружаем детали анализа для ID:', analysisId);
      
      const { data: analysis, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('id', analysisId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Ошибка загрузки анализа:', error);
        throw error;
      }

      if (analysis) {
        console.log('Загружен анализ:', analysis);
        const processedData = processAnalysisData(analysis);
        console.log('Обработанные данные:', processedData);
        setAnalysisData(processedData);
      }
    } catch (error) {
      console.error('Error loading analysis details:', error);
      toast.error('Ошибка загрузки данных анализа');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Для доступа к анализу необходимо войти в систему</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Загрузка данных анализа...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Анализ не найден</h2>
            <p className="text-gray-500">Запрашиваемый анализ не существует или недоступен</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering AnalysisDetails with data:', analysisData);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 print:bg-white">
      <Header />
      <div className="pt-16 print:pt-0">
        <AnalysisHeader
          analysisType={analysisData.analysisType}
          createdAt={analysisData.createdAt}
          biomarkersCount={analysisData.biomarkers.length}
          onPrint={handlePrint}
        />

        <div className="container mx-auto px-4 py-6 max-w-6xl print:py-4">
          <BiomarkersList biomarkers={analysisData.biomarkers} />

          {/* Дисклеймер для печати */}
          <div className="mt-8 print:mt-4 print:block hidden">
            <div className="text-xs text-gray-600 border-t pt-4">
              <p><strong>Важно:</strong> Данный анализ предоставлен только в информационных целях. 
              Обязательно проконсультируйтесь с квалифицированным врачом для получения 
              профессиональной медицинской консультации и назначения лечения.</p>
            </div>
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default AnalysisDetails;
