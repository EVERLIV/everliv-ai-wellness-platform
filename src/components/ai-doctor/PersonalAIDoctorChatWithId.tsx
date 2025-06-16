
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, MessageSquare, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "@/components/dashboard/ai-doctor/ChatMessages";
import ChatInput from "@/components/dashboard/ai-doctor/ChatInput";
import SuggestedQuestions from "@/components/dashboard/ai-doctor/SuggestedQuestions";
import { usePersonalAIDoctorChatWithId } from "./usePersonalAIDoctorChatWithId";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useUserPresence } from "@/hooks/useUserPresence";
import { getSuggestedQuestions } from "@/services/ai/ai-doctor-service";
import { useIsMobile } from "@/hooks/use-mobile";

interface PersonalAIDoctorChatWithIdProps {
  chatId?: string;
  onBack: () => void;
  onCreateNewChat?: () => void;
  onShowChatHistory?: () => void;
}

const PersonalAIDoctorChatWithId: React.FC<PersonalAIDoctorChatWithIdProps> = ({ 
  chatId, 
  onBack,
  onCreateNewChat,
  onShowChatHistory
}) => {
  const {
    messages,
    inputText,
    setInputText,
    isProcessing,
    isLoading,
    remainingMessages,
    handleSubmit,
    handleSuggestedQuestion,
    messagesEndRef
  } = usePersonalAIDoctorChatWithId(chatId);

  // Add realtime messages
  const { realtimeMessages } = useRealtimeMessages(chatId);
  
  // Add user presence for this chat
  const { onlineUsers, updatePresence } = useUserPresence(chatId || 'no-chat');

  const isMobile = useIsMobile();
  const suggestedQuestions = getSuggestedQuestions({});
  
  // Combine regular messages with realtime messages
  const allMessages = [...messages, ...realtimeMessages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const showSuggestedQuestions = allMessages.length === 0 || (allMessages.length === 1 && allMessages[0].role === 'assistant');

  // Update presence when typing
  useEffect(() => {
    if (inputText.trim()) {
      updatePresence({ status: 'typing' });
    } else {
      updatePresence({ status: 'online' });
    }
  }, [inputText, updatePresence]);

  if (isLoading && !chatId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Подготовка чата...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border">
      {/* Область чата */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
          <ChatMessages 
            messages={allMessages} 
            isProcessing={isProcessing}
            messagesEndRef={messagesEndRef}
          />
          
          {showSuggestedQuestions && (
            <div className="mt-4">
              <SuggestedQuestions 
                questions={suggestedQuestions}
                onSelectQuestion={handleSuggestedQuestion} 
              />
            </div>
          )}
        </ScrollArea>
        
        {/* Область ввода с кнопками управления */}
        <div className="p-4 border-t bg-white space-y-3">
          {/* Show online users indicator */}
          {onlineUsers.length > 1 && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {onlineUsers.length - 1} других пользователей онлайн
            </div>
          )}
          
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            isProcessing={isProcessing}
            onSubmit={handleSubmit}
          />
          
          {/* Кнопки управления чатом */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {onCreateNewChat && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateNewChat}
                className="text-xs text-gray-600 hover:text-gray-800 px-3 py-1 h-auto"
              >
                <Plus className="h-3 w-3 mr-1" />
                Новый чат
              </Button>
            )}
            
            {onShowChatHistory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowChatHistory}
                className="text-xs text-gray-600 hover:text-gray-800 px-3 py-1 h-auto"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                История чатов
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAIDoctorChatWithId;
