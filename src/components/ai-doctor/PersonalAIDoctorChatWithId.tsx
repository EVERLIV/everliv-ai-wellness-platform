
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
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
      <div className="h-full flex items-center justify-center py-12 sm:py-16 px-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <div className="h-2 w-20 sm:w-24 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-gray-600 text-adaptive-xs sm:text-sm">Подготовка чата...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-w-0">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <ScrollArea className="flex-1 px-2 sm:px-4 pt-2 sm:pt-4 min-w-0">
          {allMessages.length === 0 ? (
            // Welcome State
            <div className="text-center py-6 sm:py-8 space-y-3 sm:space-y-4 px-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-adaptive-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Персональный ИИ-Доктор
                </h2>
                <p className="text-gray-600 max-w-sm mx-auto leading-relaxed text-adaptive-xs sm:text-sm mobile-text-wrap">
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
            <div className="mt-4 sm:mt-6 mb-3 sm:mb-4">
              <SuggestedQuestions 
                questions={suggestedQuestions}
                onSelectQuestion={handleSuggestedQuestion} 
              />
            </div>
          )}
        </ScrollArea>
        
        {/* Input Area */}
        <div className="px-2 sm:px-4 pb-2 sm:pb-4 pt-2 bg-gradient-to-t from-white/80 to-transparent min-w-0">
          {onlineUsers.length > 1 && (
            <div className="text-adaptive-xs text-gray-500 flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="mobile-text-wrap">{onlineUsers.length - 1} других пользователей онлайн</span>
            </div>
          )}
          
          <div className="space-y-2 sm:space-y-3 min-w-0">
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              isProcessing={isProcessing}
              onSubmit={handleSubmit}
            />
            
            {/* Action Buttons */}
            {(onCreateNewChat || onShowChatHistory) && (
              <div className="flex items-center justify-center gap-2 min-w-0">
                {onCreateNewChat && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCreateNewChat}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-lg px-2.5 sm:px-3 py-1.5 text-adaptive-xs sm:text-sm transition-all duration-200 min-w-0 flex-shrink-0"
                  >
                    <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                    <span className="mobile-text-wrap">Новый чат</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAIDoctorChatWithId;
