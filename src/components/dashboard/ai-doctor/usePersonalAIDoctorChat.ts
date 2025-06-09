
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
  const { subscription } = useSubscription();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user can use the feature
  const canUseFeature = user !== null;
  const isBasicUser = !subscription || subscription.plan_type === 'basic';
  
  // Message limit logic for basic users
  const messageLimit = 3;
  const [messagesUsed, setMessagesUsed] = useState(0);
  
  useEffect(() => {
    if (isBasicUser && user) {
      const today = new Date().toDateString();
      const storageKey = `ai_doctor_messages_${user.id}_${today}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        setMessagesUsed(parseInt(savedMessages, 10));
      }
    }
  }, [user, isBasicUser]);

  const remainingMessages = isBasicUser ? messageLimit - messagesUsed : null;

  // Инициализация чата с персональным приветствием
  useEffect(() => {
    if (messages.length === 0 && canUseFeature) {
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
    
    if (canUseFeature) {
      loadUserData();
    }
  }, [user, canUseFeature]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    
    // Check message limit for basic users
    if (isBasicUser && messagesUsed >= messageLimit) {
      return;
    }
    
    sendMessage(inputText);
  }, [inputText, isProcessing, isBasicUser, messagesUsed, messageLimit]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    if (isProcessing) return;
    
    // Check message limit for basic users
    if (isBasicUser && messagesUsed >= messageLimit) {
      return;
    }
    
    sendMessage(question);
  }, [isProcessing, isBasicUser, messagesUsed, messageLimit]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Check message limit for basic users
    if (isBasicUser && messagesUsed >= messageLimit) {
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
    
    // Update message count for basic users
    if (isBasicUser && user) {
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
  }, [messages, user, userAnalyses, medicalContext, isBasicUser, messagesUsed, messageLimit]);

  return {
    messages,
    inputText,
    setInputText,
    isProcessing,
    sendMessage,
    medicalContext,
    userAnalyses,
    canUseFeature,
    remainingMessages,
    handleSubmit,
    handleSuggestedQuestion,
    messagesEndRef
  };
};

export default usePersonalAIDoctorChat;
