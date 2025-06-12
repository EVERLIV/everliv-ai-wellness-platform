
import React from 'react';
import { Button } from '@/components/ui/button';
import MedicalArticleCard from './MedicalArticleCard';
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
  if (isLoading || isSearching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            {isSearching ? 'Поиск статей...' : 'Загрузка медицинских статей...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {hasSearched && (
        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Результаты поиска
            </h3>
            <p className="text-gray-600">
              Найдено {displayedArticles.length} статей по вашему запросу
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onResetSearch}
            className="bg-white"
          >
            Показать все статьи
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {displayedArticles.map((article) => (
          <MedicalArticleCard
            key={article.id}
            article={article}
            onSelect={onArticleSelect}
          />
        ))}
      </div>

      {displayedArticles.length === 0 && hasSearched && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Статьи не найдены
            </h3>
            <p className="text-gray-500">
              По вашему запросу ничего не найдено. Попробуйте изменить условия поиска.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticlesTab;
