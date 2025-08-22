import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Microscope, Pill, TrendingUp, Heart, Apple, Brain, Activity, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  microscope: Microscope,
  pill: Pill,
  "trending-up": TrendingUp,
  "book-open": BookOpen,
  heart: Heart,
  apple: Apple,
  brain: Brain,
  activity: Activity,
  stethoscope: Stethoscope,
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ModernBasicChatProps {
  onBack: () => void;
}

const ModernBasicChat: React.FC<ModernBasicChatProps> = ({ onBack }) => {
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
    "У меня болит голова уже 3 дня",
    "Какие витамины принимать зимой?", 
    "Как улучшить качество сна?",
    "Что означают результаты анализов?",
    "Боль в спине при работе",
    "Профилактика простуды"
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
      content: 'Привет! 👋 Я ваш ИИ-доктор EVERLIV.\n\nГотов помочь с вопросами о здоровье. У вас есть 3 бесплатные консультации сегодня.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = isMobile ? 80 : 100;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${Math.max(newHeight, isMobile ? 44 : 48)}px`;
    }
  }, [inputText, isMobile]);

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
          systemPrompt: `Вы - профессиональный ИИ-доктор Everliv.

СТИЛЬ ОТВЕТА:
- Структурированные ответы с четкими разделами
- Используйте эмодзи для выделения важных моментов
- Давайте конкретные, практичные рекомендации
- Будьте эмпатичными и понимающими

СТРУКТУРА ОТВЕТА:
🔍 **Анализ симптомов**
💡 **Рекомендации**
⚠️ **Когда обратиться к врачу**
📋 **Дополнительные советы**

Отвечайте на русском языке, будьте профессиональными но дружелюбными.`
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
            content: '⏰ **Дневной лимит исчерпан**\n\nВы использовали все 3 бесплатные консультации сегодня.\n\nДля неограниченного общения с персональным ИИ-доктором оформите премиум подписку! 🚀',
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
        content: '❌ Извините, произошла техническая ошибка. Попробуйте снова через несколько секунд.',
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
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      {/* Minimalist Header */}
      <div className={cn(
        "flex items-center justify-between border-b bg-background/95 backdrop-blur-sm",
        isMobile ? "px-4 py-3 safe-area-pt" : "px-6 py-4"
      )}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground rounded-full w-9 h-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className={cn("font-semibold text-foreground", isMobile ? "text-base" : "text-lg")}>
                ИИ-Доктор
              </h1>
              {!isMobile && (
                <p className="text-xs text-muted-foreground">Медицинская консультация</p>
              )}
            </div>
          </div>
        </div>
        
        <div className={cn(
          "px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium border border-blue-100",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {maxMessages - messageCount} из {maxMessages}
        </div>
      </div>

      {/* Chat Messages */}
      <div className={cn(
        "flex-1 overflow-y-auto scroll-smooth",
        isMobile ? "px-4 py-4" : "px-6 py-6"
      )}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className={cn(
                "flex-shrink-0 rounded-full flex items-center justify-center shadow-sm",
                isMobile ? "w-8 h-8" : "w-10 h-10",
                message.role === "user" 
                  ? "bg-gray-100 text-gray-600" 
                  : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              )}>
                {message.role === "user" ? (
                  <User className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
                ) : (
                  <Stethoscope className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("font-medium text-foreground", isMobile ? "text-sm" : "text-base")}>
                    {message.role === "user" ? "Вы" : "ИИ-Доктор"}
                  </span>
                  <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                
                <div className={cn(
                  "rounded-2xl shadow-sm border",
                  isMobile ? "p-3" : "p-4",
                  message.role === "user" 
                    ? "bg-gray-50 border-gray-100 ml-0" 
                    : "bg-white border-gray-200"
                )}>
                  <div className={cn(
                    "text-foreground leading-relaxed whitespace-pre-wrap",
                    isMobile ? "text-sm" : "text-base"
                  )}>
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Suggested Questions - Встроенные в чат */}
          {showSuggestedQuestions && !isLimitReached && (
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex-shrink-0 rounded-full flex items-center justify-center shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white",
                isMobile ? "w-8 h-8" : "w-10 h-10"
              )}>
                <Stethoscope className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("font-medium text-foreground", isMobile ? "text-sm" : "text-base")}>
                    ИИ-Доктор
                  </span>
                </div>
                
                <div className={cn(
                  "rounded-2xl shadow-sm border bg-white border-gray-200",
                  isMobile ? "p-3" : "p-4"
                )}>
                  <div className={cn("text-foreground mb-3", isMobile ? "text-sm" : "text-base")}>
                    💡 Выберите популярный вопрос или задайте свой:
                  </div>
                  
                  <div className={cn(
                    "flex flex-wrap gap-2",
                    isMobile ? "gap-1.5" : "gap-2"
                  )}>
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleSuggestedQuestion(question)}
                        className={cn(
                          "h-auto text-left justify-start bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 rounded-full transition-all duration-200 hover:scale-105",
                          isMobile ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"
                        )}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex-shrink-0 rounded-full flex items-center justify-center shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white",
                isMobile ? "w-8 h-8" : "w-10 h-10"
              )}>
                <Stethoscope className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("font-medium text-foreground", isMobile ? "text-sm" : "text-base")}>
                    ИИ-Доктор
                  </span>
                </div>
                
                <div className={cn(
                  "rounded-2xl shadow-sm border bg-white border-gray-200",
                  isMobile ? "p-3" : "p-4"
                )}>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className={cn("animate-spin", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                    <span className={cn(isMobile ? "text-sm" : "text-base")}>
                      Анализирую ваш вопрос...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Area */}
      <div className={cn(
        "border-t bg-background/95 backdrop-blur-sm safe-area-pb",
        isMobile ? "px-4 py-3" : "px-6 py-4"
      )}>
        <div className="max-w-4xl mx-auto">
          {isLimitReached ? (
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <h3 className={cn("font-semibold text-blue-900 mb-2", isMobile ? "text-base" : "text-lg")}>
                ⏰ Дневной лимит исчерпан
              </h3>
              <p className={cn("text-blue-700 mb-4", isMobile ? "text-sm" : "text-base")}>
                Для неограниченного общения с персональным ИИ-доктором
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.location.href = "/pricing"}
              >
                🚀 Обновить до Премиум
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  placeholder="Опишите ваши симптомы или задайте вопрос..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                  className={cn(
                    "w-full resize-none border-0 bg-gray-50 placeholder:text-gray-400 overflow-hidden focus:ring-2 focus:ring-blue-500/20 focus:outline-none rounded-2xl transition-all duration-200 shadow-sm",
                    isMobile 
                      ? "min-h-[44px] px-4 py-3 text-sm" 
                      : "min-h-[48px] px-5 py-3 text-base"
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
              <Button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                className={cn(
                  "flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl rounded-full border-0 disabled:opacity-50",
                  isMobile 
                    ? "h-[44px] w-[44px]" 
                    : "h-[48px] w-[48px]"
                )}
              >
                {isProcessing ? (
                  <Loader2 className={cn("animate-spin text-white", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                ) : (
                  <Send className={cn("text-white", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernBasicChat;