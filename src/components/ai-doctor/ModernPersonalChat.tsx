import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, MessageSquare, Send, Loader2, Grid3X3, Stethoscope, Sparkles } from "lucide-react";
import { usePersonalAIDoctorChatWithId } from "./usePersonalAIDoctorChatWithId";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useUserPresence } from "@/hooks/useUserPresence";
import { getSuggestedQuestions } from "@/services/ai/ai-doctor-service";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ModernPersonalChatProps {
  chatId?: string;
  onBack: () => void;
  onCreateNewChat?: () => void;
  onShowChatHistory?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ModernPersonalChat: React.FC<ModernPersonalChatProps> = ({ 
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const suggestedQuestions = [
    "Головная боль",
    "Витамины зимой", 
    "Качество сна",
    "Результаты анализов",
    "Боль в спине",
    "Профилактика простуды"
  ];

  const allMessages = [...messages, ...realtimeMessages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = isMobile ? 80 : 100;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${Math.max(newHeight, isMobile ? 44 : 48)}px`;
    }
  }, [inputText, isMobile]);

  useEffect(() => {
    if (inputText.trim()) {
      updatePresence({ status: 'typing' });
    } else {
      updatePresence({ status: 'online' });
    }
  }, [inputText]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) {
      return;
    }
    await handleSubmit(e);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setInputText(question);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
  };

  const showSuggestedQuestions = allMessages.length === 0 || (allMessages.length === 1 && allMessages[0].role === 'assistant');

  if (isLoading && !chatId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <p className="text-gray-600 text-sm">Подготовка чата...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Minimalist Header */}
      <div className={cn(
        "flex items-center justify-between bg-gray-50",
        isMobile ? "px-4 py-3 safe-area-pt" : "px-6 py-4"
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 rounded-full w-9 h-9 p-0 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          {onCreateNewChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateNewChat}
              className="text-gray-500 hover:text-gray-700 rounded-lg w-9 h-9 p-0 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          
          {onShowChatHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowChatHistory}
              className="text-gray-500 hover:text-gray-700 rounded-lg w-9 h-9 p-0 hover:bg-gray-100"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 rounded-lg w-9 h-9 p-0 hover:bg-gray-100"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages - Pure Background */}
      <div className={cn(
        "flex-1 overflow-y-auto scroll-smooth bg-gray-50",
        isMobile ? "px-4 py-4" : "px-6 py-6"
      )}>
        <div className="space-y-3 max-w-4xl mx-auto">
          {allMessages.length === 0 ? (
            // Welcome message
            <div className="flex justify-start">
              <div className={cn(
                "max-w-[80%] rounded-2xl bg-gray-200 text-gray-900",
                isMobile ? "px-4 py-3 text-sm" : "px-5 py-4 text-base"
              )}>
                <div className="leading-relaxed whitespace-pre-wrap">
                  Привет! 👋 Я ваш персональный ИИ-доктор. Готов помочь с вопросами о здоровье!
                </div>
              </div>
            </div>
          ) : (
            allMessages.map((message) => (
              <div key={message.id} className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl",
                  isMobile ? "px-4 py-3 text-sm" : "px-5 py-4 text-base",
                  message.role === "user" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-900"
                )}>
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {message.role === "assistant" && message.content.includes('<div') ? (
                      <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Suggested Questions */}
          {showSuggestedQuestions && (
            <div className="flex justify-start">
              <div className={cn(
                "max-w-[80%] rounded-2xl bg-gray-200 text-gray-900",
                isMobile ? "px-4 py-3" : "px-5 py-4"
              )}>
                <div className={cn("text-gray-900 mb-3", isMobile ? "text-sm" : "text-base")}>
                  Выберите популярный вопрос:
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestionClick(question)}
                      className={cn(
                        "bg-gray-100 hover:bg-gray-300 text-gray-800 rounded-full transition-colors duration-200",
                        isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
                      )}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className={cn(
                "max-w-[80%] rounded-2xl bg-gray-200 text-gray-900",
                isMobile ? "px-4 py-3" : "px-5 py-4"
              )}>
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className={cn("animate-spin", isMobile ? "h-4 w-4" : "h-4 w-4")} />
                  <span className={cn(isMobile ? "text-sm" : "text-base")}>
                    Анализирую...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Clean Design */}
      <div className={cn(
        "bg-gray-50 safe-area-pb",
        isMobile ? "px-4 py-3" : "px-6 py-4"
      )}>
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-center">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                placeholder="Задайте вопрос о здоровье..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className={cn(
                  "w-full resize-none bg-gray-100 placeholder:text-gray-500 overflow-hidden focus:outline-none focus:bg-gray-200 border-0 transition-all duration-200",
                  isMobile 
                    ? "min-h-[44px] px-4 py-3 text-sm rounded-2xl" 
                    : "min-h-[48px] px-5 py-3 text-base rounded-2xl"
                )}
                style={{ 
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxHeight: isMobile ? '80px' : '100px'
                }}
                rows={1}
              />
            </div>
            <button
              onClick={handleFormSubmit}
              disabled={!inputText.trim() || isProcessing}
              className={cn(
                "flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 transition-all duration-200 flex items-center justify-center border-0 outline-0 rounded-full",
                isMobile 
                  ? "h-[44px] w-[44px]" 
                  : "h-[48px] w-[48px]"
              )}
            >
              {isProcessing ? (
                <Loader2 className={cn("animate-spin text-white", isMobile ? "h-5 w-5" : "h-5 w-5")} />
              ) : (
                <Send className={cn("text-white", isMobile ? "h-5 w-5" : "h-5 w-5")} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernPersonalChat;