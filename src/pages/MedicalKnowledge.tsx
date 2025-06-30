import React, { useState } from "react";
import { useMedicalKnowledge } from "@/hooks/useMedicalKnowledge";
import MedicalKnowledgeHeader from "@/components/medical-knowledge/MedicalKnowledgeHeader";
import MedicalKnowledgeSearch from "@/components/medical-knowledge/MedicalKnowledgeSearch";
import CategoriesTab from "@/components/medical-knowledge/CategoriesTab";
import ArticlesTab from "@/components/medical-knowledge/ArticlesTab";
import SpecializationsTab from "@/components/medical-knowledge/SpecializationsTab";
import LoadingState from "@/components/medical-knowledge/LoadingState";
import EmptyState from "@/components/medical-knowledge/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";

const MedicalKnowledge = () => {
  const { categories, articles, specializations, isLoading, error } = useMedicalKnowledge();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <PageLayoutWithHeader>
        <div className="container mx-auto px-4 py-8">
          <EmptyState 
            title="Ошибка загрузки"
            description={error}
          />
        </div>
      </PageLayoutWithHeader>
    );
  }

  return (
    <PageLayoutWithHeader>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <MedicalKnowledgeHeader />
        <MedicalKnowledgeSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="articles">Статьи</TabsTrigger>
            <TabsTrigger value="specializations">Специализации</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-6">
            <CategoriesTab categories={filteredCategories} />
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <ArticlesTab 
              articles={filteredArticles} 
              categories={categories}
            />
          </TabsContent>

          <TabsContent value="specializations" className="mt-6">
            <SpecializationsTab specializations={filteredSpecializations} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayoutWithHeader>
  );
};

export default MedicalKnowledge;
