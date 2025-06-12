
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, FileText, Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MedicalKnowledgeHeaderProps {
  articlesCount: number;
  categoriesCount: number;
  specializationsCount: number;
}

const MedicalKnowledgeHeader: React.FC<MedicalKnowledgeHeaderProps> = ({
  articlesCount,
  categoriesCount,
  specializationsCount
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1 hover:bg-gray-100 px-2 text-sm"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Назад</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  База знаний
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  {articlesCount} статей • {categoriesCount} категорий • {specializationsCount} специализаций
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile stats */}
        <div className="mt-3 grid grid-cols-3 gap-2 sm:hidden">
          <div className="bg-white rounded-md p-2 text-center shadow-sm">
            <FileText className="h-3 w-3 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-900">{articlesCount}</div>
            <div className="text-xs text-gray-600">Статей</div>
          </div>
          <div className="bg-white rounded-md p-2 text-center shadow-sm">
            <Heart className="h-3 w-3 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-900">{categoriesCount}</div>
            <div className="text-xs text-gray-600">Категорий</div>
          </div>
          <div className="bg-white rounded-md p-2 text-center shadow-sm">
            <Users className="h-3 w-3 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-900">{specializationsCount}</div>
            <div className="text-xs text-gray-600">Специалистов</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalKnowledgeHeader;
