
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import AIDoctorConsultation from "@/components/dashboard/AIDoctorConsultation";

const AIDoctorGeneralPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Компактный заголовок страницы */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Общий ИИ-Доктор</h1>
                <p className="text-sm text-gray-600">
                  Базовые медицинские консультации
                </p>
              </div>
            </div>

            <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
              Бесплатно
            </Badge>
          </div>

          {/* Status Alert */}
          <Alert className="mb-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              <div>
                <p className="font-medium text-blue-800 mb-1">Общий ИИ-помощник по здоровью</p>
                <p className="text-blue-700 text-xs">
                  Получайте базовые рекомендации по здоровью и общую медицинскую информацию
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Chat Interface */}
          <div className="space-y-4">
            {/* Компактный заголовок чата */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/ai-doctor")}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Назад
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">ИИ Помощник</h2>
                  <p className="text-sm text-gray-600">
                    Базовые консультации
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="h-[600px] flex flex-col">
              <AIDoctorConsultation />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIDoctorGeneralPage;
