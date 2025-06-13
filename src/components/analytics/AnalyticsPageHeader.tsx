
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Brain, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AnalyticsPageHeaderProps {
  healthScore?: number;
  riskLevel?: string;
}

const AnalyticsPageHeader: React.FC<AnalyticsPageHeaderProps> = ({
  healthScore = 0,
  riskLevel = "unknown"
}) => {
  const navigate = useNavigate();

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'высокий':
        return 'text-red-600 bg-red-50';
      case 'средний':
        return 'text-yellow-600 bg-yellow-50';
      case 'низкий':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'высокий':
        return 'Высокий риск';
      case 'средний':
        return 'Средний риск';
      case 'низкий':
        return 'Низкий риск';
      default:
        return 'Оценка здоровья';
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Назад к панели</span>
              <span className="sm:hidden">Назад</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-xl flex items-center justify-center shadow-sm">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Аналитика Здоровья
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Персональные insights и рекомендации на основе ваших данных
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Общий балл</p>
                <p className="text-gray-900 font-semibold text-lg">{healthScore}/100</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Уровень риска</p>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${getRiskLevelColor(riskLevel)}`}>
                  {getRiskLevelText(riskLevel)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Рекомендации</p>
                <p className="text-gray-900 font-semibold">Персональные</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageHeader;
