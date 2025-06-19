
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
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

  const categorizedBiomarkers = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.category]) {
      acc[biomarker.category] = [];
    }
    acc[biomarker.category].push(biomarker);
    return acc;
  }, {} as Record<string, Biomarker[]>);

  return (
    <div className="space-y-6">
      {Object.entries(categorizedBiomarkers).map(([category, categoryBiomarkers]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">
              {getCategoryTitle(category)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryBiomarkers.map(biomarker => (
                <BiomarkerCard
                  key={biomarker.id}
                  biomarker={biomarker}
                  onValueChange={onValueChange}
                  healthProfile={healthProfile}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BiomarkerCategories;
