
import React from 'react';
import MedicalCategoryCard from './MedicalCategoryCard';
import { MedicalCategory } from '@/types/medical';
import { Loader2 } from 'lucide-react';

interface CategoriesTabProps {
  isLoading: boolean;
  categories: MedicalCategory[];
  getArticleCountByCategory: (categoryId: string) => number;
  onCategorySelect: (categoryId: string) => void;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  isLoading,
  categories,
  getArticleCountByCategory,
  onCategorySelect
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 md:py-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base md:text-lg text-gray-600">Загрузка категорий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {categories.map((category) => (
        <MedicalCategoryCard
          key={category.id}
          category={category}
          articleCount={getArticleCountByCategory(category.id)}
          onSelect={onCategorySelect}
        />
      ))}
    </div>
  );
};

export default CategoriesTab;
