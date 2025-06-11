
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface AnalyticsHeaderProps {
  healthScore: number;
  riskLevel: string;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  healthScore,
  riskLevel
}) => {
  const navigate = useNavigate();

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'низкий':
        return 'bg-green-100 text-green-800';
      case 'средний':
        return 'bg-yellow-100 text-yellow-800';
      case 'высокий':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Аналитика здоровья
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Персональная оценка и рекомендации
                </p>
              </div>
            </div>
          </div>

          {healthScore > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Балл здоровья:</span>
                <Badge variant="secondary" className="font-semibold">
                  {healthScore}/100
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Риск:</span>
                <Badge className={getRiskLevelColor(riskLevel)}>
                  {riskLevel}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
