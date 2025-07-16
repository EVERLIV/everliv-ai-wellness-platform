
import React from 'react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { getBiomarkerImpact } from '@/services/ai/biomarker-impact-analysis';
import BiomarkerCard from './BiomarkerCard';

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

  const getCategoryColor = (category: string) => {
    const colors = {
      'cardiovascular': 'border-l-red-500',
      'metabolic': 'border-l-blue-500',
      'hormonal': 'border-l-purple-500',
      'inflammatory': 'border-l-orange-500',
      'oxidative_stress': 'border-l-yellow-500',
      'kidney_function': 'border-l-green-500',
      'liver_function': 'border-l-teal-500',
      'telomeres_epigenetics': 'border-l-pink-500'
    };
    return colors[category as keyof typeof colors] || 'border-l-gray-400';
  };

  const categorizedBiomarkers = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.category]) {
      acc[biomarker.category] = [];
    }
    acc[biomarker.category].push(biomarker);
    return acc;
  }, {} as Record<string, Biomarker[]>);

  const getTotalFilledCount = () => {
    return biomarkers.filter(b => b.value !== undefined && b.value !== null).length;
  };

  return (
    <div className="space-y-2">
      {Object.entries(categorizedBiomarkers).map(([category, categoryBiomarkers]) => (
        <div key={category} className="border border-gray-200 bg-white">{/* Убираем border-l-4 и цветовой индикатор */}
          <div className="p-2 border-b border-gray-200">
            <h3 className="bio-text-small font-medium">
              {getCategoryTitle(category)}
            </h3>
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
      
      {/* Единая расшифровка цветовых индикаторов */}
      {getTotalFilledCount() > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200">
          <h4 className="bio-text-small font-medium mb-2">Обозначения:</h4>
          <div className="bio-text-caption space-y-2">
            {/* Влияние на биологический возраст */}
            <div>
              <div className="bio-text-caption font-medium mb-1">Влияние на биологический возраст:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Высокое влияние</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Среднее влияние</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Низкое влияние</span>
                </div>
              </div>
            </div>
            
            {/* Статус показателей */}
            <div>
              <div className="bio-text-caption font-medium mb-1">Фон карточки - статус показателя:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-green-50 border border-green-200 rounded"></div>
                  <span>В норме</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-red-50 border border-red-200 rounded"></div>
                  <span>Выше нормы</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                  <span>Ниже нормы</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiomarkerCategories;
