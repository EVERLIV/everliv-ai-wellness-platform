
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User, ChevronDown, ChevronUp, MoreHorizontal, Camera, Mic, Paperclip, FileText, Image } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  
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

  const handleChatHistoryClick = () => {
    onShowChatHistory?.();
  };

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
        <div className="flex items-center justify-between px-3 py-2 bg-white shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 h-auto"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-accent/10 rounded-lg flex items-center justify-center">
              <Brain className="h-3 w-3 text-brand-accent" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-foreground">Персональный ИИ-Доктор</h2>
              <p className="text-xs text-muted-foreground">Премиум консультации</p>
            </div>
          </div>
          
          <div className="w-6"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-xs">Назад</span>
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area - 75% of screen */}
      <div className="flex-1 overflow-y-auto px-2 py-1 bg-gray-50/50" style={{ scrollBehavior: 'smooth', minHeight: '75vh' }}>
        <div className="space-y-2 max-w-3xl mx-auto">
          {/* Quick Actions только если нет сообщений */}
          {allMessages.length === 0 && (
            <div className="text-center py-4">
              <h3 className="text-lg font-bold text-foreground mb-1">Персональная консультация</h3>
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
                        <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
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

          {allMessages.map((message) => (
            <div key={message.id} className="flex items-start gap-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-white border border-border" 
                  : "bg-brand-accent text-white"
              }`}>
                {message.role === "user" ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Brain className="h-3 w-3" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-foreground">
                    {message.role === "user" ? "Вы" : "Персональный ИИ Доктор"}
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
                    : "bg-brand-accent/10 border border-brand-accent/20"
                }`}>
                  {message.role === "assistant" && message.content.includes('<div') ? (
                    <div 
                      className="text-xs text-foreground leading-relaxed"
                      style={{ wordBreak: 'break-word' }}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  ) : (
                    <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-brand-accent text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="h-3 w-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-foreground">Персональный ИИ Доктор</span>
                </div>
                <div className="p-2 rounded-lg bg-brand-accent/10 border border-brand-accent/20">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                    <span className="text-xs">Анализирую данные...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Compact Input Panel - 25% of screen */}
      <div className="bg-white border-t border-border py-2" style={{ maxHeight: '25vh' }}>
        <div className="max-w-3xl mx-auto px-2">
          <div className="relative">
            <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg border border-gray-200 px-3 py-2">
              <textarea
                ref={textareaRef}
                placeholder="Что вас беспокоит? Как я могу помочь?"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className="flex-1 min-h-[16px] max-h-16 resize-none outline-none text-xs placeholder:text-muted-foreground bg-transparent"
                style={{ 
                  lineHeight: '1.2'
                }}
                rows={1}
              />
              
              <Button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                size="sm"
                className="h-6 w-6 p-0 rounded-full bg-gradient-to-r from-brand-accent to-brand-accent/80 hover:from-brand-accent hover:to-brand-accent shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isProcessing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-1">
              Персональный ИИ-доктор анализирует ваши данные для точных рекомендаций.
            </p>
          </div>
        </div>
      </div>

      {/* Compact Bottom Navigation */}
      <div className="flex items-center justify-center py-1 px-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
        <div className="flex items-center justify-between w-full max-w-sm">
          {/* Чаты */}
          <button 
            onClick={handleChatHistoryClick}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600 font-medium">Чаты</span>
          </button>
          
          {/* Камера */}
          <button 
            onClick={handleCameraClick}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600 font-medium">Камера</span>
          </button>
          
          {/* Новый чат - центральная кнопка */}
          <button 
            onClick={onCreateNewChat}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-green-600 font-bold">Новый</span>
          </button>
          
          {/* Файлы */}
          <button 
            onClick={handleFileClick}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600 font-medium">Файлы</span>
          </button>
          
          {/* Микрофон */}
          <button 
            onClick={handleMicClick}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105 ${
              isRecording 
                ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            }`}>
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xs font-medium ${isRecording ? 'text-red-600' : 'text-gray-600'}`}>
              {isRecording ? 'Запись' : 'Голос'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalAIDoctorChatWithId;
