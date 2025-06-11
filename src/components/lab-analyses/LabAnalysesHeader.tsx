
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LabAnalysesHeaderProps {
  onAddNewAnalysis: () => void;
}

const LabAnalysesHeader: React.FC<LabAnalysesHeaderProps> = ({
  onAddNewAnalysis,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-b border-gray-200">
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Лабораторные анализы
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Управление и анализ ваших медицинских результатов
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={onAddNewAnalysis}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:hidden">Добавить</span>
            <span className="hidden sm:inline">Добавить анализ</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LabAnalysesHeader;
