import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Microscope, Pill, TrendingUp, Heart, Apple, Brain, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    { 
      text: "У меня болит голова уже 3 дня", 
      icon: "brain",
      category: "Симптомы",
      description: "Головные боли, мигрень"
    },
    { 
      text: "Какие витамины принимать зимой?", 
      icon: "pill",
      category: "Профилактика",
      description: "Витамины и добавки"
    },
    { 
      text: "Как улучшить качество сна?", 
      icon: "activity",
      category: "Образ жизни",
      description: "Режим и восстановление"
    },
    { 
      text: "Что означают результаты анализов?", 
      icon: "microscope",
      category: "Анализы",
      description: "Расшифровка показателей"
    },
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
      content: 'Привет! 👋 Я ваш ИИ-доктор EVERLIV. Готов помочь с вопросами о здоровье.\n\nУ вас есть 3 бесплатных консультации сегодня. Задайте любой вопрос о самочувствии, симптомах или профилактике.',
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
      const maxHeight = isMobile ? 100 : 120;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${Math.max(newHeight, isMobile ? 44 : 52)}px`;
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
          systemPrompt: `Вы - ИИ-доктор Everliv, который предоставляет профессиональные медицинские консультации.

СТИЛЬ ОТВЕТА:
- Структурированные ответы с четкими разделами
- Используйте эмодзи для выделения важных моментов
- Давайте конкретные, практичные рекомендации
- Будьте эмпатичными и понимающими

СТРУКТУРА ОТВЕТА:
🔍 **Анализ симптомов/ситуации**
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
            content: '⏰ **Дневной лимит исчерпан**\n\nВы использовали все 3 бесплатные консультации сегодня.\n\nДля неограниченного общения с персональным ИИ-доктором и доступа к расширенным функциям - оформите премиум подписку! 🚀',
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
        content: '❌ Извините, произошла техническая ошибка. Пожалуйста, попробуйте снова через несколько секунд.',
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
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Modern Header */}
      <div className={cn(
        "flex items-center justify-between border-b bg-card/80 backdrop-blur-sm",
        isMobile ? "p-3 safe-area-pt" : "p-4"
      )}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className={cn("mr-2", isMobile ? "h-4 w-4" : "h-5 w-5")} />
            {!isMobile && <span>Назад</span>}
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className={cn("font-semibold text-foreground", isMobile ? "text-sm" : "text-lg")}>
                ИИ-Доктор
              </h1>
              {!isMobile && (
                <p className="text-xs text-muted-foreground">Базовая консультация</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {maxMessages - messageCount} из {maxMessages}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className={cn(
        "flex-1 overflow-y-auto scroll-smooth",
        isMobile ? "p-3 space-y-4" : "p-6 space-y-6"
      )}>
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            <div className={cn(
              "flex-shrink-0 rounded-xl flex items-center justify-center",
              isMobile ? "w-8 h-8" : "w-10 h-10",
              message.role === "user" 
                ? "bg-muted text-foreground" 
                : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
            )}>
              {message.role === "user" ? (
                <User className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
              ) : (
                <Brain className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
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
              
              <Card className={cn(
                "shadow-sm border-l-4",
                message.role === "user" 
                  ? "border-l-muted bg-muted/30" 
                  : "border-l-primary bg-card"
              )}>
                <CardContent className={cn(isMobile ? "p-3" : "p-4")}>
                  <div className={cn(
                    "text-foreground leading-relaxed whitespace-pre-wrap",
                    isMobile ? "text-sm" : "text-base"
                  )}>
                    {message.content}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex-shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
              isMobile ? "w-8 h-8" : "w-10 h-10"
            )}>
              <Brain className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("font-medium text-foreground", isMobile ? "text-sm" : "text-base")}>
                  ИИ-Доктор
                </span>
              </div>
              
              <Card className="shadow-sm border-l-4 border-l-primary">
                <CardContent className={cn(isMobile ? "p-3" : "p-4")}>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className={cn("animate-spin", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                    <span className={cn(isMobile ? "text-sm" : "text-base")}>
                      Анализирую ваш вопрос...
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestedQuestions && !isLimitReached && (
        <div className={cn(
          "border-t bg-muted/30 backdrop-blur-sm",
          isMobile ? "p-3" : "p-6"
        )}>
          <div className="text-center mb-4">
            <h3 className={cn("font-semibold text-foreground mb-1", isMobile ? "text-sm" : "text-lg")}>
              💡 Популярные вопросы
            </h3>
            <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
              Выберите готовый вопрос или задайте свой
            </p>
          </div>
          
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
            {suggestedQuestions.map((question, index) => {
              const IconComponent = iconMap[question.icon as keyof typeof iconMap] || BookOpen;
              
              return (
                <Card 
                  key={index}
                  className="hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                  onClick={() => handleSuggestedQuestion(question.text)}
                >
                  <CardContent className={cn(isMobile ? "p-3" : "p-4")}>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex-shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center",
                        isMobile ? "w-8 h-8" : "w-10 h-10"
                      )}>
                        <IconComponent className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-primary font-medium", isMobile ? "text-xs" : "text-sm")}>
                            {question.category}
                          </span>
                          <ChevronRight className={cn(
                            "text-muted-foreground group-hover:text-primary transition-colors",
                            isMobile ? "h-3 w-3" : "h-4 w-4"
                          )} />
                        </div>
                        <p className={cn(
                          "text-foreground font-medium leading-tight mb-1",
                          isMobile ? "text-sm" : "text-base"
                        )}>
                          {question.text}
                        </p>
                        <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                          {question.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={cn(
        "border-t bg-card/80 backdrop-blur-sm safe-area-pb",
        isMobile ? "p-3" : "p-6"
      )}>
        {isLimitReached ? (
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
              <div className="text-center">
                <h3 className={cn("font-semibold mb-2", isMobile ? "text-sm" : "text-lg")}>
                  ⏰ Дневной лимит исчерпан
                </h3>
                <p className={cn("text-muted-foreground mb-4", isMobile ? "text-xs" : "text-sm")}>
                  Для неограниченного общения с персональным ИИ-доктором и расширенных функций
                </p>
                <Button 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  onClick={() => window.location.href = "/pricing"}
                >
                  🚀 Обновить до Премиум
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex gap-3 items-end">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                placeholder="Опишите ваши симптомы или задайте вопрос о здоровье..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className={cn(
                  "w-full resize-none border-0 bg-muted/50 placeholder:text-muted-foreground overflow-hidden focus:ring-2 focus:ring-primary/20 focus:outline-none rounded-xl transition-all duration-200",
                  isMobile 
                    ? "min-h-[44px] p-3 text-sm" 
                    : "min-h-[52px] p-4 text-base"
                )}
                style={{ 
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxHeight: isMobile ? '100px' : '120px'
                }}
                rows={1}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isProcessing}
              className={cn(
                "flex-shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200",
                isMobile 
                  ? "h-[44px] w-[44px] rounded-xl" 
                  : "h-[52px] w-[52px] rounded-xl"
              )}
            >
              {isProcessing ? (
                <Loader2 className={cn("animate-spin", isMobile ? "h-4 w-4" : "h-5 w-5")} />
              ) : (
                <Send className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernBasicChat;