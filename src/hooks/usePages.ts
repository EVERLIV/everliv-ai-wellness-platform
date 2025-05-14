
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Page {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*');

      if (pagesError) throw pagesError;
      setPages(pagesData || []);
    } catch (error: any) {
      setError(error.message);
      toast.error("Ошибка загрузки", {
        description: `Не удалось загрузить страницы: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPages(pages.filter(page => page.id !== id));
      toast.success("Страница удалена", {
        description: "Страница была успешно удалена"
      });
    } catch (error: any) {
      toast.error("Ошибка удаления", {
        description: `Не удалось удалить страницу: ${error.message}`
      });
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return { pages, loading, error, deletePage, fetchPages };
};
