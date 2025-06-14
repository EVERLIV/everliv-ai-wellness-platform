
import React from 'react';
import MedicalCategoryCard from './MedicalCategoryCard';
import LoadingState from './LoadingState';
import { MedicalCategory } from '@/types/medical';

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
      <LoadingState 
        message="Загрузка категорий..."
        size="md"
      />
    );
  }

  // Дополнительная фильтрация уникальных категорий на уровне компонента
  const uniqueCategories = categories.filter((category, index, self) => 
    index === self.findIndex(c => c.id === category.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {uniqueCategories.map((category) => (
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
