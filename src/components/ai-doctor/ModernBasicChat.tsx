import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowLeft, MessageSquare, Send, Loader2, BookOpen, User, ChevronRight, Grid3X3, Mic, MicOff, Paperclip, Camera, Image } from "lucide-react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1 
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;
      
      if (data.text) {
        setInputText(prev => prev + (prev ? ' ' : '') + data.text);
      }
    } catch (error) {
      console.error('Ошибка транскрипции:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Здесь можно добавить логику загрузки файла
      console.log('Выбран файл:', file.name);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          // Добавить текст о прикрепленном изображении
          setInputText(prev => prev + (prev ? '\n' : '') + `[Прикреплено изображение: ${file.name}]`);
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Сбросить input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}>
              {message.role === "user" ? (
                // User messages - right side with gradient
                <div className={cn(
                  "max-w-[280px] rounded-lg rounded-br-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm",
                  isMobile ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-sm"
                )}>
                  <div className="leading-normal whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ) : (
                // AI messages - left side with modern styling
                <div className={cn(
                  "max-w-[280px] rounded-lg rounded-bl-sm bg-gray-100 text-gray-800 shadow-sm",
                  isMobile ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-sm"
                )}>
                  <div className="leading-normal whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className={cn(
                "max-w-[280px] rounded-lg rounded-bl-sm bg-gray-100 text-gray-800 shadow-sm",
                isMobile ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-sm"
              )}>
                <div className="flex items-center gap-2 text-purple-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm">
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
          "bg-white/95 backdrop-blur-sm",
          isMobile ? "px-4 py-2" : "px-6 py-3"
        )}>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className={cn(
                  "relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 text-purple-700 border border-purple-200/50 hover:border-purple-300 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 hover:-translate-y-0.5 touch-manipulation font-medium",
                  isMobile ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-xs"
                )}
                style={{
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                  boxShadow: '0 1px 4px rgba(123, 31, 162, 0.06), 0 1px 2px rgba(123, 31, 162, 0.08)'
                }}
              >
                <span className="relative z-10">🩺 {question}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Compact Design */}
      <div className={cn(
        "bg-white safe-area-pb",
        isMobile ? "px-4 py-3" : "px-6 py-4"
      )}>
        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs">
            <span>Доктор печатает</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        <div className="relative">
          {/* Compact Input Container */}
          <div 
            className="relative bg-gray-50 rounded-xl transition-all duration-200 focus-within:bg-gray-100"
          >
            <div className="flex items-center p-1 gap-1">
              {/* Left Action Buttons */}
              <div className="flex gap-0.5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-xl bg-transparent hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200 flex items-center justify-center"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing}
                  className={cn(
                    "w-8 h-8 rounded-xl transition-all duration-200 flex items-center justify-center",
                    isRecording 
                      ? "bg-transparent hover:bg-red-100 text-red-500" 
                      : "bg-transparent hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                  )}
                >
                  {isTranscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                placeholder={isTranscribing ? "Обрабатываю голос..." : "Напишите сообщение..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing || isRecording}
                className={cn(
                  "flex-1 resize-none bg-transparent placeholder:text-gray-400 text-gray-800 overflow-hidden focus:outline-none border-0 transition-all duration-200 touch-manipulation flex items-center",
                  isMobile 
                    ? "min-h-[32px] px-2 py-2 text-sm placeholder:text-xs" 
                    : "min-h-[36px] px-3 py-2 text-sm placeholder:text-xs"
                )}
                style={{ 
                  maxHeight: '80px',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'center'
                }}
                rows={1}
              />

              {/* Send Button */}
              <button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                className={cn(
                  "flex-shrink-0 rounded-xl transition-all duration-200 flex items-center justify-center transform hover:scale-105 active:scale-95 touch-manipulation",
                  !inputText.trim() || isProcessing
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white",
                  isMobile 
                    ? "h-8 w-8" 
                    : "h-9 w-9"
                )}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ModernBasicChat;