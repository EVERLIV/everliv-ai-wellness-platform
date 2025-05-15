
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import BlogList from "@/components/blog/BlogList";
import PageHeader from "@/components/PageHeader";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Categories are derived from our blog post categories
  const categories = [
    "all", "guide", "research", "success", "news", "interview"
  ];

  // Get category label for display
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'all': return 'Все';
      case 'guide': return 'Практические советы';
      case 'research': return 'Исследования';
      case 'success': return 'История успеха';
      case 'news': return 'Новости';
      case 'interview': return 'Интервью с экспертами';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 bg-gray-50">
        <PageHeader
          title="Блог EVERLIV"
          description="Актуальные исследования, практические советы и экспертные мнения в области здорового долголетия"
        >
          <div className="mt-8 max-w-lg mx-auto relative">
            <Input 
              type="text" 
              placeholder="Поиск статей..." 
              className="w-full pl-12 pr-4 py-3 text-lg rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </PageHeader>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setActiveCategory(category)}
                >
                  {getCategoryLabel(category)}
                </Button>
              ))}
            </div>
            
            <BlogList category={activeCategory} />
            
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Подпишитесь на нашу рассылку</h2>
                  <p className="text-gray-600">
                    Получайте свежие статьи, исследования и практические советы по здоровому долголетию
                  </p>
                </div>
                
                <form className="flex flex-col md:flex-row gap-4">
                  <Input 
                    type="email" 
                    placeholder="Ваш email" 
                    className="md:flex-grow" 
                    required
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    Подписаться
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
