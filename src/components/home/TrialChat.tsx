
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User } from "lucide-react";
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
  const [showAgeGenderForm, setShowAgeGenderForm] = useState(true);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const maxMessages = 5;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAgeGenderSubmit = () => {
    if (!age || !gender) return;
    
    setShowAgeGenderForm(false);
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Привет! Я Everliv - ваш ИИ-доктор. Как ИИ-доктор, мой сервис быстрый и бесплатный. Я уже помог людям в более чем 11,196,516 консультациях!

Когда мы закончим, вы можете провести видеовизит с топ-доктором, если хотите. Такие визиты стоят всего 39$.

Расскажите мне о своих симптомах или задайте вопрос о здоровье.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
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
    setMessageCount(prev => prev + 1);

    try {
      const { data, error } = await supabase.functions.invoke('ai-doctor', {
        body: {
          message: inputText.trim(),
          medicalContext: `Возраст: ${age}, Пол: ${gender}`,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          systemPrompt: `You are Everliv, an AI health assistant. Provide medical information and wellness guidance. Keep responses helpful and professional. Always recommend consulting healthcare professionals for specific concerns. Respond in Russian. Patient is ${age} years old, gender: ${gender}.`
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

      if (messageCount + 1 >= maxMessages) {
        setTimeout(() => {
          const limitMessage: Message = {
            id: 'limit-reached',
            role: 'assistant',
            content: 'Вы достигли лимита бесплатных вопросов. Зарегистрируйтесь для продолжения общения и получения персональных рекомендаций!',
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

  if (showAgeGenderForm) {
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        {/* Logo and title */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-4xl font-normal text-gray-900 mb-2">
            Your AI Doctor
          </h1>
          <h2 className="text-4xl font-normal text-gray-900 mb-4">
            will see you now.
          </h2>
          <p className="text-sm text-gray-600">⭐ Trained by top human doctors</p>
        </div>

        {/* Introduction text */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm text-left">
          <p className="text-gray-800 mb-4">
            Привет! Я Everliv - ваш персональный ИИ-доктор.
          </p>
          <p className="text-gray-800 mb-4">
            Как ИИ-доктор, мой сервис быстрый и бесплатный. Я уже помог людям в более чем 11,196,516 консультациях!
          </p>
          <p className="text-gray-800 mb-4">
            Когда мы закончим, вы можете провести видеовизит с топ-доктором, если хотите. Такие визиты стоят всего 39$.
          </p>
          <p className="text-gray-800">
            Пожалуйста, сообщите мне ваш возраст и биологический пол для начала.
          </p>
        </div>

        {/* Age and gender form */}
        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Возраст (18+)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setGender('Female')}
              className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                gender === 'Female'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Женский
            </button>
            <button
              type="button"
              onClick={() => setGender('Male')}
              className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                gender === 'Male'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Мужской
            </button>
          </div>
        </div>

        <Button 
          onClick={handleAgeGenderSubmit}
          disabled={!age || !gender}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
        >
          Начать ✈️
        </Button>

        {/* Footer disclaimer */}
        <div className="mt-12 text-xs text-gray-500 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-white rounded border shadow-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <span>HIPAA compliant & anonymous</span>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center max-w-md mx-auto">
          Всегда обсуждайте результаты Everliv с врачом. Everliv - это ИИ-доктор, а не лицензированный врач, 
          не занимается медицинской практикой и не предоставляет медицинские консультации или уход за пациентами. 
          Используя Everliv, вы соглашаетесь с нашими{' '}
          <Link to="/terms" className="text-blue-600 hover:underline">Условиями обслуживания</Link>
          {' '}&{' '}
          <Link to="/privacy" className="text-blue-600 hover:underline">Политикой конфиденциальности</Link>.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chat header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <h2 className="text-2xl font-normal text-gray-900">
          {messageCount}/{maxMessages} консультаций
        </h2>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-lg shadow-sm mb-6 min-h-96 max-h-96 overflow-y-auto">
        <div className="p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
      </div>

      {/* Input area */}
      {isLimitReached ? (
        <div className="text-center space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium mb-2">Лимит бесплатных вопросов исчерпан!</p>
            <p className="text-blue-700 text-sm">
              Зарегистрируйтесь для неограниченного общения с ИИ-доктором
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
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
          <div className="relative">
            <Textarea
              placeholder="Опишите ваши симптомы или задайте вопрос о здоровье..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              className="resize-none pr-12"
              disabled={isProcessing}
            />
            <Button 
              type="submit" 
              disabled={!inputText.trim() || isProcessing}
              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500">
            Осталось вопросов: {maxMessages - messageCount}
          </div>
        </form>
      )}
    </div>
  );
};

export default TrialChat;
