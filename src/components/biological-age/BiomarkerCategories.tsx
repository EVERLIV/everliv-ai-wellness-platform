
import React from 'react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { getBiomarkerImpact } from '@/services/ai/biomarker-impact-analysis';
import BiomarkerCard from './BiomarkerCard';
import CategoryAnalysisUpload from './CategoryAnalysisUpload';

interface BiomarkerCategoriesProps {
  biomarkers: Biomarker[];
  onValueChange: (biomarkerId: string, value: number) => void;
  healthProfile: HealthProfileData;
}

const BiomarkerCategories: React.FC<BiomarkerCategoriesProps> = ({
  biomarkers,
  onValueChange,
  healthProfile
}) => {
  const getCategoryTitle = (category: string) => {
    const titles = {
      'cardiovascular': 'Сердечно-сосудистая система',
      'metabolic': 'Метаболические маркеры',
      'hormonal': 'Гормональная система',
      'inflammatory': 'Воспалительные маркеры',
      'oxidative_stress': 'Окислительный стресс',
      'kidney_function': 'Почечная функция',
      'liver_function': 'Печеночная функция',
      'telomeres_epigenetics': 'Теломеры и эпигенетика'
    };
    return titles[category as keyof typeof titles] || category;
  };

  const categorizedBiomarkers = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.category]) {
      acc[biomarker.category] = [];
    }
    acc[biomarker.category].push(biomarker);
    return acc;
  }, {} as Record<string, Biomarker[]>);

  const handleAnalysisComplete = (category: string, biomarkerData: any[]) => {
    // Обработка результатов ИИ анализа
    biomarkerData.forEach(marker => {
      const biomarker = biomarkers.find(b => 
        b.name.toLowerCase().includes(marker.name.toLowerCase()) ||
        marker.name.toLowerCase().includes(b.name.toLowerCase())
      );
      
      if (biomarker && marker.value) {
        const numericValue = parseFloat(marker.value.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        if (!isNaN(numericValue)) {
          onValueChange(biomarker.id, numericValue);
        }
      }
    });
  };

  const getImpactDot = (impact: string) => {
    switch (impact) {
      case 'high': return <div className="w-2 h-2 rounded-full bg-red-500 md:hidden" />;
      case 'medium': return <div className="w-2 h-2 rounded-full bg-yellow-500 md:hidden" />;
      case 'low': return <div className="w-2 h-2 rounded-full bg-green-500 md:hidden" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-400 md:hidden" />;
    }
  };

  const getCategoryFilledCount = (categoryBiomarkers: Biomarker[]) => {
    return categoryBiomarkers.filter(b => b.value !== undefined && b.value !== null).length;
  };

  return (
    <div className="space-y-2">
      {Object.entries(categorizedBiomarkers).map(([category, categoryBiomarkers]) => (
        <div key={category} className="border border-gray-200 bg-white">
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium">
                {getCategoryTitle(category)}
              </h3>
              <CategoryAnalysisUpload
                category={category}
                categoryTitle={getCategoryTitle(category)}
                onAnalysisComplete={(data) => handleAnalysisComplete(category, data)}
              />
            </div>
            
            {/* Расшифровка влияния - только на мобильных */}
            {getCategoryFilledCount(categoryBiomarkers) > 0 && (
              <div className="md:hidden mt-2 text-[8px] text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Высокое влияние на биологический возраст</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Среднее влияние на биологический возраст</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Низкое влияние на биологический возраст</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categoryBiomarkers.map(biomarker => (
                <BiomarkerCard
                  key={biomarker.id}
                  biomarker={biomarker}
                  onValueChange={onValueChange}
                  healthProfile={healthProfile}
                  showAddButton={false}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BiomarkerCategories;
