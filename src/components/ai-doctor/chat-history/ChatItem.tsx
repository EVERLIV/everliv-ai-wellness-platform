
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trash2 } from "lucide-react";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: (chatId: string) => void;
  onDelete: (chatId: string, e: React.MouseEvent) => void;
  isMobile?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ 
  chat, 
  isSelected, 
  onSelect, 
  onDelete, 
  isMobile = false 
}) => {
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

  const TimeIcon = isMobile ? Calendar : Clock;

  return (
    <div
      onClick={() => onSelect(chat.id)}
      className={`group p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-blue-50 border-blue-200' 
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{chat.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 flex items-center">
              <TimeIcon className="h-3 w-3 mr-1" />
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
          onClick={(e) => onDelete(chat.id, e)}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ChatItem;
