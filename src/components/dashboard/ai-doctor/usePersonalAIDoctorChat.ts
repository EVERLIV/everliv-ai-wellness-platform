
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid';
import { processPersonalAIDoctorMessage, getUserMedicalContext, getSuggestedQuestions } from '@/services/ai/ai-doctor-service';
import { getMedicalAnalysesHistory } from '@/services/ai/medical-analysis';

export const usePersonalAIDoctorChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [medicalContext, setMedicalContext] = useState('');
  const [userAnalyses, setUserAnalyses] = useState([]);
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user can use the feature - теперь используем правильную логику из контекста
  const canUsePersonalAIDoctor = canUseFeature('personal_ai_doctor');
  
  // Message limit logic for basic users - теперь правильно определяем премиум статус
  const messageLimit = 3;
  const [messagesUsed, setMessagesUsed] = useState(0);
  
  useEffect(() => {
    // Только если пользователь НЕ имеет доступа к функции (т.е. базовый план)
    if (!canUsePersonalAIDoctor && user) {
      const today = new Date().toDateString();
      const storageKey = `ai_doctor_messages_${user.id}_${today}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        setMessagesUsed(parseInt(savedMessages, 10));
      }
    }
  }, [user, canUsePersonalAIDoctor]);

  // Если у пользователя премиум - лимита нет, иначе показываем оставшиеся сообщения
  const remainingMessages = canUsePersonalAIDoctor ? null : messageLimit - messagesUsed;

  // Инициализация чата с персональным приветствием
  useEffect(() => {
    if (messages.length === 0 && user) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Здравствуйте! Я персональный ИИ-доктор EVERLIV. Я помню нашу историю общения и имею доступ к вашим медицинским анализам для более точных рекомендаций. Как дела с вашим здоровьем?',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
    
    // Загружаем медицинский контекст и анализы пользователя
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        const context = await getUserMedicalContext(user);
        setMedicalContext(context);
        
        const analyses = await getMedicalAnalysesHistory(user.id);
        setUserAnalyses(analyses);
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
      }
    };
    
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    
    // Check message limit только для пользователей без премиума
    if (!canUsePersonalAIDoctor && messagesUsed >= messageLimit) {
      return;
    }
    
    sendMessage(inputText);
  }, [inputText, isProcessing, canUsePersonalAIDoctor, messagesUsed, messageLimit]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    if (isProcessing) return;
    
    // Check message limit только для пользователей без премиума
    if (!canUsePersonalAIDoctor && messagesUsed >= messageLimit) {
      return;
    }
    
    sendMessage(question);
  }, [isProcessing, canUsePersonalAIDoctor, messagesUsed, messageLimit]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Check message limit только для пользователей без премиума
    if (!canUsePersonalAIDoctor && messagesUsed >= messageLimit) {
      return;
    }
    
    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setInputText('');
    
    // Update message count только для пользователей без премиума
    if (!canUsePersonalAIDoctor && user) {
      const newCount = messagesUsed + 1;
      setMessagesUsed(newCount);
      
      const today = new Date().toDateString();
      const storageKey = `ai_doctor_messages_${user.id}_${today}`;
      localStorage.setItem(storageKey, newCount.toString());
    }
    
    try {
      // Обрабатываем сообщение через персональный ИИ сервис
      const botResponse = await processPersonalAIDoctorMessage(
        content, 
        user, 
        [...messages, userMessage],
        userAnalyses,
        medicalContext
      );
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [messages, user, userAnalyses, medicalContext, canUsePersonalAIDoctor, messagesUsed, messageLimit]);

  return {
    messages,
    inputText,
    setInputText,
    isProcessing,
    sendMessage,
    medicalContext,
    userAnalyses,
    canUseFeature: canUsePersonalAIDoctor,
    remainingMessages,
    handleSubmit,
    handleSuggestedQuestion,
    messagesEndRef
  };
};

export default usePersonalAIDoctorChat;
