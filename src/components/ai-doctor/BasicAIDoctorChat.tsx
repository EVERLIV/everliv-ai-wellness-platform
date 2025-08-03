import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Microscope, Pill, TrendingUp, Heart, Apple, Stethoscope } from "lucide-react";

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
    { text: "У меня болит голова, что делать?", icon: Heart },
    { text: "Какие витамины нужны зимой?", icon: Apple },
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

    // Убираем приветственное сообщение
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
  const showSuggestedQuestions = messages.length === 0;

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
          {/* Welcome Screen with Quick Actions */}
          {messages.length === 0 && showSuggestedQuestions && !isLimitReached && (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-foreground mb-2">Задайте вопрос о здоровье</h3>
              <p className="text-muted-foreground mb-6">Выберите быстрое действие или опишите свои симптомы</p>
              
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
                        <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
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

      {/* Modern Input Panel */}
      <div className="bg-white border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          {isLimitReached ? (
            <div className="text-center p-6 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-2xl border border-brand-primary/20">
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
            <div className="relative">
              <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-3">
                <textarea
                  ref={textareaRef}
                  placeholder="Опишите свои симптомы..."
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
                  className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-primaryLight hover:from-brand-primaryDark hover:to-brand-primary shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-3">
                ИИ может ошибаться. Проконсультируйтесь с врачом для серьезных вопросов.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicAIDoctorChat;