import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User, ChevronRight, Grid3X3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Microscope, Pill, TrendingUp, Heart, Apple, Brain, Activity, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

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
    "Головная боль",
    "Витамины зимой", 
    "Качество сна",
    "Результаты анализов",
    "Боль в спине",
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Minimalist Header */}
      <div className={cn(
        "flex items-center justify-between bg-gray-50",
        isMobile ? "px-4 py-3 safe-area-pt" : "px-6 py-4"
      )}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 rounded-full w-9 h-9 p-0 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <h1 className={cn("font-semibold text-gray-900", isMobile ? "text-base" : "text-lg")}>
              ИИ-Доктор
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 rounded-lg w-9 h-9 p-0 hover:bg-gray-100"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          
          <div className={cn(
            "px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {maxMessages - messageCount}/{maxMessages}
          </div>
        </div>
      </div>

      {/* Chat Messages - Pure Background */}
      <div className={cn(
        "flex-1 overflow-y-auto scroll-smooth bg-gray-50",
        isMobile ? "px-4 py-4" : "px-6 py-6"
      )}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className={cn(
                "flex-shrink-0 rounded-full flex items-center justify-center",
                isMobile ? "w-8 h-8" : "w-9 h-9",
                message.role === "user" 
                  ? "bg-gray-200 text-gray-600" 
                  : "bg-blue-500 text-white"
              )}>
                {message.role === "user" ? (
                  <User className={cn(isMobile ? "h-4 w-4" : "h-4 w-4")} />
                ) : (
                  <Stethoscope className={cn(isMobile ? "h-4 w-4" : "h-4 w-4")} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("font-medium text-gray-900", isMobile ? "text-sm" : "text-base")}>
                    {message.role === "user" ? "Вы" : "ИИ-Доктор"}
                  </span>
                  <span className={cn("text-gray-500", isMobile ? "text-xs" : "text-sm")}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                
                <div className={cn(
                  "rounded-2xl",
                  isMobile ? "p-3" : "p-4",
                  message.role === "user" 
                    ? "bg-gray-100 text-gray-900" 
                    : "bg-white text-gray-900"
                )}>
                  <div className={cn(
                    "leading-relaxed whitespace-pre-wrap",
                    isMobile ? "text-sm" : "text-base"
                  )}>
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Suggested Questions - Integrated seamlessly */}
          {showSuggestedQuestions && !isLimitReached && (
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex-shrink-0 rounded-full flex items-center justify-center bg-blue-500 text-white",
                isMobile ? "w-8 h-8" : "w-9 h-9"
              )}>
                <Stethoscope className={cn(isMobile ? "h-4 w-4" : "h-4 w-4")} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("font-medium text-gray-900", isMobile ? "text-sm" : "text-base")}>
                    ИИ-Доктор
                  </span>
                </div>
                
                <div className={cn(
                  "rounded-2xl bg-white",
                  isMobile ? "p-3" : "p-4"
                )}>
                  <div className={cn("text-gray-900 mb-4", isMobile ? "text-sm" : "text-base")}>
                    Выберите популярный вопрос:
                  </div>
                  
                  <div className={cn(
                    "flex flex-wrap gap-2",
                    isMobile ? "gap-2" : "gap-2"
                  )}>
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className={cn(
                          "bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors duration-200",
                          isMobile ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"
                        )}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex-shrink-0 rounded-full flex items-center justify-center bg-blue-500 text-white",
                isMobile ? "w-8 h-8" : "w-9 h-9"
              )}>
                <Stethoscope className={cn(isMobile ? "h-4 w-4" : "h-4 w-4")} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("font-medium text-gray-900", isMobile ? "text-sm" : "text-base")}>
                    ИИ-Доктор
                  </span>
                </div>
                
                <div className={cn(
                  "rounded-2xl bg-white",
                  isMobile ? "p-3" : "p-4"
                )}>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className={cn("animate-spin", isMobile ? "h-4 w-4" : "h-4 w-4")} />
                    <span className={cn(isMobile ? "text-sm" : "text-base")}>
                      Анализирую...
                    </span>
                  </div>
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
          {isLimitReached ? (
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <h3 className={cn("font-semibold text-blue-900 mb-2", isMobile ? "text-base" : "text-lg")}>
                ⏰ Дневной лимит исчерпан
              </h3>
              <p className={cn("text-blue-700 mb-4", isMobile ? "text-sm" : "text-base")}>
                Для неограниченного общения с персональным ИИ-доктором
              </p>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-medium transition-colors duration-200"
                onClick={() => window.location.href = "/pricing"}
              >
                🚀 Обновить до Премиум
              </button>
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
                  className={cn(
                    "w-full resize-none bg-white placeholder:text-gray-400 overflow-hidden focus:outline-none rounded-2xl transition-all duration-200",
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
              <button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                className={cn(
                  "flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200 rounded-full flex items-center justify-center",
                  isMobile 
                    ? "h-[44px] w-[44px]" 
                    : "h-[48px] w-[48px]"
                )}
              >
                {isProcessing ? (
                  <Loader2 className={cn("animate-spin text-white", isMobile ? "h-4 w-4" : "h-4 w-4")} />
                ) : (
                  <Send className={cn("text-white", isMobile ? "h-4 w-4" : "h-4 w-4")} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernBasicChat;