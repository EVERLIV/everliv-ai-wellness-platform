
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DetailedHealthRecommendations from "./DetailedHealthRecommendations";
import AnalyticsActions from "./AnalyticsActions";
import { CachedAnalytics } from "@/types/analytics";

interface AnalyticsContentProps {
  analytics: CachedAnalytics;
  onRefresh: () => void;
  isGenerating: boolean;
}

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
  analytics,
  onRefresh,
  isGenerating
}) => {
  const { user } = useAuth();
  const { healthProfile } = useHealthProfile();
  const [doctorQuestion, setDoctorQuestion] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  const handleDoctorQuestion = async () => {
    if (!doctorQuestion.trim()) return;
    
    setIsProcessingQuestion(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-doctor-analytics', {
        body: {
          question: doctorQuestion,
          healthData: analytics,
          userId: user?.id
        }
      });

      if (error) throw error;
      
      setDoctorResponse(data.response);
    } catch (error) {
      console.error('Error processing doctor question:', error);
      toast.error('Ошибка обработки вопроса');
    } finally {
      setIsProcessingQuestion(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <AnalyticsActions 
        onRefresh={onRefresh}
        isGenerating={isGenerating}
      />

      <DetailedHealthRecommendations
        analytics={analytics}
        healthProfile={healthProfile}
      />

      {/* AI Doctor Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">ИИ-Доктор: Задайте вопрос</h2>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Задайте вопрос о вашем здоровье..."
            value={doctorQuestion}
            onChange={(e) => setDoctorQuestion(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleDoctorQuestion()}
          />
          <button
            onClick={handleDoctorQuestion}
            disabled={isProcessingQuestion || !doctorQuestion.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingQuestion ? 'Обработка...' : 'Спросить'}
          </button>
        </div>

        {doctorResponse && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Ответ ИИ-Доктора:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{doctorResponse}</p>
          </div>
        )}
      </div>

      {analytics.lastUpdated && (
        <div className="text-center text-sm text-gray-500">
          Последнее обновление: {new Date(analytics.lastUpdated).toLocaleString('ru-RU')}
        </div>
      )}
    </div>
  );
};

export default AnalyticsContent;
