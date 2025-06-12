
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import MedicalArticleCard from './MedicalArticleCard';
import MedicalArticleDetail from './MedicalArticleDetail';
import { MedicalArticle } from '@/types/medical';
import { Loader2, FileText } from 'lucide-react';

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

  const handleArticleSelect = (articleId: string) => {
    const article = displayedArticles.find(a => a.id === articleId);
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

  // Иначе показываем список статей
  if (isLoading || isSearching) {
    return (
      <div className="flex items-center justify-center py-12 md:py-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base md:text-lg text-gray-600">
            {isSearching ? 'Поиск статей...' : 'Загрузка медицинских статей...'}
          </p>
        </div>
      </div>
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
              Найдено {displayedArticles.length} статей по вашему запросу
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {displayedArticles.map((article) => (
          <MedicalArticleCard
            key={article.id}
            article={article}
            onSelect={handleArticleSelect}
          />
        ))}
      </div>

      {displayedArticles.length === 0 && hasSearched && (
        <div className="text-center py-12 md:py-20">
          <div className="max-w-md mx-auto px-4">
            <FileText className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
              Статьи не найдены
            </h3>
            <p className="text-sm md:text-base text-gray-500">
              По вашему запросу ничего не найдено. Попробуйте изменить условия поиска.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticlesTab;
