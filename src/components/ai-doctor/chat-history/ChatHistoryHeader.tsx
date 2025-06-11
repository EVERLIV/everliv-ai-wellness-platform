
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChatHistoryHeaderProps {
  onCreateNewChat: () => void;
  isMobile?: boolean;
}

const ChatHistoryHeader: React.FC<ChatHistoryHeaderProps> = ({ 
  onCreateNewChat, 
  isMobile = false 
}) => {
  return (
    <div className="p-4 border-b">
      <div className={`flex items-center ${isMobile ? 'justify-between mb-3' : 'justify-end'}`}>
        {isMobile && (
          <h2 className="text-lg font-semibold">История чатов</h2>
        )}
        <Button onClick={onCreateNewChat} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          {isMobile ? "Новый" : "Новый чат"}
        </Button>
      </div>
    </div>
  );
};

export default ChatHistoryHeader;
