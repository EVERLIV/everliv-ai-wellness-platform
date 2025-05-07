
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Image, Check, Pencil, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface BlogPostEditorProps {
  onBack: () => void;
  existingPost?: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    category: string;
    thumbnail: string;
  }
}

const BlogPostEditor = ({ onBack, existingPost }: BlogPostEditorProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
  const [category, setCategory] = useState(existingPost?.category || 'guide');
  const [thumbnailUrl, setThumbnailUrl] = useState(existingPost?.thumbnail || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `blog-thumbnails/${fileName}`;
      
      setUploading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('blog')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('blog')
        .getPublicUrl(filePath);
      
      setThumbnailUrl(data.publicUrl);
      toast({
        title: "Изображение загружено",
        description: "Миниатюра успешно загружена"
      });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageInsert = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `blog-content/${fileName}`;
      
      setUploading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('blog')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('blog')
        .getPublicUrl(filePath);
      
      // Insert image markdown at cursor position
      const imageMarkdown = `\n![${file.name}](${data.publicUrl})\n`;
      
      // Insert at cursor position or at the end
      const textArea = document.getElementById('content-editor') as HTMLTextAreaElement;
      if (textArea) {
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        
        const textBefore = content.substring(0, startPos);
        const textAfter = content.substring(endPos);
        
        setContent(textBefore + imageMarkdown + textAfter);
      } else {
        setContent(content + imageMarkdown);
      }
      
      toast({
        title: "Изображение вставлено",
        description: "Изображение успешно добавлено в статью"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const savePost = async () => {
    if (!title || !content || !excerpt || !thumbnailUrl) {
      toast({
        title: "Заполните все поля",
        description: "Заголовок, содержание, описание и миниатюра обязательны",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const postData = {
        title,
        content,
        excerpt,
        category,
        thumbnail: thumbnailUrl,
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
          .insert([{
            ...postData,
            author_id: (await supabase.auth.getUser()).data.user?.id
          }]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: existingPost ? "Статья обновлена" : "Статья создана",
        description: existingPost ? "Изменения успешно сохранены" : "Новая статья успешно опубликована"
      });
      
      onBack(); // Return to the blog post list
      
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: "Ошибка сохранения",
        description: error.message || "Не удалось сохранить статью",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFormatting = (format: string) => {
    const textArea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textArea) return;
    
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;
    const selectedText = content.substring(startPos, endPos);
    
    let formattedText = '';
    let cursorOffset = 0;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'heading1':
        formattedText = `\n# ${selectedText}\n`;
        cursorOffset = 3;
        break;
      case 'heading2':
        formattedText = `\n## ${selectedText}\n`;
        cursorOffset = 4;
        break;
      case 'link':
        formattedText = `[${selectedText || 'Текст ссылки'}](url)`;
        cursorOffset = selectedText ? 3 : 13;
        break;
      case 'list':
        formattedText = selectedText
          ? selectedText.split('\n').map(line => `- ${line}`).join('\n')
          : '- ';
        cursorOffset = 2;
        break;
      default:
        return;
    }
    
    const newContent = 
      content.substring(0, startPos) + 
      formattedText + 
      content.substring(endPos);
    
    setContent(newContent);
    
    // Set cursor position after the format marks
    setTimeout(() => {
      textArea.focus();
      if (selectedText) {
        textArea.setSelectionRange(startPos + formattedText.length, startPos + formattedText.length);
      } else {
        const newCursorPos = startPos + cursorOffset;
        textArea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Назад к списку статей
        </Button>
        <Button 
          onClick={savePost} 
          disabled={!title || !content || !excerpt || !thumbnailUrl || saving || uploading}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          {saving ? "Сохранение..." : existingPost ? "Обновить статью" : "Опубликовать статью"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label htmlFor="title">Заголовок</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="Введите заголовок статьи..." 
              className="text-lg"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content">Содержание</Label>
              <div className="flex space-x-1">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAddFormatting('bold')}
                  title="Жирный"
                >
                  <strong>B</strong>
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAddFormatting('italic')}
                  title="Курсив"
                >
                  <em>I</em>
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAddFormatting('heading1')}
                  title="Заголовок 1"
                >
                  H1
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAddFormatting('heading2')}
                  title="Заголовок 2"
                >
                  H2
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAddFormatting('link')}
                  title="Ссылка"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAddFormatting('list')}
                  title="Список"
                >
                  •••
                </Button>
                <div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageInsert}
                    accept="image/*"
                    className="hidden"
                    id="content-image-upload"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    onClick={() => document.getElementById('content-image-upload')?.click()}
                    title="Вставить изображение"
                    disabled={uploading}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Textarea 
              id="content-editor"
              value={content} 
              onChange={e => setContent(e.target.value)}
              placeholder="Введите содержание статьи..." 
              className="min-h-[400px] font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Поддерживается Markdown: **жирный текст**, *курсив*, # заголовок, [текст ссылки](url)
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="excerpt">Краткое описание</Label>
            <Textarea 
              id="excerpt" 
              value={excerpt} 
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Короткое описание для предпросмотра статьи..." 
              className="h-24"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Категория</Label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="guide">Руководство</option>
              <option value="research">Исследование</option>
              <option value="success">История успеха</option>
              <option value="news">Новости</option>
            </select>
          </div>
          
          <div>
            <Label>Миниатюра</Label>
            <div className="mt-2 border rounded-md overflow-hidden">
              {thumbnailUrl ? (
                <div className="relative">
                  <img 
                    src={thumbnailUrl} 
                    alt="Thumbnail preview" 
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-2 right-2"
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-50 h-40 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Загрузите миниатюру</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="mt-2"
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Загрузка..." : "Выбрать изображение"}
                  </Button>
                </div>
              )}
              <input 
                type="file"
                id="thumbnail-upload"
                onChange={handleThumbnailUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Рекомендуемый размер: 1200x630 пикселей
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostEditor;
