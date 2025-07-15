
import React from 'react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
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

  return (
    <div className="space-y-3">
      {Object.entries(categorizedBiomarkers).map(([category, categoryBiomarkers]) => (
        <div key={category} className="border border-gray-200 bg-white">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {getCategoryTitle(category)}
              </h3>
              <CategoryAnalysisUpload
                category={category}
                categoryTitle={getCategoryTitle(category)}
                onAnalysisComplete={(data) => handleAnalysisComplete(category, data)}
              />
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
