
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, MessageSquare, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "@/components/dashboard/ai-doctor/ChatMessages";
import ChatInput from "@/components/dashboard/ai-doctor/ChatInput";
import SuggestedQuestions from "@/components/dashboard/ai-doctor/SuggestedQuestions";
import { usePersonalAIDoctorChatWithId } from "./usePersonalAIDoctorChatWithId";
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

  const isMobile = useIsMobile();
  const suggestedQuestions = getSuggestedQuestions({});
  const showSuggestedQuestions = messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant');

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Загрузка чата...</p>
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
            messages={messages} 
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
