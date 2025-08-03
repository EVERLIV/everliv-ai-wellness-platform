
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SuggestedQuestions from "@/components/dashboard/ai-doctor/SuggestedQuestions";
import { usePersonalAIDoctorChatWithId } from "./usePersonalAIDoctorChatWithId";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useUserPresence } from "@/hooks/useUserPresence";
import { getSuggestedQuestions } from "@/services/ai/ai-doctor-service";
import { useIsMobile } from "@/hooks/use-mobile";
import { Microscope, Pill, TrendingUp, Heart, Apple, Stethoscope, Brain } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Популярные вопросы для персонального доктора
const suggestedQuestions = [
  { text: "Проанализируй мои последние анализы", icon: Heart },
  { text: "Какие обследования мне нужны?", icon: Apple },
];

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const allMessages = [...messages, ...realtimeMessages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const shouldShowSuggestedQuestions = allMessages.length === 0;

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
  }, [inputText]);

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
    <div className="h-full flex flex-col bg-background">
      {/* Compact Mobile Header */}
      {isMobile ? (
        <div className="flex items-center justify-between p-3 bg-white rounded-t-lg shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 h-auto"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-accent/10 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-brand-accent" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Персональный ИИ-Доктор</h2>
              <p className="text-xs text-muted-foreground">Премиум консультации</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {onCreateNewChat && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateNewChat}
                className="p-2 h-auto"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            
            {onShowChatHistory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowChatHistory}
                className="p-2 h-auto"
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        null
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50/50" style={{ scrollBehavior: 'smooth' }}>
        <div className="space-y-3 max-w-3xl mx-auto">
          {/* Welcome Screen with Quick Actions */}
          {allMessages.length === 0 && shouldShowSuggestedQuestions && (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-foreground mb-2">Персональная консультация</h3>
              <p className="text-muted-foreground mb-6">Выберите быстрое действие или задайте свой вопрос</p>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
                {suggestedQuestions.map((question, index) => {
                  const IconComponent = question.icon;
                  return (
                    <button
                      key={index}
                      className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-border"
                      onClick={() => handleSuggestedQuestion(question.text)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-foreground text-left">{question.text}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {allMessages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-white border border-border" 
                  : "bg-brand-accent text-white"
              }`}>
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {message.role === "user" ? "Вы" : "Персональный ИИ Доктор"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                
                <div className={`p-3 rounded-lg ${
                  message.role === "user" 
                    ? "bg-white border border-border" 
                    : "bg-brand-accent/10 border border-brand-accent/20"
                }`}>
                  {message.role === "assistant" && message.content.includes('<div') ? (
                    <div 
                      className="text-sm text-foreground leading-relaxed"
                      style={{ wordBreak: 'break-word', lineHeight: '1.4' }}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  ) : (
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-accent text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">Персональный ИИ Доктор</span>
                </div>
                <div className="p-3 rounded-lg bg-brand-accent/10 border border-brand-accent/20">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                    <span className="text-sm">Анализирую данные...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Panel */}
      <div className="bg-white border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-3">
              <textarea
                ref={textareaRef}
                placeholder="Задайте вопрос о вашем здоровье..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className="flex-1 min-h-[20px] max-h-32 resize-none outline-none text-sm placeholder:text-muted-foreground bg-transparent"
                style={{ 
                  lineHeight: '1.4'
                }}
                rows={1}
              />
              
              <Button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                size="sm"
                className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-brand-accent to-brand-accent/80 hover:from-brand-accent hover:to-brand-accent shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-3">
              Персональный ИИ-доктор анализирует ваши данные для точных рекомендаций.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAIDoctorChatWithId;
