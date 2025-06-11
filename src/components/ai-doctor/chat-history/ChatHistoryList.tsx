
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatItem from "./ChatItem";
import ChatHistoryEmptyState from "./ChatHistoryEmptyState";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

interface ChatHistoryListProps {
  chats: Chat[];
  selectedChatId?: string;
  isLoading: boolean;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  onCreateNewChat: () => void;
  isMobile?: boolean;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  chats,
  selectedChatId,
  isLoading,
  onSelectChat,
  onDeleteChat,
  onCreateNewChat,
  isMobile = false
}) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">Загрузка...</div>
    );
  }

  if (chats.length === 0) {
    return (
      <ChatHistoryEmptyState 
        onCreateNewChat={onCreateNewChat} 
        isMobile={isMobile} 
      />
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-2">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChatId === chat.id}
            onSelect={onSelectChat}
            onDelete={onDeleteChat}
            isMobile={isMobile}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatHistoryList;
