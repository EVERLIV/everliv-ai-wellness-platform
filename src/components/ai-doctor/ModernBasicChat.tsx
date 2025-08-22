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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedQuestions = [
    "Головная боль",
    "Витамины зимой", 
    "Качество сна",
    "Результаты анализов",
    "Боль в спине",
    "Профилактика простуды"
  ];

  useEffect(() => {
    // Приветственное сообщение
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: 'Привет! 👋 Готов помочь с вопросами о здоровье.',
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
      const maxHeight = isMobile ? 60 : 80;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${Math.max(newHeight, isMobile ? 36 : 40)}px`;
    }
  }, [inputText, isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || isProcessing) {
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

  const showSuggestedQuestions = messages.length <= 1;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Minimalist Header */}
      <div className={cn(
        "flex items-center justify-between bg-gray-50",
        isMobile ? "px-3 py-2 safe-area-pt" : "px-4 py-3"
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 rounded-full w-7 h-7 p-0 hover:bg-gray-100"
        >
          <ArrowLeft className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 rounded-lg w-7 h-7 p-0 hover:bg-gray-100"
        >
          <Grid3X3 className="h-3 w-3" />
        </Button>
      </div>

      {/* Chat Messages - Pure Background */}
      <div className={cn(
        "flex-1 overflow-y-auto scroll-smooth bg-gray-50",
        isMobile ? "px-3 py-3" : "px-4 py-4"
      )}>
        <div className="space-y-2 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}>
              <div className={cn(
                  "max-w-[80%] rounded-xl",
                  isMobile ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm",
                message.role === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-900"
              )}>
                <div className="leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {/* Suggested Questions */}
          {showSuggestedQuestions && (
            <div className="flex justify-start">
              <div className={cn(
                "max-w-[80%] rounded-xl bg-gray-200 text-gray-900",
                isMobile ? "px-3 py-2" : "px-4 py-3"
              )}>
                <div className={cn("text-gray-900 mb-2", isMobile ? "text-xs" : "text-sm")}>
                  Выберите популярный вопрос:
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className={cn(
                        "bg-gray-100 hover:bg-gray-300 text-gray-800 rounded-full transition-colors duration-200",
                        isMobile ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs"
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
                "max-w-[80%] rounded-xl bg-gray-200 text-gray-900",
                isMobile ? "px-3 py-2" : "px-4 py-3"
              )}>
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className={cn("animate-spin", isMobile ? "h-3 w-3" : "h-3 w-3")} />
                  <span className={cn(isMobile ? "text-xs" : "text-sm")}>
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
        isMobile ? "px-3 py-2" : "px-4 py-3"
      )}>
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-center">
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
                    ? "min-h-[36px] px-3 py-2 text-sm rounded-xl" 
                    : "min-h-[40px] px-4 py-2.5 text-sm rounded-xl"
                )}
                style={{ 
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxHeight: isMobile ? '60px' : '80px'
                }}
                rows={1}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isProcessing}
              className={cn(
                "flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 transition-all duration-200 flex items-center justify-center border-0 outline-0 rounded-full",
                isMobile 
                  ? "h-[36px] w-[36px]" 
                  : "h-[40px] w-[40px]"
              )}
            >
              {isProcessing ? (
                <Loader2 className={cn("animate-spin text-white", isMobile ? "h-4 w-4" : "h-4 w-4")} />
              ) : (
                <Send className={cn("text-white", isMobile ? "h-4 w-4" : "h-4 w-4")} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernBasicChat;