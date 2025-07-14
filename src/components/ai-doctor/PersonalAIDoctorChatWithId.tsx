
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
    <div className="h-full flex flex-col border border-border bg-card">
      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          {allMessages.length === 0 ? (
            // Welcome State
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground border border-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground leading-relaxed">
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
            <SuggestedQuestions 
              questions={suggestedQuestions}
              onSelectQuestion={handleSuggestedQuestion} 
            />
          )}
        </ScrollArea>
        
        {/* Input Area */}
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          isProcessing={isProcessing}
          onSubmit={handleSubmit}
        />
        
        {/* Action Buttons */}
        {(onCreateNewChat || onShowChatHistory) && (
          <div className="border-t border-border bg-muted/30 p-2">
            <div className="flex justify-center gap-2">
              {onCreateNewChat && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateNewChat}
                  className="text-muted-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Новый чат
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAIDoctorChatWithId;
