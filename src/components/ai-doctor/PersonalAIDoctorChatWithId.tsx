
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, MessageSquare, Plus, Sparkles } from "lucide-react";
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

  const { realtimeMessages } = useRealtimeMessages(chatId);
  const { onlineUsers, updatePresence } = useUserPresence(chatId || 'no-chat');

  const isMobile = useIsMobile();
  const suggestedQuestions = getSuggestedQuestions({});
  
  const allMessages = [...messages, ...realtimeMessages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const showSuggestedQuestions = allMessages.length === 0 || (allMessages.length === 1 && allMessages[0].role === 'assistant');

  useEffect(() => {
    if (inputText.trim()) {
      updatePresence({ status: 'typing' });
    } else {
      updatePresence({ status: 'online' });
    }
  }, [inputText, updatePresence]);

  if (isLoading && !chatId) {
    return (
      <div className="h-full flex items-center justify-center py-16 sm:py-24">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <div className="h-2 w-24 sm:w-32 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-gray-600 text-xs sm:text-sm">Подготовка чата...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 px-3 sm:px-6 pt-3 sm:pt-6">
          {allMessages.length === 0 ? (
            // Welcome State
            <div className="text-center py-8 sm:py-12 space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Персональный ИИ-Доктор
                </h2>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">
                  Я помню нашу историю общения и имею доступ к вашим медицинским анализам для точных рекомендаций
                </p>
              </div>
            </div>
          ) : (
            <ChatMessages 
              messages={allMessages} 
              isProcessing={isProcessing}
              messagesEndRef={messagesEndRef}
            />
          )}
          
          {showSuggestedQuestions && (
            <div className="mt-6 sm:mt-8 mb-4 sm:mb-6">
              <SuggestedQuestions 
                questions={suggestedQuestions}
                onSelectQuestion={handleSuggestedQuestion} 
              />
            </div>
          )}
        </ScrollArea>
        
        {/* Input Area */}
        <div className="px-3 sm:px-6 pb-3 sm:pb-6 pt-2 sm:pt-4 bg-gradient-to-t from-white/80 to-transparent">
          {onlineUsers.length > 1 && (
            <div className="text-xs text-gray-500 flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {onlineUsers.length - 1} других пользователей онлайн
            </div>
          )}
          
          <div className="space-y-3 sm:space-y-4">
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              isProcessing={isProcessing}
              onSubmit={handleSubmit}
            />
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {onCreateNewChat && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateNewChat}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Новый чат
                </Button>
              )}
              
              {onShowChatHistory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowChatHistory}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200"
                >
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  История чатов
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAIDoctorChatWithId;
