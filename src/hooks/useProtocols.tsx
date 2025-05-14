
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Protocol {
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

export const useProtocols = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProtocols = async () => {
    setLoading(true);
    try {
      // Fetch protocols data from user_protocols table
      const { data: protocolsData, error: protocolsError } = await supabase
        .from('user_protocols')
        .select('*');

      if (protocolsError) {
        console.error("Error fetching protocols:", protocolsError);
        throw protocolsError;
      }

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
    } catch (error: any) {
      setError(error.message);
      toast.error("Ошибка загрузки", {
        description: `Не удалось загрузить протоколы: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProtocol = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_protocols')
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

  useEffect(() => {
    fetchProtocols();
  }, []);

  return { protocols, loading, error, deleteProtocol, fetchProtocols };
};
