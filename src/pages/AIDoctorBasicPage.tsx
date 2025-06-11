
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AIDoctorConsultation from "@/components/dashboard/AIDoctorConsultation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

const AIDoctorBasicPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/ai-doctor")}
                  className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Назад к выбору</span>
                  <span className="sm:hidden">Назад</span>
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      Базовый ИИ-Доктор EVERLIV
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Общие медицинские рекомендации и консультации
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Alert - только на мобильных */}
        {isMobile && (
          <div className="p-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                Базовый ИИ-доктор предоставляет общие медицинские рекомендации. 
                История переписки не сохраняется.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Chat Interface - занимает всё доступное пространство */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="container mx-auto px-4 py-4 max-w-4xl flex-1 flex flex-col">
            <div className="flex-1 min-h-0">
              <AIDoctorConsultation />
            </div>
            
            {/* Information Section - только на десктопе */}
            {!isMobile && (
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Важная информация</h3>
                <p className="text-blue-800 text-sm">
                  Базовый ИИ-доктор предоставляет общие медицинские рекомендации и не сохраняет историю переписки. 
                  Для персонализированных консультаций с доступом к истории анализов рассмотрите возможность 
                  обновления до премиум подписки.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!isMobile && <MinimalFooter />}
    </div>
  );
};

export default AIDoctorBasicPage;
