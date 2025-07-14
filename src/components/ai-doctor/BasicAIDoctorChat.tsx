import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface BasicAIDoctorChatProps {
  onBack: () => void;
}

const BasicAIDoctorChat: React.FC<BasicAIDoctorChatProps> = ({ onBack }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxMessages = 3;

  const suggestedQuestions = [
    { text: "У меня болит голова, что делать?", icon: "heart" },
    { text: "Какие витамины нужны зимой?", icon: "pill" },
    { text: "Как улучшить качество сна?", icon: "trending-up" },
    { text: "Что означают мои симптомы?", icon: "book-open" },
  ];

  useEffect(() => {
    if (user) {
      const today = new Date().toDateString();
      const storageKey = `basic_ai_doctor_messages_${user.id}_${today}`;
      const savedCount = localStorage.getItem(storageKey);
      if (savedCount) {
        setMessageCount(parseInt(savedCount, 10));
      }
    }

    // Приветственное сообщение
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: 'Привет! Я базовый ИИ-доктор EVERLIV. У вас есть 3 бесплатных сообщения в день. Задайте вопрос о здоровье.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = Math.min(window.innerHeight * 0.3, 120);
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${Math.max(newHeight, 32)}px`;
    }
  }, [inputText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || isProcessing || messageCount >= maxMessages) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);
    
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    
    if (user) {
      const today = new Date().toDateString();
      const storageKey = `basic_ai_doctor_messages_${user.id}_${today}`;
      localStorage.setItem(storageKey, newCount.toString());
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-doctor', {
        body: {
          message: inputText.trim(),
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          systemPrompt: `Вы - базовый ИИ-доктор Everliv, который предоставляет ТОЛЬКО общие медицинские консультации и информацию о здоровье.

ВАЖНЫЕ ОГРАНИЧЕНИЯ:
- Отвечайте ТОЛЬКО на медицинские вопросы о здоровье, симптомах, профилактике
- Давайте ОБЩИЕ рекомендации, избегайте конкретных диагнозов
- Всегда рекомендуйте консультацию с врачом для точного диагноза
- Если вопрос НЕ медицинский - вежливо перенаправьте на медицинские темы
- Отвечайте на русском языке
- Будьте краткими и понятными
- Подчеркивайте, что это базовая бесплатная консультация

Помните: вы предоставляете общую медицинскую информацию, а не заменяете консультацию врача.`
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (newCount >= maxMessages) {
        setTimeout(() => {
          const limitMessage: Message = {
            id: 'limit-reached',
            role: 'assistant',
            content: 'Вы достигли дневного лимита бесплатных сообщений (3 в день). Для неограниченного общения с персональным ИИ-доктором оформите премиум подписку!',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, limitMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Ошибка вызова ИИ-доктора:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте позже.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const isLimitReached = messageCount >= maxMessages;
  const showSuggestedQuestions = messages.length <= 1;

  return (
    <div className="h-full flex flex-col border border-border bg-card">
      {/* Compact Mobile Header */}
      {isMobile ? (
        <div className="flex items-center justify-between p-1 border-b border-border bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground p-1 h-6 w-6 min-w-[24px] flex-shrink-0"
          >
            <ArrowLeft className="h-3 w-3" />
          </Button>
          
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">
              {maxMessages - messageCount} осталось
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm">Назад к выбору чатов</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {maxMessages - messageCount} сообщений осталось
            </span>
          </div>
        </div>
      )}

      {/* Messages Area - Maximized on Mobile */}
      <div className="flex-1 overflow-y-auto px-1 xs:px-2 sm:px-6 py-1 xs:py-2 sm:py-4" style={{ scrollBehavior: 'smooth' }}>
        <div className="space-y-1 xs:space-y-2 sm:space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-1 xs:space-x-2 sm:space-x-3">
              <div className={`w-5 h-5 xs:w-6 xs:h-6 sm:w-9 sm:h-9 border flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-muted border-border" 
                  : "bg-primary text-primary-foreground border-primary"
              }`}>
                {message.role === "user" ? (
                  <User className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Sparkles className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4" />
                )}
              </div>

              <div className="flex-1 min-w-0 max-w-[90%]">
                <div className="flex items-center space-x-1 mb-0.5 xs:mb-1 sm:mb-2">
                  <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-foreground">
                    {message.role === "user" ? "Вы" : "ИИ Доктор"}
                  </span>
                  <span className="text-[8px] xs:text-[10px] sm:text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                
                <div className={`border-l-2 pl-1.5 xs:pl-2 sm:pl-3 ${
                  message.role === "user" ? "border-l-muted" : "border-l-primary"
                }`}>
                  <div className="text-[10px] xs:text-xs sm:text-sm text-foreground leading-tight whitespace-pre-wrap" 
                       style={{ wordBreak: 'break-word', lineHeight: '1.3' }}>
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-start space-x-1 xs:space-x-2 sm:space-x-3">
              <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-9 sm:h-9 bg-primary text-primary-foreground border border-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4" />
              </div>
              <div className="flex-1 min-w-0 max-w-[90%]">
                <div className="flex items-center space-x-1 mb-0.5 xs:mb-1 sm:mb-2">
                  <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-foreground">ИИ Доктор</span>
                </div>
                <div className="border-l-2 border-l-primary pl-1.5 xs:pl-2 sm:pl-3">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Loader2 className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 animate-spin flex-shrink-0" />
                    <span className="text-[10px] xs:text-xs sm:text-sm">Анализирую...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Popular Questions - Compact on Mobile */}
      {showSuggestedQuestions && !isLimitReached && (
        <div className="border-t border-border bg-muted/30 p-1 xs:p-2 sm:p-5">
          <div className="text-center mb-1 xs:mb-2 sm:mb-4">
            <h3 className="text-[10px] xs:text-xs sm:text-base font-semibold text-foreground mb-0.5">
              Популярные вопросы
            </h3>
            <p className="text-[8px] xs:text-[10px] sm:text-sm text-muted-foreground">
              Выберите вопрос или задайте свой
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-1 xs:gap-1.5 sm:gap-3">
            {suggestedQuestions.map((question, index) => {
              const IconComponent = iconMap[question.icon as keyof typeof iconMap] || BookOpen;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSuggestedQuestion(question.text)}
                  className="h-auto p-1.5 xs:p-2 sm:p-3 text-left justify-start hover:bg-muted/50 bg-card min-h-[28px] xs:min-h-[32px] sm:min-h-[44px]"
                >
                  <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 w-full">
                    <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 bg-muted flex items-center justify-center text-primary flex-shrink-0">
                      <IconComponent className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-[9px] xs:text-[10px] sm:text-sm text-foreground text-left leading-tight" style={{ wordBreak: 'break-word' }}>
                      {question.text}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Compact Input Panel */}
      <div className="border-t border-border bg-card p-1 xs:p-2 sm:p-6">
        {isLimitReached ? (
          <div className="text-center p-2 xs:p-3 sm:p-4 bg-muted/50 rounded">
            <h3 className="text-xs xs:text-sm sm:text-lg font-semibold mb-1 xs:mb-2">Дневной лимит исчерпан</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground mb-2 xs:mb-4">
              Для неограниченного общения оформите премиум подписку
            </p>
            <Button size="sm" onClick={() => window.location.href = "/pricing"}>
              Обновить подписку
            </Button>
          </div>
        ) : (
          <div className="flex gap-1 xs:gap-1.5 sm:gap-3 items-center">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                placeholder="Задайте вопрос о здоровье..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className="w-full min-h-[32px] xs:min-h-[36px] sm:min-h-[44px] p-1.5 xs:p-2 sm:p-3 resize-none border border-input bg-background placeholder:text-muted-foreground overflow-hidden focus:border-ring focus:outline-none text-[11px] xs:text-xs sm:text-sm"
                style={{ 
                  lineHeight: '1.3',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxHeight: isMobile ? '15vh' : '30vh'
                }}
                rows={1}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isProcessing}
              className="h-[32px] w-[32px] xs:h-[36px] xs:w-[36px] sm:h-[44px] sm:w-[44px] p-0 flex-shrink-0"
            >
              {isProcessing ? (
                <Loader2 className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Send className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicAIDoctorChat;