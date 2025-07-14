
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SuggestedQuestions from "@/components/dashboard/ai-doctor/SuggestedQuestions";
import { usePersonalAIDoctorChatWithId } from "./usePersonalAIDoctorChatWithId";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useUserPresence } from "@/hooks/useUserPresence";
import { getSuggestedQuestions } from "@/services/ai/ai-doctor-service";
import { useIsMobile } from "@/hooks/use-mobile";
import { Microscope, Pill, TrendingUp, Heart, Apple } from "lucide-react";

const iconMap = {
  microscope: Microscope,
  pill: Pill,
  "trending-up": TrendingUp,
  "book-open": BookOpen,
  heart: Heart,
  apple: Apple,
};

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const allMessages = [...messages, ...realtimeMessages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const showSuggestedQuestions = allMessages.length === 0 || (allMessages.length === 1 && allMessages[0].role === 'assistant');

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = Math.min(window.innerHeight * 0.3, 120);
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${Math.max(newHeight, 44)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

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
      {/* Navigation Header - Simplified */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-muted/30 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground p-2 h-11 min-w-[44px] flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-2 hidden xs:inline sm:inline">Назад к выбору чатов</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {onCreateNewChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateNewChat}
              className="text-muted-foreground hover:text-foreground h-11 min-w-[44px] px-3"
            >
              <Plus className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Новый чат</span>
            </Button>
          )}
          
          {onShowChatHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowChatHistory}
              className="text-muted-foreground hover:text-foreground h-11 min-w-[44px] px-3"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">История</span>
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 pb-20 sm:pb-6" style={{ scrollBehavior: 'smooth' }}>
        {allMessages.length === 0 ? (
          <div className="flex items-start space-x-3 mb-5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary text-primary-foreground border border-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 max-w-[85%]">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-semibold text-foreground">ИИ Доктор</span>
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="text-sm leading-relaxed text-foreground" style={{ wordBreak: 'break-word', lineHeight: '1.5' }}>
                Я помню нашу историю общения и имею доступ к вашим медицинским анализам для точных рекомендаций
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {allMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 border flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" 
                    ? "bg-muted border-border" 
                    : "bg-primary text-primary-foreground border-primary"
                }`}>
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0 max-w-[85%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {message.role === "user" ? "Вы" : "ИИ Доктор"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  
                  <div className={`border-l-2 pl-3 ${
                    message.role === "user" ? "border-l-muted" : "border-l-primary"
                  }`}>
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap" 
                         style={{ wordBreak: 'break-word', fontSize: '14px', lineHeight: '1.5' }}>
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary text-primary-foreground border border-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 max-w-[85%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-foreground">ИИ Доктор</span>
                  </div>
                  <div className="border-l-2 border-l-primary pl-3">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                      <span className="text-sm">Анализирую ваш запрос...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Popular Questions - Mobile Optimized */}
      {showSuggestedQuestions && (
        <div className="border-t border-border bg-muted/30 p-3 sm:p-5 pb-20 sm:pb-5">
          <div className="text-center mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
              Популярные вопросы
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Выберите вопрос или задайте свой
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {suggestedQuestions.map((question, index) => {
              const IconComponent = iconMap[question.icon as keyof typeof iconMap] || BookOpen;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSuggestedQuestion(question.text)}
                  className="h-auto p-3 text-left justify-start hover:bg-muted/50 bg-card min-h-[44px]"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-muted flex items-center justify-center text-primary flex-shrink-0">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-foreground text-left leading-snug" style={{ wordBreak: 'break-word' }}>
                      {question.text}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fixed Bottom Input Panel - Mobile First */}
      <div className="fixed bottom-0 left-0 right-0 sm:relative sm:bottom-auto border-t-2 border-border bg-card p-3 sm:p-6 z-50 safe-area-pb">
        <div className="flex gap-2 sm:gap-3 items-end max-w-full">
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              placeholder="Задайте вопрос о здоровье..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="w-full min-h-[44px] p-3 resize-none border border-input bg-background text-sm placeholder:text-muted-foreground overflow-hidden focus:border-ring focus:outline-none"
              style={{ 
                lineHeight: '1.4',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxHeight: '30vh',
                fontSize: '14px'
              }}
              rows={1}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!inputText.trim() || isProcessing}
            className="h-[44px] w-[44px] p-0 flex-shrink-0"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Bottom Action Buttons - Touch Friendly */}
        {onCreateNewChat && (
          <div className="flex justify-center mt-3 sm:mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateNewChat}
              className="text-muted-foreground hover:text-foreground hover:border-primary min-h-[44px] px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Новый чат
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAIDoctorChatWithId;
