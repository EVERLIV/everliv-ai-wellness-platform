
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, ArrowLeft, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIDoctorBasicPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const maxMessages = 3;

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
      content: 'Привет! Я базовый ИИ-доктор EVERLIV. Я могу предоставить общие медицинские рекомендации и информацию о здоровье. У вас есть 3 бесплатных сообщения в день. Расскажите о своих симптомах или задайте вопрос о здоровье.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const isLimitReached = messageCount >= maxMessages;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/ai-doctor")}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к выбору
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Базовый ИИ-Доктор EVERLIV
                  </h1>
                  <p className="text-xs text-gray-600">
                    Общие медицинские консультации • {maxMessages - messageCount} сообщений осталось
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="container mx-auto px-4 py-4 max-w-4xl flex-1 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="pt-4 border-t bg-white">
              {isLimitReached ? (
                <Card>
                  <CardContent className="text-center py-6">
                    <h3 className="text-lg font-semibold mb-2">Дневной лимит исчерпан</h3>
                    <p className="text-gray-600 mb-4">
                      Для неограниченного общения оформите премиум подписку
                    </p>
                    <Button onClick={() => navigate("/pricing")}>
                      Обновить подписку
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Textarea
                    placeholder="Опишите ваши симптомы или задайте вопрос о здоровье..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={2}
                    className="resize-none flex-1"
                    disabled={isProcessing}
                  />
                  <Button 
                    type="submit" 
                    disabled={!inputText.trim() || isProcessing}
                    className="px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AIDoctorBasicPage;
