
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid';
import { processPersonalAIDoctorMessage, getUserMedicalContext } from '@/services/ai/ai-doctor-service';
import { getMedicalAnalysesHistory } from '@/services/ai/medical-analysis';

export const usePersonalAIDoctorChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [medicalContext, setMedicalContext] = useState('');
  const [userAnalyses, setUserAnalyses] = useState([]);
  const { user } = useAuth();

  // Инициализация чата с персональным приветствием
  useEffect(() => {
    if (messages.length === 0) {
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
    
    loadUserData();
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
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
  }, [messages, user, userAnalyses, medicalContext]);

  return {
    messages,
    inputText,
    setInputText,
    isProcessing,
    sendMessage,
    medicalContext,
    userAnalyses
  };
};

export default usePersonalAIDoctorChat;
