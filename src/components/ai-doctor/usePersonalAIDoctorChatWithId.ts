
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/components/dashboard/ai-doctor/types';
import { v4 as uuidv4 } from 'uuid';
import { processPersonalAIDoctorMessage, getUserMedicalContext } from '@/services/ai/ai-doctor-service';
import { getMedicalAnalysesHistory } from '@/services/ai/medical-analysis';

export const usePersonalAIDoctorChatWithId = (chatId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [medicalContext, setMedicalContext] = useState('');
  const [userAnalyses, setUserAnalyses] = useState([]);
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user can use the feature
  const canUsePersonalAIDoctor = canUseFeature('personal_ai_doctor');
  
  // Message limit logic for basic users
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

  // Загружаем чат и сообщения
  useEffect(() => {
    if (chatId && user) {
      loadChatData();
    } else if (!chatId) {
      // Если нет chatId, сразу показываем приветственное сообщение
      initializeEmptyChat();
    }
  }, [chatId, user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeEmptyChat = async () => {
    if (!user) return;
    
    try {
      // Загружаем медицинский контекст
      const context = await getUserMedicalContext(user);
      setMedicalContext(context);
      
      const analyses = await getMedicalAnalysesHistory(user.id);
      setUserAnalyses(analyses);

      // Добавляем приветственное сообщение без сохранения в базу
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Здравствуйте! Я персональный ИИ-доктор EVERLIV. Я помню нашу историю общения и имею доступ к вашим медицинским анализам для более точных рекомендаций. Как дела с вашим здоровьем?',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Ошибка инициализации чата:', error);
    }
  };

  const loadChatData = async () => {
    if (!chatId || !user) return;
    
    setIsLoading(true);
    
    try {
      console.log('Loading chat data for chatId:', chatId);
      
      // Загружаем сообщения чата
      const { data: messagesData, error: messagesError } = await supabase
        .from('ai_doctor_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      
      console.log('Loaded', messagesData?.length || 0, 'messages from database');

      // Преобразуем сообщения в нужный формат
      const chatMessages: Message[] = messagesData.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));

      setMessages(chatMessages);

      // Если нет сообщений, добавляем приветственное
      if (chatMessages.length === 0) {
        const welcomeMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: 'Здравствуйте! Я персональный ИИ-доктор EVERLIV. Я помню нашу историю общения и имею доступ к вашим медицинским анализам для более точных рекомендаций. Как дела с вашим здоровьем?',
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
        
        // Сохраняем приветственное сообщение в базу
        await supabase
          .from('ai_doctor_messages')
          .insert([{
            chat_id: chatId,
            role: 'assistant',
            content: welcomeMessage.content
          }]);
      }

      // Загружаем медицинский контекст и анализы
      const context = await getUserMedicalContext(user);
      setMedicalContext(context);
      
      const analyses = await getMedicalAnalysesHistory(user.id);
      setUserAnalyses(analyses);
      
    } catch (error) {
      console.error('Ошибка загрузки чата:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessage = async (message: Message) => {
    if (!chatId) return;
    
    try {
      console.log('Saving message to database:', message.role, message.content.substring(0, 50) + '...');
      
      const { error } = await supabase
        .from('ai_doctor_messages')
        .insert([{
          chat_id: chatId,
          role: message.role,
          content: message.content
        }]);

      if (error) throw error;

      // Обновляем время последнего изменения чата
      await supabase
        .from('ai_doctor_chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);
        
      console.log('Message saved successfully');
    } catch (error) {
      console.error('Ошибка сохранения сообщения:', error);
      throw error; // Пробрасываем ошибку для обработки
    }
  };

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
    
    // Сохраняем сообщение пользователя в базу только если есть chatId
    if (chatId) {
      await saveMessage(userMessage);
    }
    
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
      
      // Сохраняем ответ ИИ в базу только если есть chatId
      if (chatId) {
        await saveMessage(botResponse);
      }
      
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      if (chatId) {
        await saveMessage(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [messages, user, userAnalyses, medicalContext, canUsePersonalAIDoctor, messagesUsed, messageLimit, chatId]);

  return {
    messages,
    inputText,
    setInputText,
    isProcessing,
    isLoading,
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

export default usePersonalAIDoctorChatWithId;
