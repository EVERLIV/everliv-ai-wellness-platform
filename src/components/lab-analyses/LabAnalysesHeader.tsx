
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
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к панели
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Лабораторные анализы</h1>
            <p className="text-gray-600">Управление и анализ ваших медицинских результатов</p>
          </div>
        </div>
      </div>

      <Button 
        onClick={onAddNewAnalysis}
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
      >
        <Plus className="h-4 w-4" />
        Добавить анализ
      </Button>
    </div>
  );
};

export default LabAnalysesHeader;
