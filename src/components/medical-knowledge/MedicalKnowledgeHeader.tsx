
import React from 'react';
import { BookOpen, FileText, Heart, Users } from 'lucide-react';

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
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Медицинская база знаний
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Проверенная медицинская информация о симптомах, заболеваниях, методах диагностики и лечения от ведущих специалистов
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{articlesCount}</div>
              <div className="text-blue-100">Медицинских статей</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{categoriesCount}</div>
              <div className="text-blue-100">Медицинских категорий</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{specializationsCount}</div>
              <div className="text-blue-100">Специализаций врачей</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalKnowledgeHeader;
