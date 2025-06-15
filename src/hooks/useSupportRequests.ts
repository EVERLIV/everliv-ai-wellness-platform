
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupportRequest, SupportRequestInsert } from '@/types/support';
import { toast } from 'sonner';

export const useSupportRequests = () => {
  const queryClient = useQueryClient();

  const createSupportRequest = useMutation({
    mutationFn: async (data: SupportRequestInsert) => {
      const { error } = await supabase
        .from('support_requests')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Запрос успешно отправлен!');
    },
    onError: (error) => {
      console.error('Error creating support request:', error);
      toast.error('Ошибка при отправке запроса');
    },
  });

  const getSupportRequests = useQuery({
    queryKey: ['support-requests'],
    queryFn: async (): Promise<SupportRequest[]> => {
      const { data, error } = await supabase
        .from('support_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const updateSupportRequest = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupportRequest> }) => {
      const { error } = await supabase
        .from('support_requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-requests'] });
      toast.success('Запрос обновлен');
    },
    onError: (error) => {
      console.error('Error updating support request:', error);
      toast.error('Ошибка при обновлении запроса');
    },
  });

  return {
    createSupportRequest,
    getSupportRequests,
    updateSupportRequest,
  };
};
