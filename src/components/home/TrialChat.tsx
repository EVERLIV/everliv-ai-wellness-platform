
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const TrialChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const maxMessages = 5;

  useEffect(() => {
    // Приветственное сообщение
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Привет! Я Everliv - ваш ИИ-доктор. Задайте мне любой вопрос о здоровье. У вас есть ${maxMessages} бесплатных вопросов, после чего можно зарегистрироваться для продолжения консультации.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

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
    setMessageCount(prev => prev + 1);

    try {
      const { data, error } = await supabase.functions.invoke('ai-doctor', {
        body: {
          message: inputText.trim(),
          medicalContext: "",
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          systemPrompt: `You are a trial AI health assistant. Provide basic medical information and wellness guidance. Keep responses helpful but brief. Always recommend consulting healthcare professionals for specific concerns. Respond in Russian.`
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

      // Если достигли лимита, добавляем сообщение о регистрации
      if (messageCount + 1 >= maxMessages) {
        setTimeout(() => {
          const limitMessage: Message = {
            id: 'limit-reached',
            role: 'assistant',
            content: 'Вы достигли лимита бесплатных вопросов. Зарегистрируйтесь для продолжения общения и получения персональных рекомендаций на основе ваших анализов здоровья!',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, limitMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error calling AI Doctor:', error);
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
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Попробуйте ИИ-доктора Everliv</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Задайте любой вопрос о здоровье нашему ИИ-доктору. Получите до {maxMessages} бесплатных консультаций.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Чат с ИИ-доктором Everliv
                <span className="ml-auto text-sm font-normal text-gray-600">
                  {messageCount}/{maxMessages} вопросов
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
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

              {/* Input Area */}
              <div className="border-t p-6">
                {isLimitReached ? (
                  <div className="text-center space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-blue-800 font-medium mb-2">Лимит бесплатных вопросов исчерпан!</p>
                      <p className="text-blue-700 text-sm">
                        Зарегистрируйтесь для неограниченного общения с ИИ-доктором и получения персональных рекомендаций
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to="/signup">
                        <Button className="gap-2">
                          <Sparkles className="h-4 w-4" />
                          Зарегистрироваться бесплатно
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button variant="outline">Войти в аккаунт</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      placeholder="Задайте вопрос о здоровье..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={3}
                      className="resize-none"
                      disabled={isProcessing}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Осталось вопросов: {maxMessages - messageCount}
                      </span>
                      <Button 
                        type="submit" 
                        disabled={!inputText.trim() || isProcessing}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {isProcessing ? 'Отправляем...' : 'Отправить'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrialChat;
