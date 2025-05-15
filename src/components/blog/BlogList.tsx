import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { BlogPost } from "@/types/database";

interface BlogListProps {
  category?: string;
}

const BlogList = ({ category = "all" }: BlogListProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 4;

  useEffect(() => {
    fetchPosts();
  }, [category, currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('blog_posts').select('*', { count: 'exact' });
      
      // Filter by category if specified
      if (category !== "all") {
        query = query.eq('category', category);
      }
      
      // Add pagination
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      setPosts(data as BlogPost[] || []);
      
      // Calculate total pages
      if (count) {
        setTotalPages(Math.ceil(count / postsPerPage));
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Статей не найдено</h3>
        <p className="text-gray-500 mt-2">
          {category !== "all" 
            ? "Попробуйте выбрать другую категорию" 
            : "В данный момент нет опубликованных статей"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={post.thumbnail || 'https://placehold.co/100?text=No+Image'} 
                alt={post.title}
                className="w-full h-full object-cover aspect-video md:aspect-auto"
              />
            </div>
            <div className="md:w-2/3 flex flex-col">
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span className="capitalize">{getCategoryLabel(post.category)}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <CardTitle className="text-xl font-bold hover:text-everliv-600 transition-colors">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* We don't have author data yet, but we'll keep this for future implementation */}
                <div className="flex items-center">
                  <img 
                    src={"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"} 
                    alt={"Автор"}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">Эксперт EVERLIV</p>
                    <p className="text-xs text-muted-foreground">Специалист</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/blog/${post.id}`}>
                  <Button variant="outline" className="text-everliv-600 border-everliv-600 hover:bg-everliv-50">
                    Читать статью
                  </Button>
                </Link>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  href="#"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BlogList;
