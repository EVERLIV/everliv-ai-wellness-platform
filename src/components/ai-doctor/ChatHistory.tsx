
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatHistoryHeader from "./chat-history/ChatHistoryHeader";
import ChatHistoryList from "./chat-history/ChatHistoryList";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

interface ChatHistoryProps {
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
  selectedChatId?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  onSelectChat, 
  onCreateNewChat, 
  selectedChatId 
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    
    try {
      const { data: chatsData, error } = await supabase
        .from('ai_doctor_chats')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          ai_doctor_messages(count)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedChats = chatsData?.map(chat => ({
        id: chat.id,
        title: chat.title || 'Новая консультация',
        created_at: chat.created_at,
        updated_at: chat.updated_at,
        message_count: chat.ai_doctor_messages?.[0]?.count || 0
      })) || [];

      setChats(formattedChats);
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_doctor_chats')
        .insert([{
          user_id: user.id,
          title: `Консультация ${new Date().toLocaleDateString()}`
        }])
        .select()
        .single();

      if (error) throw error;
      
      await loadChats();
      onCreateNewChat();
      if (data) {
        onSelectChat(data.id);
      }
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Удалить эту консультацию?')) return;
    
    try {
      const { error } = await supabase
        .from('ai_doctor_chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;
      
      await loadChats();
      
      if (selectedChatId === chatId) {
        onCreateNewChat();
      }
    } catch (error) {
      console.error('Ошибка удаления чата:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHistoryHeader 
        onCreateNewChat={createNewChat} 
        isMobile={isMobile} 
      />
      
      <ChatHistoryList
        chats={chats}
        selectedChatId={selectedChatId}
        isLoading={isLoading}
        onSelectChat={onSelectChat}
        onDeleteChat={deleteChat}
        onCreateNewChat={createNewChat}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ChatHistory;
