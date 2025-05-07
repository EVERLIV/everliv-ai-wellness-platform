import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Pencil, Trash2, Search, FileText } from "lucide-react";
import BlogPostEditor from './BlogPostEditor';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  author_id: string;
}

const BlogManagement = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setPosts(data as BlogPost[] || []);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Ошибка загрузки данных",
        description: error.message || "Не удалось загрузить список статей",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Статья удалена",
        description: "Статья успешно удалена из блога"
      });
      
      setPosts(posts.filter(post => post.id !== postId));
      setConfirmingDelete(null);
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: "Ошибка удаления",
        description: error.message || "Не удалось удалить статью",
        variant: "destructive"
      });
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'guide': return 'Руководство';
      case 'research': return 'Исследование';
      case 'success': return 'История успеха';
      case 'news': return 'Новости';
      default: return category;
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

  if (editingPost) {
    return <BlogPostEditor 
      existingPost={editingPost} 
      onBack={() => {
        setEditingPost(null);
        fetchPosts();
      }} 
    />;
  }

  if (isCreating) {
    return <BlogPostEditor onBack={() => {
      setIsCreating(false);
      fetchPosts();
    }} />;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление блогом</h2>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Создать статью
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Поиск статей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-evergreen-500"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium">Статей не найдено</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery 
              ? "Попробуйте изменить поисковый запрос" 
              : "Создайте свою первую статью для блога"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Заголовок</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Категория</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Дата публикации</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          <img 
                            src={post.thumbnail || 'https://placehold.co/100?text=No+Image'} 
                            alt={post.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </div>
                        <div className="truncate max-w-[300px]">
                          <div className="font-medium text-gray-900">{post.title}</div>
                          <div className="text-xs text-gray-500 truncate">{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryLabel(post.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingPost(post)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {confirmingDelete === post.id ? (
                          <div className="flex items-center space-x-1">
                            <Button 
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Да
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => setConfirmingDelete(null)}
                            >
                              Нет
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setConfirmingDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
