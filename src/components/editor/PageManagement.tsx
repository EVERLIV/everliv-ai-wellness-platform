import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Save, PlusCircle, Edit, Trash2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PageContent {
  id: string;
  page_id: string;
  content: any;
  created_at: string;
  updated_at: string;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const PageManagement = () => {
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId: string }>();

  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNewPage, setIsNewPage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (pageId === 'new') {
          setIsNewPage(true);
          setLoading(false);
          return;
        }

        // Fetch page data
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('id', pageId)
          .single();

        if (pageError) {
          throw pageError;
        }

        if (!pageData) {
          toast("Страница не найдена", {
            description: "Указанная страница не существует."
          });
          navigate('/admin/pages');
          return;
        }

        setPage(pageData);
        setTitle(pageData.title);
        setSlug(pageData.slug);
        setDescription(pageData.description || '');
        setPublished(pageData.published);

        // Fetch page content
        const { data: contentData, error: contentError } = await supabase
          .from('page_contents')
          .select('*')
          .eq('page_id', pageId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (contentError) {
          throw contentError;
        }

        setContent(contentData || null);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast("Ошибка загрузки данных", {
          description: error.message || "Не удалось загрузить данные страницы."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageId, navigate]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (!title || !slug) {
        toast("Не все поля заполнены", {
          description: "Пожалуйста, заполните все обязательные поля."
        });
        return;
      }

      const pageData = {
        title,
        slug,
        description,
        published,
      };

      if (isNewPage && pageId === 'new') {
        // Create new page and content
        const { data: newPage, error: newPageError } = await supabase
          .from('pages')
          .insert({ ...pageData })
          .select()
          .single();

        if (newPageError) {
          throw newPageError;
        }

        const initialContent = {
          page_id: newPage.id,
          content: { blocks: [] },
        };

        const { error: newContentError } = await supabase
          .from('page_contents')
          .insert(initialContent);

        if (newContentError) {
          throw newContentError;
        }

        toast("Страница создана", {
          description: "Новая страница успешно создана."
        });
        navigate(`/admin/pages/${newPage.id}`);
      } else if (page) {
        // Update existing page
        const { error: updatePageError } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', page.id);

        if (updatePageError) {
          throw updatePageError;
        }

        toast("Страница обновлена", {
          description: "Данные страницы успешно обновлены."
        });
      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast("Ошибка сохранения", {
        description: error.message || "Не удалось сохранить данные страницы."
      });
    } finally {
      setSaving(false);
    }
  }, [title, slug, description, published, page, navigate, isNewPage, pageId]);

  const handleDelete = async () => {
    if (!page) return;

    if (!window.confirm("Вы уверены, что хотите удалить эту страницу?")) {
      return;
    }

    try {
      setLoading(true);
      // Delete page content
      if (content) {
        const { error: contentError } = await supabase
          .from('page_contents')
          .delete()
          .eq('page_id', page.id);

        if (contentError) {
          throw contentError;
        }
      }

      // Delete page
      const { error: pageError } = await supabase
        .from('pages')
        .delete()
        .eq('id', page.id);

      if (pageError) {
        throw pageError;
      }

      toast("Страница удалена", {
        description: "Страница и ее содержимое были успешно удалены."
      });
      navigate('/admin/pages');
    } catch (error: any) {
      console.error('Error deleting page:', error);
      toast("Ошибка удаления", {
        description: error.message || "Не удалось удалить страницу."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => navigate('/admin/pages')} className="gap-1">
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">
            {isNewPage ? 'Создать страницу' : 'Редактировать страницу'}
          </h1>
        </div>
        {page && !isNewPage && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-md p-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  placeholder="Заголовок страницы"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="URL страницы"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Описание страницы"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none h-32"
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow-md rounded-md p-5">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(!!checked)}
                  disabled={saving}
                />
                <Label htmlFor="published">Опубликовать</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Сохранить
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PageManagement;
