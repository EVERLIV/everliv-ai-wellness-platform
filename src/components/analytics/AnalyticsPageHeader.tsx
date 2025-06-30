
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnalyticsPageHeaderProps {
  healthScore: number;
  riskLevel: string;
}

const AnalyticsPageHeader: React.FC<AnalyticsPageHeaderProps> = ({
  healthScore,
  riskLevel
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
      <div className="analytics-container py-4 sm:py-6">  
        <div className="mobile-flex-header">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="mobile-touch-target flex items-center gap-2 hover:bg-gray-100 px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline mobile-text-body">Назад к панели</span>
              <span className="sm:hidden mobile-text-body">Назад</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="mobile-heading-secondary sm:mobile-heading-primary font-bold text-gray-900">
                  Аналитика здоровья
                </h1>
                <p className="mobile-text-small text-gray-600 hidden sm:block">
                  Персональная оценка и рекомендации
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageHeader;
