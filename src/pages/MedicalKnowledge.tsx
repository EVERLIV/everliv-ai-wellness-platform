
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import MedicalCategoryCard from '@/components/medical-knowledge/MedicalCategoryCard';
import MedicalArticleCard from '@/components/medical-knowledge/MedicalArticleCard';
import MedicalSpecializationCard from '@/components/medical-knowledge/MedicalSpecializationCard';
import MedicalKnowledgeSearch from '@/components/medical-knowledge/MedicalKnowledgeSearch';
import { useMedicalKnowledge } from '@/hooks/useMedicalKnowledge';
import { MedicalArticle } from '@/types/medical';
import { Loader2, BookOpen, Users, FileText, Heart } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Медицинская база знаний
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Проверенная медицинская информация о симптомах, заболеваниях, методах диагностики и лечения от ведущих специалистов
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{articles.length}</div>
                <div className="text-blue-100">Медицинских статей</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{categories.length}</div>
                <div className="text-blue-100">Медицинских категорий</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{specializations.length}</div>
                <div className="text-blue-100">Специализаций врачей</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              {isLoading || isSearching ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">
                      {isSearching ? 'Поиск статей...' : 'Загрузка медицинских статей...'}
                    </p>
                  </div>
                </div>
              ) : (
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
                        onClick={() => {
                          setHasSearched(false);
                          setSearchResults([]);
                          setSelectedCategory(null);
                        }}
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
                        onSelect={handleArticleSelect}
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
              )}
            </TabsContent>

            <TabsContent value="categories" className="space-y-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Загрузка категорий...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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

            <TabsContent value="doctors" className="space-y-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Загрузка информации о специалистах...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
      </div>
    </div>
  );
};

export default MedicalKnowledge;
