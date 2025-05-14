
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditorCanvas from '@/components/editor/EditorCanvas';
import ComponentLibrary from '@/components/editor/ComponentLibrary';
import ComponentSettings from '@/components/editor/ComponentSettings';
import PageManagement from '@/components/editor/PageManagement';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Protocol {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  steps: any[];
  benefits: string[];
  warnings: string[];
}

const PageBuilder: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pages');
  const [pages, setPages] = useState<any[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      try {
        // First, fetch pages data
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*');

        if (pagesError) throw pagesError;
        setPages(pagesData || []);
        
        // Then, fetch protocols data - use user_protocols table instead of protocols
        const { data: protocolsData, error: protocolsError } = await supabase
          .from('user_protocols')
          .select('*');

        if (protocolsError) {
          console.error("Error fetching protocols:", protocolsError);
        } else {
          // Map user_protocols data to Protocol interface
          const validProtocols = (protocolsData || [])
            .filter(item => 
              typeof item.title === 'string' && 
              typeof item.description === 'string'
            )
            .map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              category: item.category || '',
              duration: item.duration || '',
              difficulty: item.difficulty || '',
              steps: item.steps || [],
              benefits: item.benefits || [],
              warnings: item.warnings || []
            }));
          
          setProtocols(validProtocols);
        }
      } catch (error: any) {
        setError(error.message);
        toast.error("Ошибка загрузки", {
          description: `Не удалось загрузить данные: ${error.message}`
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPages();
  }, []);

  const handleDeletePage = async (id: string) => {
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

  const handleDeleteProtocol = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_protocols') // Use user_protocols instead of protocols
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProtocols(protocols.filter(protocol => protocol.id !== id));
      toast.success("Протокол удален", {
        description: "Протокол был успешно удален"
      });
    } catch (error: any) {
      toast.error("Ошибка удаления", {
        description: `Не удалось удалить протокол: ${error.message}`
      });
    }
  };

  return (
    <ProtectedRoute adminRequired>
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Конструктор страниц</h1>
          
          <Tabs defaultValue="pages" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pages">Страницы</TabsTrigger>
              <TabsTrigger value="protocols">Протоколы</TabsTrigger>
              <TabsTrigger value="editor">Редактор</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pages">
              <PageManagement 
                pages={pages} 
                onDelete={handleDeletePage} 
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="protocols">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between mb-6">
                  <h2 className="text-xl font-semibold">Список протоколов</h2>
                  <Button>Создать протокол</Button>
                </div>
                
                {loading ? (
                  <p>Загрузка протоколов...</p>
                ) : protocols.length === 0 ? (
                  <p>Протоколы не найдены</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {protocols.map(protocol => (
                      <div key={protocol.id} className="border p-4 rounded-md">
                        <h3 className="font-semibold">{protocol.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{protocol.category}</p>
                        <p className="text-sm mb-4">{protocol.description}</p>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm">
                            Редактировать
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteProtocol(protocol.id)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="editor">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 bg-white p-4 rounded-lg shadow">
                  <ComponentLibrary />
                </div>
                
                <div className="col-span-6 bg-gray-100 p-4 rounded-lg">
                  <EditorCanvas />
                </div>
                
                <div className="col-span-3 bg-white p-4 rounded-lg shadow">
                  <ComponentSettings />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PageBuilder;
