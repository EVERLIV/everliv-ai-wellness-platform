
import React, { useState } from "react";
import { useMedicalKnowledge } from "@/hooks/useMedicalKnowledge";
import MedicalKnowledgeHeader from "@/components/medical-knowledge/MedicalKnowledgeHeader";
import MedicalKnowledgeSearch from "@/components/medical-knowledge/MedicalKnowledgeSearch";
import CategoriesTab from "@/components/medical-knowledge/CategoriesTab";
import ArticlesTab from "@/components/medical-knowledge/ArticlesTab";
import SpecializationsTab from "@/components/medical-knowledge/SpecializationsTab";
import BiomarkersTab from "@/components/medical-knowledge/BiomarkersTab";
import LoadingState from "@/components/medical-knowledge/LoadingState";
import EmptyState from "@/components/medical-knowledge/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import { FileText, AlertCircle } from "lucide-react";

const MedicalKnowledge = () => {
  const { categories, articles, specializations, isLoading, error } = useMedicalKnowledge();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string, categoryId?: string) => {
    setSearchQuery(query);
    setSelectedCategory(categoryId || null);
    setHasSearched(true);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setHasSearched(false);
  };

  const filteredArticles = articles.filter(article => {
    const searchMatch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const categoryMatch = selectedCategory ? article.category_id === selectedCategory : true;
    return searchMatch && categoryMatch;
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpecializations = specializations.filter(specialization =>
    specialization.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getArticleCountByCategory = (categoryId: string) => {
    return articles.filter(article => article.category_id === categoryId).length;
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setHasSearched(true);
  };

  const handleArticleSelect = (articleId: string) => {
    console.log('Article selected:', articleId);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <PageLayoutWithHeader 
        headerComponent={
          <MedicalKnowledgeHeader 
            articlesCount={0}
            categoriesCount={0}
            specializationsCount={0}
          />
        }
      >
        <div className="container mx-auto px-4 py-8">
          <EmptyState 
            icon={AlertCircle}
            title="Ошибка загрузки"
            description={error}
          />
        </div>
      </PageLayoutWithHeader>
    );
  }

  return (
    <PageLayoutWithHeader 
      headerComponent={
        <MedicalKnowledgeHeader 
          articlesCount={articles.length}
          categoriesCount={categories.length}
          specializationsCount={specializations.length}
        />
      }
    >
      <div className="space-y-6">
        <MedicalKnowledgeSearch 
          categories={categories}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <Tabs defaultValue="biomarkers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="biomarkers">Биомаркеры</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="articles">Статьи</TabsTrigger>
            <TabsTrigger value="specializations">Специализации</TabsTrigger>
          </TabsList>

          <TabsContent value="biomarkers" className="mt-6">
            <BiomarkersTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <CategoriesTab 
              isLoading={isLoading}
              categories={filteredCategories}
              getArticleCountByCategory={getArticleCountByCategory}
              onCategorySelect={handleCategorySelect}
            />
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <ArticlesTab 
              isLoading={isLoading}
              isSearching={false}
              hasSearched={hasSearched}
              displayedArticles={filteredArticles}
              onResetSearch={handleResetSearch}
              onArticleSelect={handleArticleSelect}
            />
          </TabsContent>

          <TabsContent value="specializations" className="mt-6">
            <SpecializationsTab 
              isLoading={isLoading}
              specializations={filteredSpecializations}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayoutWithHeader>
  );
};

export default MedicalKnowledge;
