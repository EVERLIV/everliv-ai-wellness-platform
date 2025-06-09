
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import AIDoctorConsultation from "@/components/dashboard/AIDoctorConsultation";

const AIDoctorGeneralPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Минималистичный заголовок */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/ai-doctor")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Общий ИИ-Доктор</h1>
              </div>
            </div>

            <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
              Бесплатно
            </Badge>
          </div>

          {/* Chat Interface */}
          <div className="h-[600px] flex flex-col">
            <AIDoctorConsultation />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIDoctorGeneralPage;
