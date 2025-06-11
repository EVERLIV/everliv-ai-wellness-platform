
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

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

Когда мы закончим консультацию, вы сможете получить персональные рекомендации по вашему здоровью!

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
          systemPrompt: `Вы - ИИ-доктор Everliv, который предоставляет ТОЛЬКО общие медицинские консультации и информацию о здоровье. 

ВАЖНЫЕ ОГРАНИЧЕНИЯ:
- Отвечайте ТОЛЬКО на медицинские вопросы о здоровье, симптомах, профилактике
- Давайте ОБЩИЕ рекомендации, избегайте конкретных диагнозов
- Всегда рекомендуйте консультацию с врачом для точного диагноза
- Если вопрос НЕ медицинский - вежливо перенаправьте на медицинские темы
- Отвечайте на русском языке
- Будьте краткими и понятными
- Подчеркивайте, что это бесплатная базовая консультация

Пациент: ${age} лет, пол: ${gender}.

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

      // Проверяем, достиг ли пользователь лимита
      if (messageCount + 1 >= maxMessages) {
        setTimeout(() => {
          const limitMessage: Message = {
            id: 'limit-reached',
            role: 'assistant',
            content: user 
              ? 'Вы достигли лимита бесплатных вопросов. Для получения неограниченных консультаций и персонального ИИ-доктора оформите подписку!'
              : 'Вы достигли лимита бесплатных вопросов. Зарегистрируйтесь для продолжения общения и получения персональных рекомендаций!',
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

  if (showAgeGenderForm) {
    return (
      <div className="w-full max-w-sm mx-auto text-center py-8 px-4">
        {/* Logo and title */}
        <div className="mb-6">
          <div className="w-8 h-8 mx-auto mb-4 bg-primary rounded-full shadow-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Ваш ИИ-доктор
          </h1>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            готов принять вас.
          </h2>
          <p className="text-sm text-muted-foreground">⭐ Обучен лучшими врачами</p>
        </div>

        {/* Introduction text as chat bubble */}
        <div className="bg-card rounded-xl p-4 mb-6 shadow-soft text-left border">
          <p className="text-foreground mb-3 text-sm">
            Привет! Я Everliv - ваш персональный ИИ-доктор.
          </p>
          <p className="text-foreground mb-3 text-sm">
            Как ИИ-доктор, мой сервис быстрый и бесплатный. Я уже помог людям в более чем 11,196,516 консультациях!
          </p>
          <p className="text-foreground mb-3 text-sm">
            Когда мы закончим консультацию, вы сможете получить персональные рекомендации по вашему здоровью!
          </p>
          <p className="text-foreground text-sm">
            Пожалуйста, сообщите мне ваш возраст и биологический пол для начала.
          </p>
        </div>

        {/* Age and gender form */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Возраст (18+)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setGender('Female')}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-300 ${
                gender === 'Female'
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-background text-foreground border-input hover:bg-accent'
              }`}
            >
              Женский
            </button>
            <button
              type="button"
              onClick={() => setGender('Male')}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-300 ${
                gender === 'Male'
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-background text-foreground border-input hover:bg-accent'
              }`}
            >
              Мужской
            </button>
          </div>
        </div>

        <Button 
          onClick={handleAgeGenderSubmit}
          disabled={!age || !gender}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-sm font-medium h-auto w-full"
        >
          Начать ✈️
        </Button>

        {/* Footer disclaimer */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card rounded-lg px-3 py-2 border shadow-sm">
            <Check className="w-3 h-3 text-primary flex-shrink-0" />
            <span>Соблюдаем Федеральный закон от 21.11.2011 № 323-ФЗ</span>
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground text-center max-w-xs mx-auto">
          Всегда обсуждайте результаты Everliv с врачом. Everliv - это ИИ-доктор, а не лицензированный врач, 
          не занимается медицинской практикой и не предоставляет медицинские консультации или уход за пациентами. 
          Используя Everliv, вы соглашаетесь с нашими{' '}
          <Link to="/terms" className="text-primary hover:underline">Условиями обслуживания</Link>
          {' '}&{' '}
          <Link to="/privacy" className="text-primary hover:underline">Политикой конфиденциальности</Link>.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-20">
      {/* Chat header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full shadow-lg flex items-center justify-center">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Консультация с ИИ-доктором
        </h2>
      </div>

      {/* Chat messages */}
      <div className="bg-card rounded-2xl shadow-soft mb-8 border">
        <div className="p-8 min-h-[500px] max-h-[500px] overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-4 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div className={`rounded-2xl px-6 py-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground border'
                  }`}>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="bg-accent rounded-2xl px-6 py-4 border">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input area or limit reached */}
      {isLimitReached ? (
        <div className="text-center space-y-6">
          <div className="bg-accent border border-primary/20 rounded-2xl p-6">
            <p className="text-foreground font-semibold mb-3 text-lg">Лимит бесплатных вопросов исчерпан!</p>
            <p className="text-muted-foreground">
              {user 
                ? 'Оформите подписку для неограниченного общения с персональным ИИ-доктором'
                : 'Зарегистрируйтесь для неограниченного общения с ИИ-доктором'
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/pricing">
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                  Оформить подписку
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                    Зарегистрироваться бесплатно
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="px-8">Войти в аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Опишите ваши симптомы или задайте вопрос о здоровье..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="resize-none pr-16 text-base border-input rounded-xl bg-background"
              disabled={isProcessing}
            />
            <Button 
              type="submit" 
              disabled={!inputText.trim() || isProcessing}
              className="absolute bottom-3 right-3 h-10 w-10 p-0 bg-primary hover:bg-primary/90 rounded-lg"
              size="sm"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TrialChat;
