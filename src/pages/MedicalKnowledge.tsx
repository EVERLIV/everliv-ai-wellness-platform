
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import MedicalKnowledgeSearch from '@/components/medical-knowledge/MedicalKnowledgeSearch';
import MedicalKnowledgeHeader from '@/components/medical-knowledge/MedicalKnowledgeHeader';
import ArticlesTab from '@/components/medical-knowledge/ArticlesTab';
import CategoriesTab from '@/components/medical-knowledge/CategoriesTab';
import SpecializationsTab from '@/components/medical-knowledge/SpecializationsTab';
import { useMedicalKnowledge } from '@/hooks/useMedicalKnowledge';
import { MedicalArticle } from '@/types/medical';
import { useIsMobile } from '@/hooks/use-mobile';

const MedicalKnowledge: React.FC = () => {
  const { categories, articles, specializations, isLoading, searchArticles } = useMedicalKnowledge();
  const [searchResults, setSearchResults] = useState<MedicalArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const isMobile = useIsMobile();

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
    const categoryArticles = articles.filter(article => article.category_id === categoryId);
    setSearchResults(categoryArticles);
    setHasSearched(true);
  };

  const handleArticleSelect = (articleId: string) => {
    console.log('Selected article:', articleId);
  };

  const handleResetSearch = () => {
    setHasSearched(false);
    setSearchResults([]);
  };

  const getArticleCountByCategory = (categoryId: string) => {
    return articles.filter(article => article.category_id === categoryId).length;
  };

  const displayedArticles = hasSearched ? searchResults : articles;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <MedicalKnowledgeHeader
          articlesCount={articles.length}
          categoriesCount={categories.length}
          specializationsCount={specializations.length}
        />

        <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
          <div className="space-y-4">
            <MedicalKnowledgeSearch
              categories={categories}
              onSearch={handleSearch}
              isLoading={isSearching}
            />

            <Tabs defaultValue="articles" className="w-full">
              <TabsList className={`grid w-full grid-cols-3 mb-4 h-auto ${isMobile ? 'text-xs' : ''}`}>
                <TabsTrigger value="articles" className="text-sm py-2">
                  {isMobile ? 'Статьи' : 'Статьи'}
                </TabsTrigger>
                <TabsTrigger value="categories" className="text-sm py-2">
                  {isMobile ? 'Категории' : 'Категории'}
                </TabsTrigger>
                <TabsTrigger value="doctors" className="text-sm py-2">
                  {isMobile ? 'Врачи' : 'Специалисты'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="space-y-4">
                <ArticlesTab
                  isLoading={isLoading}
                  isSearching={isSearching}
                  hasSearched={hasSearched}
                  displayedArticles={displayedArticles}
                  onResetSearch={handleResetSearch}
                  onArticleSelect={handleArticleSelect}
                />
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <CategoriesTab
                  isLoading={isLoading}
                  categories={categories}
                  getArticleCountByCategory={getArticleCountByCategory}
                  onCategorySelect={handleCategorySelect}
                />
              </TabsContent>

              <TabsContent value="doctors" className="space-y-4">
                <SpecializationsTab
                  isLoading={isLoading}
                  specializations={specializations}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default MedicalKnowledge;
