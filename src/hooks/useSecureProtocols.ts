
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseErrorHandler } from './useSupabaseErrorHandler';

export const useSecureProtocols = () => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [protocols, setProtocols] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProtocols = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_protocols')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        handleError(error, 'fetching user protocols');
        return;
      }

      setProtocols(data || []);
    } catch (error) {
      handleError(error as Error, 'fetching user protocols');
    } finally {
      setIsLoading(false);
    }
  };

  const createProtocol = async (protocolData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_protocols')
        .insert({
          user_id: user.id,
          ...protocolData
        })
        .select()
        .single();

      if (error) {
        handleError(error, 'creating user protocol');
        return;
      }

      await fetchProtocols(); // Refresh the list
      return data;
    } catch (error) {
      handleError(error as Error, 'creating user protocol');
    }
  };

  const updateProtocol = async (id: string, updates: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_protocols')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        handleError(error, 'updating user protocol');
        return;
      }

      await fetchProtocols(); // Refresh the list
      return data;
    } catch (error) {
      handleError(error as Error, 'updating user protocol');
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, [user]);

  return {
    protocols,
    isLoading,
    createProtocol,
    updateProtocol,
    refetch: fetchProtocols
  };
};
