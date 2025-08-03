import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User, Camera, Mic, FileText, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Microscope, Pill, TrendingUp, Heart, Apple, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
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

  // Обработчики для кнопок меню
  const handleCameraClick = () => {
    toast({
      title: "Камера",
      description: "Функция камеры будет доступна в следующих обновлениях",
    });
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Запись остановлена",
        description: "Голосовое сообщение обрабатывается",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Запись началась",
        description: "Говорите в микрофон",
      });
      // Имитация записи
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleFileClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.jpg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Файл загружен",
          description: `${file.name} готов к анализу`,
        });
      }
    };
    input.click();
  };

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
  const shouldShowSuggestedQuestions = messages.length === 0;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Full Width Header */}
      {isMobile && (
        <div className="w-screen flex items-center justify-between px-2 py-1 bg-white shadow-sm fixed top-0 left-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 h-auto"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-brand-primary/10 rounded flex items-center justify-center">
              <Sparkles className="h-2 w-2 text-brand-primary" />
            </div>
            <h2 className="text-xs font-semibold text-foreground">Базовый ИИ-Доктор</h2>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {maxMessages - messageCount} осталось
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto px-2 py-6 bg-gray-50/50 ${isMobile ? 'mt-10' : 'pt-4'}`}>
        <div className="space-y-2 max-w-3xl mx-auto">
          {/* Quick Actions только если нет сообщений */}
          {messages.length === 0 && shouldShowSuggestedQuestions && !isLimitReached && (
            <div className="text-center py-4">
              <h3 className="text-lg font-bold text-foreground mb-1">Базовая консультация</h3>
              <p className="text-muted-foreground mb-4 text-sm">Выберите быстрое действие или задайте свой вопрос</p>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
                {suggestedQuestions.map((question, index) => {
                  const IconComponent = question.icon;
                  return (
                    <button
                      key={index}
                      className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 border border-border"
                      onClick={() => handleSuggestedQuestion(question.text)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs font-medium text-foreground text-left">{question.text}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-white border border-border" 
                  : "bg-brand-primary text-white"
              }`}>
                {message.role === "user" ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-foreground">
                    {message.role === "user" ? "Вы" : "ИИ Доктор"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                
                <div className={`p-2 rounded-lg ${
                  message.role === "user" 
                    ? "bg-white border border-border" 
                    : "bg-brand-primary/10 border border-brand-primary/20"
                }`}>
                  <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-brand-primary text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-3 w-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-foreground">ИИ Доктор</span>
                </div>
                <div className="p-2 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                    <span className="text-xs">Анализирую...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Compact Input Panel with integrated buttons */}
      <div className="bg-white border-t border-border py-2">
        <div className="max-w-3xl mx-auto px-2">
          {isLimitReached ? (
            <div className="text-center p-6 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-md border border-brand-primary/20">
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
            <div className="bg-gray-50 rounded-md px-4 py-2 border border-gray-200" style={{ minHeight: '32px' }}>
              {/* Input Field */}
              <textarea
                ref={textareaRef}
                placeholder="Что вас беспокоит? Как я могу помочь?"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className="w-full min-h-[14px] max-h-8 resize-none outline-none text-xs placeholder:text-muted-foreground bg-transparent"
                style={{ 
                  lineHeight: '1.1'
                }}
                rows={1}
              />
              
              {/* Bottom row with buttons */}
              <div className="flex items-center justify-between">
                {/* Left side buttons - без новый чат и история */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleFileClick}
                    className="w-5 h-5 bg-transparent rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <FileText className="w-3 h-3 text-gray-500" />
                  </button>
                  
                  <button 
                    onClick={handleCameraClick}
                    className="w-5 h-5 bg-transparent rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Camera className="w-3 h-3 text-gray-500" />
                  </button>
                  
                  <button 
                    onClick={handleMicClick}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isRecording 
                        ? 'bg-red-100 hover:bg-red-200' 
                        : 'bg-transparent hover:bg-gray-200'
                    }`}
                  >
                    <Mic className={`w-3 h-3 ${isRecording ? 'text-red-500' : 'text-gray-500'}`} />
                  </button>
                </div>
                
                {/* Right side send button */}
                <button
                  onClick={handleSubmit}
                  disabled={!inputText.trim() || isProcessing}
                  className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-primary hover:to-brand-primary transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="h-2.5 w-2.5 animate-spin text-white" />
                  ) : (
                    <Send className="h-2.5 w-2.5 text-white" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicAIDoctorChat;