
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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <h1 className="font-semibold text-gray-900 text-lg">Узнаем вас лучше</h1>
        </div>
        
        <button className="w-8 h-8 flex items-center justify-center">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4 max-w-full">
          {/* Avatar and intro */}
          {allMessages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Привет, меня зовут ИИ Доктор</h3>
              <p className="text-gray-600 text-sm mb-8 px-4">Я ваш виртуальный персональный доктор для всех ваших медицинских вопросов. Сначала - дайте мне узнать вас лучше!</p>
              
              <div className="space-y-3">
                <p className="text-gray-800 font-medium">Готовы начать консультацию?</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => handleSuggestedQuestion("Проанализируй мои последние анализы")}
                    className="bg-green-500 text-white px-8 py-2 rounded-full text-sm font-medium"
                  >
                    ДА
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm">
                    НЕ СЕЙЧАС
                  </button>
                </div>
              </div>
            </div>
          )}

          {allMessages.map((message, index) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-r from-green-400 to-emerald-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Brain className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl max-w-full ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  {message.role === "assistant" && message.content.includes('<div') ? (
                    <div 
                      className="text-sm leading-relaxed"
                      style={{ wordBreak: 'break-word' }}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  ) : (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  )}
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">ИИ Доктор думает и печатает...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100">
        {/* Text Input */}
        <div className="px-4 py-2">
          <div className="flex items-end gap-2 bg-gray-50 rounded-3xl px-3 py-2">
            <textarea
              ref={textareaRef}
              placeholder="Нажмите здесь, чтобы поговорить с ИИ Доктором"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="flex-1 min-h-[16px] max-h-20 resize-none outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm"
              style={{ lineHeight: '1.2' }}
              rows={1}
            />
            
            <button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isProcessing}
              className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 flex-shrink-0"
            >
              {isProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <div className="flex items-center justify-center py-3 px-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
          <div className="flex items-center justify-between w-full max-w-sm">
            {/* Чаты */}
            <button 
              onClick={handleChatHistoryClick}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-medium">Чаты</span>
            </button>
            
            {/* Камера */}
            <button 
              onClick={handleCameraClick}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-medium">Камера</span>
            </button>
            
            {/* Новый чат - центральная кнопка */}
            <button 
              onClick={onCreateNewChat}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-200 group-hover:scale-110">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-green-600 font-bold">Новый</span>
            </button>
            
            {/* Файлы */}
            <button 
              onClick={handleFileClick}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-medium">Файлы</span>
            </button>
            
            {/* Микрофон */}
            <button 
              onClick={handleMicClick}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105 ${
                isRecording 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}>
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs font-medium ${isRecording ? 'text-red-600' : 'text-gray-600'}`}>
                {isRecording ? 'Запись' : 'Голос'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAIDoctorChatWithId;
