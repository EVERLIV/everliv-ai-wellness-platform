
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HealthProfileHeaderProps {
  currentSection: number;
  totalSections: number;
  currentSectionTitle: string;
  CurrentIcon: React.ComponentType<{ className?: string }>;
}

const HealthProfileHeader: React.FC<HealthProfileHeaderProps> = ({
  currentSection,
  totalSections,
  currentSectionTitle,
  CurrentIcon
}) => {
  const navigate = useNavigate();
  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="gap-2 px-2 sm:px-3"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">К дашборду</span>
              <span className="sm:hidden">Назад</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <CurrentIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Профиль здоровья
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  {currentSectionTitle}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span className="hidden sm:inline">Прогресс заполнения</span>
            <span className="sm:hidden">Прогресс</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Раздел {currentSection + 1} из {totalSections}</span>
            <span className="hidden sm:inline">{currentSectionTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileHeader;
