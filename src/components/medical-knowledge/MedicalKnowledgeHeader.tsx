
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
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Медицинская база знаний
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  {articlesCount} статей • {categoriesCount} категорий • {specializationsCount} специализаций
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <FileText className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">{articlesCount}</div>
            <div className="text-xs text-gray-600">Статей</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <Heart className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">{categoriesCount}</div>
            <div className="text-xs text-gray-600">Категорий</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <Users className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">{specializationsCount}</div>
            <div className="text-xs text-gray-600">Специалистов</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalKnowledgeHeader;
