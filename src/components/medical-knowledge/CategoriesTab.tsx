
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

  // Строгая фильтрация уникальных категорий
  const uniqueCategories = categories.reduce((acc, current) => {
    const existingIndex = acc.findIndex(item => item.id === current.id);
    if (existingIndex === -1) {
      acc.push(current);
    }
    return acc;
  }, [] as MedicalCategory[]);

  console.log('Categories rendered:', uniqueCategories.length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {uniqueCategories.map((category) => (
        <MedicalCategoryCard
          key={`cat-${category.id}`}
          category={category}
          articleCount={getArticleCountByCategory(category.id)}
          onSelect={onCategorySelect}
        />
      ))}
    </div>
  );
};

export default CategoriesTab;
