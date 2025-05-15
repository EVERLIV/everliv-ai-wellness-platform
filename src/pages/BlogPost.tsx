import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/database";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error("Post ID is required");
        }
        
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPost(data as BlogPost);
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError("Не удалось загрузить статью. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

  // Format date to locale string
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get category label
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'guide': return 'Практические советы';
      case 'research': return 'Исследования';
      case 'success': return 'История успеха';
      case 'news': return 'Новости';
      case 'interview': return 'Интервью с экспертами';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24">
          <div className="container mx-auto px-4 py-16">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
            <p className="text-gray-600 mb-8">{error || "Запрашиваемая статья не существует или была удалена."}</p>
            <Link to="/blog">
              <Button>Вернуться к блогу</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to="/blog">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="w-4 h-4" />
                  Назад к блогу
                </Button>
              </Link>
            </div>
            
            <article>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Эксперт EVERLIV
                  </span>
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    {getCategoryLabel(post.category)}
                  </span>
                </div>
              </div>
              
              {post.thumbnail && (
                <div className="mb-8">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title} 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
            
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-4">Поделиться статьей</h3>
              <div className="flex gap-2">
                <Button variant="outline">Twitter</Button>
                <Button variant="outline">Facebook</Button>
                <Button variant="outline">LinkedIn</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
