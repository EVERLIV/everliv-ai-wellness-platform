
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
  // Properties for UserProtocolsList compatibility
  progress: number;  // This is now required, not optional
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  // Internal properties
  completion_percentage?: number;
  started_at?: string | null;
}

export const useProtocols = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProtocols = async () => {
    setIsLoading(true);
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
          warnings: item.warnings || [],
          progress: item.completion_percentage || 0,
          status: mapStatus(item.status),
          startDate: item.started_at ? new Date(item.started_at).toLocaleDateString('ru-RU') : '',
          endDate: item.completed_at ? new Date(item.completed_at).toLocaleDateString('ru-RU') : '',
          completion_percentage: item.completion_percentage,
          started_at: item.started_at
        }));
      
      setProtocols(validProtocols);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      toast.error("Ошибка загрузки", {
        description: `Не удалось загрузить протоколы: ${error.message}`
      });
    } finally {
      setIsLoading(false);
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
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error("Ошибка удаления", {
        description: `Не удалось удалить протокол: ${error.message}`
      });
    }
  };

  // Helper function to map database status to component status
  const mapStatus = (dbStatus: string): 'active' | 'completed' | 'paused' => {
    if (dbStatus === 'in_progress') return 'active';
    if (dbStatus === 'completed') return 'completed';
    return 'paused';
  };

  useEffect(() => {
    fetchProtocols();
  }, []);

  return { protocols, isLoading, error, deleteProtocol, fetchProtocols };
};
