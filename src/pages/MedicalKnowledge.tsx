
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
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import { FileText, AlertCircle, FlaskConical, FolderOpen, Users, TestTube } from "lucide-react";

const MedicalKnowledge = () => {
  const { categories, articles, specializations, isLoading, error } = useMedicalKnowledge();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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

  // Данные для табов
  const tabs = [
    {
      id: 'biomarkers',
      label: 'Биомаркеры',
      icon: <FlaskConical className="h-5 w-5" />,
      content: <BiomarkersTab searchQuery={searchQuery} />
    },
    {
      id: 'categories',
      label: 'Категории',
      icon: <FolderOpen className="h-5 w-5" />,
      content: (
        <CategoriesTab 
          isLoading={isLoading}
          categories={filteredCategories}
          getArticleCountByCategory={getArticleCountByCategory}
          onCategorySelect={handleCategorySelect}
        />
      )
    },
    {
      id: 'articles',
      label: 'Статьи',
      icon: <FileText className="h-5 w-5" />,
      content: (
        <ArticlesTab 
          isLoading={isLoading}
          isSearching={false}
          hasSearched={hasSearched}
          displayedArticles={filteredArticles}
          onResetSearch={handleResetSearch}
          onArticleSelect={handleArticleSelect}
        />
      )
    },
    {
      id: 'specializations',
      label: 'Специализации',
      icon: <Users className="h-5 w-5" />,
      content: (
        <SpecializationsTab 
          isLoading={isLoading}
          specializations={filteredSpecializations}
        />
      )
    }
  ];

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
      <div className="space-y-6 pb-20 sm:pb-6">
        <MedicalKnowledgeSearch 
          categories={categories}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Десктопная навигация табов */}
        <div className="hidden sm:block">
          <div className="bg-background/70 backdrop-blur-xl rounded-2xl shadow-lg border p-1 mb-6">
            <div className="relative">
              {/* Подвижный индикатор фона */}
              <div 
                className="absolute top-1 bottom-1 bg-primary rounded-xl shadow-md transition-all duration-500 ease-out"
                style={{
                  left: `${(activeTab * 100) / tabs.length}%`,
                  width: `${100 / tabs.length}%`,
                  transform: 'translateX(0.125rem)',
                  right: '0.125rem'
                }}
              />
              
              {/* Кнопки табов */}
              <div className="relative flex rounded-xl overflow-hidden">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(index)}
                    className={`
                      flex-1 relative z-10 flex items-center justify-center space-x-2 
                      py-3 px-4 text-sm font-medium transition-all duration-300
                      hover:scale-105 active:scale-95
                      ${activeTab === index 
                        ? 'text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Контент активного таба */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeTab * 100}%)` }}
          >
            {tabs.map((tab, index) => (
              <div key={tab.id} className="w-full flex-shrink-0 px-1">
                <div className="min-h-[400px]">
                  {tab.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Мобильная навигация внизу */}
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-50">
          <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border p-2">
            <div className="flex justify-around">
              {tabs.map((tab, index) => (
                <button
                  key={`mobile-${tab.id}`}
                  onClick={() => setActiveTab(index)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
                    ${activeTab === index 
                      ? 'bg-primary text-primary-foreground shadow-lg transform scale-110' 
                      : 'text-muted-foreground hover:bg-muted'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="text-xs font-medium mt-1">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayoutWithHeader>
  );
};

export default MedicalKnowledge;
