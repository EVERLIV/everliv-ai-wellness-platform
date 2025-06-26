
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseErrorHandler } from './useSupabaseErrorHandler';

export const useSecureAIDoctor = () => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ai_doctor_chats')
        .select(`
          *,
          ai_doctor_messages (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        handleError(error, 'fetching AI doctor chats');
        return;
      }

      setChats(data || []);
    } catch (error) {
      handleError(error as Error, 'fetching AI doctor chats');
    } finally {
      setIsLoading(false);
    }
  };

  const createChat = async (title?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_doctor_chats')
        .insert({
          user_id: user.id,
          title: title || 'Новый чат'
        })
        .select()
        .single();

      if (error) {
        handleError(error, 'creating AI doctor chat');
        return;
      }

      await fetchChats(); // Refresh the list
      return data;
    } catch (error) {
      handleError(error as Error, 'creating AI doctor chat');
    }
  };

  const createMessage = async (chatId: string, role: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_doctor_messages')
        .insert({
          chat_id: chatId,
          role,
          content
        })
        .select()
        .single();

      if (error) {
        handleError(error, 'creating AI doctor message');
        return;
      }

      await fetchChats(); // Refresh to get updated messages
      return data;
    } catch (error) {
      handleError(error as Error, 'creating AI doctor message');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return {
    chats,
    isLoading,
    createChat,
    createMessage,
    refetch: fetchChats
  };
};
