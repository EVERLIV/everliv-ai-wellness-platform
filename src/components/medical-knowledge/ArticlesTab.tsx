
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import MedicalArticleCard from './MedicalArticleCard';
import MedicalArticleDetail from './MedicalArticleDetail';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import { MedicalArticle } from '@/types/medical';
import { FileText } from 'lucide-react';

interface ArticlesTabProps {
  isLoading: boolean;
  isSearching: boolean;
  hasSearched: boolean;
  displayedArticles: MedicalArticle[];
  onResetSearch: () => void;
  onArticleSelect: (articleId: string) => void;
}

const ArticlesTab: React.FC<ArticlesTabProps> = ({
  isLoading,
  isSearching,
  hasSearched,
  displayedArticles,
  onResetSearch,
  onArticleSelect
}) => {
  const [selectedArticle, setSelectedArticle] = useState<MedicalArticle | null>(null);

  // Фильтрация уникальных статей
  const uniqueArticles = displayedArticles.filter((article, index, self) => 
    index === self.findIndex(a => a.id === article.id)
  );

  const handleArticleSelect = (articleId: string) => {
    const article = uniqueArticles.find(a => a.id === articleId);
    if (article) {
      setSelectedArticle(article);
      onArticleSelect(articleId);
    }
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  // Если выбрана статья, показываем детальный вид
  if (selectedArticle) {
    return (
      <MedicalArticleDetail 
        article={selectedArticle} 
        onBack={handleBackToList}
      />
    );
  }

  // Состояния загрузки
  if (isLoading || isSearching) {
    return (
      <LoadingState 
        message={isSearching ? 'Поиск статей...' : 'Загрузка медицинских статей...'}
        size="md"
      />
    );
  }

  return (
    <>
      {hasSearched && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-50 rounded-lg p-4 md:p-6 gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
              Результаты поиска
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Найдено {uniqueArticles.length} статей по вашему запросу
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onResetSearch}
            className="bg-white w-full sm:w-auto"
            size="sm"
          >
            Показать все статьи
          </Button>
        </div>
      )}
      
      {uniqueArticles.length === 0 && hasSearched ? (
        <EmptyState
          icon={FileText}
          title="Статьи не найдены"
          description="По вашему запросу ничего не найдено. Попробуйте изменить условия поиска."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {uniqueArticles.map((article) => (
            <MedicalArticleCard
              key={article.id}
              article={article}
              onSelect={handleArticleSelect}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ArticlesTab;
