
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePages } from '@/hooks/usePages';

const PagesTab: React.FC = () => {
  const { pages, loading, deletePage } = usePages();
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Список страниц</h2>
        <Button onClick={() => navigate('/admin/page/new')}>Создать страницу</Button>
      </div>
      
      {loading ? (
        <p>Загрузка страниц...</p>
      ) : pages.length === 0 ? (
        <p>Страницы не найдены</p>
      ) : (
        <div className="space-y-4">
          {pages.map(page => (
            <div key={page.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{page.title}</h3>
                <p className="text-sm text-gray-500">{page.slug}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/admin/page/${page.id}`)}
                >
                  Редактировать
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deletePage(page.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagesTab;
