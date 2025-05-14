import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

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

interface BlogPostEditorProps {
  existingPost?: BlogPost;
  onBack: () => void;
}

const BlogPostEditor = ({ existingPost, onBack }: BlogPostEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
  const [category, setCategory] = useState(existingPost?.category || 'guide');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(existingPost?.thumbnail || '');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    setThumbnailFile(file);
    
    // Create a preview for the thumbnail
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnailPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailClear = () => {
    setThumbnailPreview('');
    setThumbnailFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) {
      return existingPost?.thumbnail || '';
    }
    
    const fileExt = thumbnailFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `blog/${fileName}`;
    
    const { error } = await supabase.storage
      .from('blog')
      .upload(filePath, thumbnailFile);
    
    if (error) {
      throw error;
    }
    
    const { data } = supabase.storage.from('blog').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const getCategoryLabel = (categoryValue: string): string => {
    switch (categoryValue) {
      case 'guide': return 'Руководство';
      case 'research': return 'Исследование';
      case 'success': return 'История успеха';
      case 'news': return 'Новости';
      default: return categoryValue;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !excerpt || !content || !category) {
      toast("Не все поля заполнены", {
        description: "Пожалуйста, заполните все обязательные поля"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload the thumbnail if a new one is provided
      const thumbnailUrl = await uploadThumbnail();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Пользователь не авторизован");
      }
      
      const postData = {
        title,
        content,
        excerpt,
        category,
        thumbnail: thumbnailUrl,
        author_id: user.id,
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (existingPost) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', existingPost.id);
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert([postData]);
      }
      
      const { error } = result;
      if (error) throw error;
      
      toast(existingPost ? "Статья обновлена" : "Статья создана", {
        description: existingPost 
          ? "Изменения успешно сохранены" 
          : "Новая статья успешно добавлена в блог"
      });
      
      onBack();
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast("Ошибка сохранения", {
        description: error.message || "Не удалось сохранить статью"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
        <h2 className="text-2xl font-bold">
          {existingPost ? "Редактирование статьи" : "Создание новой статьи"}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите заголовок статьи..."
                className="text-lg"
                disabled={loading}
              />
            </div>
            
            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Краткое описание</Label>
              <Textarea 
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Краткое описание статьи..."
                className="h-20 resize-none"
                disabled={loading}
              />
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Содержание</Label>
              <Textarea 
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Введите содержание статьи..."
                className="h-64 resize-none"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Поддерживается Markdown разметка
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
                disabled={loading}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">{getCategoryLabel('guide')}</SelectItem>
                  <SelectItem value="research">{getCategoryLabel('research')}</SelectItem>
                  <SelectItem value="success">{getCategoryLabel('success')}</SelectItem>
                  <SelectItem value="news">{getCategoryLabel('news')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Обложка статьи</Label>
              <div className="border rounded-md p-4">
                {thumbnailPreview ? (
                  <div className="space-y-3">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-1"
                      onClick={handleThumbnailClear}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-40 flex flex-col gap-2 justify-center items-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    <Upload className="h-8 w-8 opacity-50" />
                    <span>Загрузить изображение</span>
                    <span className="text-xs text-gray-500">JPG, PNG до 2MB</span>
                  </Button>
                )}
                <input
                  type="file"
                  id="thumbnail"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={handleThumbnailChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {existingPost ? "Обновление..." : "Создание..."}
              </>
            ) : (
              existingPost ? "Обновить статью" : "Создать статью"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostEditor;
