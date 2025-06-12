
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/PageLayout';
import MedicalCategoryCard from '@/components/medical-knowledge/MedicalCategoryCard';
import MedicalArticleCard from '@/components/medical-knowledge/MedicalArticleCard';
import MedicalSpecializationCard from '@/components/medical-knowledge/MedicalSpecializationCard';
import MedicalKnowledgeSearch from '@/components/medical-knowledge/MedicalKnowledgeSearch';
import { useMedicalKnowledge } from '@/hooks/useMedicalKnowledge';
import { MedicalArticle } from '@/types/medical';
import { Loader2 } from 'lucide-react';

const MedicalKnowledge: React.FC = () => {
  const { categories, articles, specializations, isLoading, searchArticles } = useMedicalKnowledge();
  const [searchResults, setSearchResults] = useState<MedicalArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = async (query: string, categoryId?: string) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchArticles(query, categoryId);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryArticles = articles.filter(article => article.category_id === categoryId);
    setSearchResults(categoryArticles);
    setHasSearched(true);
  };

  const handleArticleSelect = (articleId: string) => {
    // TODO: Navigate to article detail page
    console.log('Selected article:', articleId);
  };

  const getArticleCountByCategory = (categoryId: string) => {
    return articles.filter(article => article.category_id === categoryId).length;
  };

  const displayedArticles = hasSearched ? searchResults : articles;

  return (
    <PageLayout
      title="Медицинская база знаний"
      description="Информация о симптомах, заболеваниях, методах лечения и специалистах"
      breadcrumbItems={[
        { title: 'Главная', href: '/' },
        { title: 'Медицинская база знаний' }
      ]}
    >
      <div className="space-y-6">
        <MedicalKnowledgeSearch
          categories={categories}
          onSearch={handleSearch}
          isLoading={isSearching}
        />

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">Статьи</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="doctors">Специалисты</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {isLoading || isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">
                  {isSearching ? 'Поиск...' : 'Загрузка статей...'}
                </span>
              </div>
            ) : (
              <>
                {hasSearched && (
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Результаты поиска ({displayedArticles.length})
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setHasSearched(false);
                        setSearchResults([]);
                        setSelectedCategory(null);
                      }}
                    >
                      Показать все статьи
                    </Button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedArticles.map((article) => (
                    <MedicalArticleCard
                      key={article.id}
                      article={article}
                      onSelect={handleArticleSelect}
                    />
                  ))}
                </div>

                {displayedArticles.length === 0 && hasSearched && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">По вашему запросу ничего не найдено</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Загрузка категорий...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <MedicalCategoryCard
                    key={category.id}
                    category={category}
                    articleCount={getArticleCountByCategory(category.id)}
                    onSelect={handleCategorySelect}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="doctors" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Загрузка информации о специалистах...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specializations.map((specialization) => (
                  <MedicalSpecializationCard
                    key={specialization.id}
                    specialization={specialization}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default MedicalKnowledge;
