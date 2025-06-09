
import React from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AnalyticsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад
      </Button>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Результаты анализа</h1>
          <p className="text-gray-600">Анализ крови</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
