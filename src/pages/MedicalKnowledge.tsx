
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalKnowledgeSearch from '@/components/medical-knowledge/MedicalKnowledgeSearch';
import MedicalKnowledgeHeader from '@/components/medical-knowledge/MedicalKnowledgeHeader';
import ArticlesTab from '@/components/medical-knowledge/ArticlesTab';
import CategoriesTab from '@/components/medical-knowledge/CategoriesTab';
import SpecializationsTab from '@/components/medical-knowledge/SpecializationsTab';
import { useMedicalKnowledge } from '@/hooks/useMedicalKnowledge';
import { MedicalArticle } from '@/types/medical';

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

  const handleResetSearch = () => {
    setHasSearched(false);
    setSearchResults([]);
    setSelectedCategory(null);
  };

  const getArticleCountByCategory = (categoryId: string) => {
    return articles.filter(article => article.category_id === categoryId).length;
  };

  const displayedArticles = hasSearched ? searchResults : articles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <MedicalKnowledgeHeader
        articlesCount={articles.length}
        categoriesCount={categories.length}
        specializationsCount={specializations.length}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <MedicalKnowledgeSearch
            categories={categories}
            onSearch={handleSearch}
            isLoading={isSearching}
          />

          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="articles" className="text-base">Статьи</TabsTrigger>
              <TabsTrigger value="categories" className="text-base">Категории</TabsTrigger>
              <TabsTrigger value="doctors" className="text-base">Специалисты</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-8">
              <ArticlesTab
                isLoading={isLoading}
                isSearching={isSearching}
                hasSearched={hasSearched}
                displayedArticles={displayedArticles}
                onResetSearch={handleResetSearch}
                onArticleSelect={handleArticleSelect}
              />
            </TabsContent>

            <TabsContent value="categories" className="space-y-8">
              <CategoriesTab
                isLoading={isLoading}
                categories={categories}
                getArticleCountByCategory={getArticleCountByCategory}
                onCategorySelect={handleCategorySelect}
              />
            </TabsContent>

            <TabsContent value="doctors" className="space-y-8">
              <SpecializationsTab
                isLoading={isLoading}
                specializations={specializations}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MedicalKnowledge;
