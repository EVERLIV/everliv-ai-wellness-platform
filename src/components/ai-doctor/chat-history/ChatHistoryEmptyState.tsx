
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ChatHistoryEmptyStateProps {
  onCreateNewChat: () => void;
  isMobile?: boolean;
}

const ChatHistoryEmptyState: React.FC<ChatHistoryEmptyStateProps> = ({ 
  onCreateNewChat, 
  isMobile = false 
}) => {
  return (
    <div className="text-center text-gray-500 py-8">
      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
      <p>Нет сохраненных чатов</p>
      {!isMobile && (
        <Button onClick={onCreateNewChat} variant="outline" className="mt-4">
          Создать первый чат
        </Button>
      )}
    </div>
  );
};

export default ChatHistoryEmptyState;
