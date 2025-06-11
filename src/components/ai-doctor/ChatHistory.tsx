import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Calendar, Clock, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Сегодня';
    if (diffDays === 2) return 'Вчера';
    if (diffDays <= 7) return `${diffDays} дн. назад`;
    
    return date.toLocaleDateString();
  };

  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">История чатов</h2>
            <Button onClick={createNewChat} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Новый
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">Загрузка...</div>
            ) : chats.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Нет сохраненных чатов</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedChatId === chat.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(chat.updated_at)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {chat.message_count} сообщ.
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Убрали Card wrapper для десктопа и убрали заголовок */}
      <div className="p-4 border-b flex items-center justify-end">
        <Button onClick={createNewChat} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Новый чат
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">Загрузка...</div>
          ) : chats.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Нет сохраненных чатов</p>
              <Button onClick={createNewChat} variant="outline" className="mt-4">
                Создать первый чат
              </Button>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedChatId === chat.id 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(chat.updated_at)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {chat.message_count} сообщ.
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
