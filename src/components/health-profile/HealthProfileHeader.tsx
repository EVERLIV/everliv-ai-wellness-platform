
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CurrentIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Профиль здоровья
              </h1>
              <p className="text-gray-600">
                {currentSectionTitle}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            К дашборду
          </Button>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Прогресс заполнения</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Раздел {currentSection + 1} из {totalSections}</span>
            <span>{currentSectionTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileHeader;
