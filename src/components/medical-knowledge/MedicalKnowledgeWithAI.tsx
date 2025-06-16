
import React, { useState } from 'react';
import { Brain, BookOpen, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MedicalKnowledgeSearch from './MedicalKnowledgeSearch';
import ArticlesTab from './ArticlesTab';
import CategoriesTab from './CategoriesTab';
import SpecializationsTab from './SpecializationsTab';
import SemanticSearch from './SemanticSearch';
import { useMedicalKnowledge } from '@/hooks/useMedicalKnowledge';

const MedicalKnowledgeWithAI: React.FC = () => {
  const {
    categories,
    articles,
    specializations,
    isLoading,
    searchArticles
  } = useMedicalKnowledge();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [displayedArticles, setDisplayedArticles] = useState(articles);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const handleSearch = async (query: string, category?: string) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchArticles(query, category);
      setDisplayedArticles(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setDisplayedArticles(articles);
    setHasSearched(false);
  };

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticle(articleId);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Заголовок с AI акцентом */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Brain className="h-8 w-8 text-blue-600" />
            Медицинская база знаний с AI поиском
          </CardTitle>
          <p className="text-gray-600">
            Исследуйте медицинские статьи с помощью традиционного и семантического поиска на базе искусственного интеллекта
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="semantic-search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="semantic-search" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Поиск
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Статьи
          </TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="specialists">Специалисты</TabsTrigger>
        </TabsList>

        <TabsContent value="semantic-search">
          <SemanticSearch onArticleSelect={handleArticleSelect} />
        </TabsContent>

        <TabsContent value="articles">
          <div className="space-y-6">
            <MedicalKnowledgeSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
            
            <ArticlesTab
              isLoading={isLoading}
              isSearching={isSearching}
              hasSearched={hasSearched}
              displayedArticles={displayedArticles}
              onResetSearch={handleResetSearch}
              onArticleSelect={handleArticleSelect}
            />
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab 
            categories={categories}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="specialists">
          <SpecializationsTab 
            specializations={specializations}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalKnowledgeWithAI;
