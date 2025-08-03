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
            <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Базовый ИИ-Доктор</h2>
              <p className="text-xs text-muted-foreground">
                {maxMessages - messageCount} сообщений осталось
              </p>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white rounded-t-lg shadow-sm">
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50/50" style={{ scrollBehavior: 'smooth' }}>
        <div className="space-y-3 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-white border border-border" 
                  : "bg-brand-primary text-white"
              }`}>
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
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
                
                <div className={`p-3 rounded-lg ${
                  message.role === "user" 
                    ? "bg-white border border-border" 
                    : "bg-brand-primary/10 border border-brand-primary/20"
                }`}>
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">ИИ Доктор</span>
                </div>
                <div className="p-3 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                    <span className="text-sm">Анализирую...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Popular Questions */}
      {showSuggestedQuestions && !isLimitReached && (
        <div className="bg-white border-t border-border p-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-foreground mb-1">
                Популярные вопросы
              </h3>
              <p className="text-sm text-muted-foreground">
                Выберите вопрос или задайте свой
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => {
                const IconComponent = iconMap[question.icon as keyof typeof iconMap] || BookOpen;
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSuggestedQuestion(question.text)}
                    className="h-auto p-3 text-left justify-start hover:bg-brand-primary/5 hover:border-brand-primary/20 min-h-[60px]"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary flex-shrink-0">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-foreground text-left leading-tight">
                        {question.text}
                      </span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Input Panel */}
      <div className="bg-white border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          {isLimitReached ? (
            <div className="text-center p-6 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-lg border border-brand-primary/20">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Дневной лимит исчерпан</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Для неограниченного общения оформите премиум подписку
              </p>
              <Button 
                size="sm" 
                onClick={() => window.location.href = "/pricing"}
                className="bg-brand-primary hover:bg-brand-primaryDark"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Обновить подписку
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  placeholder="Задайте вопрос о здоровье..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                  className="w-full min-h-[48px] p-3 resize-none border border-border rounded-lg bg-background placeholder:text-muted-foreground overflow-hidden focus:border-brand-primary focus:outline-none text-sm"
                  style={{ 
                    lineHeight: '1.4',
                    maxHeight: isMobile ? '20vh' : '30vh'
                  }}
                  rows={1}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                className="h-[48px] w-[48px] p-0 flex-shrink-0 bg-brand-primary hover:bg-brand-primaryDark"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicAIDoctorChat;