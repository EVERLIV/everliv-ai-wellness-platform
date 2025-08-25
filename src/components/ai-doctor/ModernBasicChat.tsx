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
    "Анализ крови", 
    "Симптомы",
    "Рекомендации"
  ];

  useEffect(() => {
    // Приветственное сообщение
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: 'Здравствуйте! Я ваш персональный ИИ-консультант по здоровью. Могу помочь с интерпретацией анализов, ответить на вопросы о здоровье или дать рекомендации по улучшению самочувствия. Чем могу помочь?',
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
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Mobile-First Header */}
      <div className={cn(
        "flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white sticky top-0 z-10 backdrop-blur-lg shadow-lg",
        isMobile ? "px-4 py-3 safe-area-pt" : "px-6 py-4"
      )}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className={cn("font-semibold", isMobile ? "text-base" : "text-lg")}>
                ИИ Доктор
              </h1>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className={cn("text-white/90", isMobile ? "text-xs" : "text-sm")}>
                  Онлайн
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:text-white hover:bg-white/20 rounded-lg w-8 h-8 p-0"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages - Modern Mobile Design */}
      <div className={cn(
        "flex-1 overflow-y-auto scroll-smooth bg-gradient-to-b from-gray-50 to-white touch-manipulation",
        isMobile ? "px-4 py-4" : "px-6 py-6"
      )}>
        <div className="space-y-3 max-w-none">
          {messages.map((message) => (
            <div key={message.id} className={cn(
              "flex items-end gap-2",
              message.role === "user" ? "justify-end" : "justify-start"
            )}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
              )}
              
              {message.role === "user" ? (
                // User messages - right side with gradient
                <div className={cn(
                  "max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform transition-all duration-300 hover:scale-[1.02]",
                  isMobile ? "px-4 py-3 text-sm" : "px-5 py-4 text-base"
                )}>
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ) : (
                // AI messages - left side with modern styling
                <div className={cn(
                  "max-w-[85%] rounded-2xl rounded-bl-md bg-white text-gray-800 shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.02]",
                  isMobile ? "px-4 py-3 text-sm" : "px-5 py-4 text-base"
                )}>
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              )}
              
              {message.role === "user" && (
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          
          {isProcessing && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <div className={cn(
                "max-w-[85%] rounded-2xl rounded-bl-md bg-white text-gray-800 shadow-md border border-gray-100",
                isMobile ? "px-4 py-3" : "px-5 py-4"
              )}>
                <div className="flex items-center gap-3 text-purple-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className={cn(isMobile ? "text-sm" : "text-base")}>
                    Печатает...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestedQuestions && (
        <div className={cn(
          "bg-white",
          isMobile ? "px-4 py-2" : "px-6 py-3"
        )}>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className={cn(
                  "bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 border border-purple-200 hover:border-purple-300 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 touch-manipulation",
                  isMobile ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs"
                )}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Modern Mobile Design */}
      <div className={cn(
        "bg-white safe-area-pb",
        isMobile ? "px-4 py-3" : "px-6 py-4"
      )}>
        <div className="flex gap-3 items-center">
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              placeholder="Напишите сообщение..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className={cn(
                "w-full resize-none bg-gray-100 placeholder:text-gray-500 text-gray-800 overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-300 border-0 transition-all duration-200 touch-manipulation",
                isMobile 
                  ? "min-h-[40px] px-4 py-3 text-base rounded-2xl" 
                  : "min-h-[44px] px-5 py-3 text-base rounded-2xl"
              )}
              style={{ 
                lineHeight: '1.4',
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
              "flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:bg-gray-300 transition-all duration-200 flex items-center justify-center border-0 outline-0 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 touch-manipulation",
              isMobile 
                ? "h-[40px] w-[40px]" 
                : "h-[44px] w-[44px]"
            )}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Send className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernBasicChat;