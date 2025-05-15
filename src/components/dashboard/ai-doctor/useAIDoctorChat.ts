
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid';
import { processAIDoctorMessage, getUserMedicalContext } from '@/services/ai/ai-doctor-service';

export const useAIDoctorChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [medicalContext, setMedicalContext] = useState('');
  const { user } = useAuth();

  // Initialize chat with a welcome message
  useEffect(() => {
    // Only initialize once when the component mounts
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Здравствуйте! Я ИИ-доктор, готовый помочь вам с вопросами о здоровье. Чем я могу вам помочь сегодня?',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
    
    // Load medical context for personalized responses
    const loadMedicalContext = async () => {
      const context = await getUserMedicalContext(user);
      setMedicalContext(context);
    };
    
    loadMedicalContext();
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to chat
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
      // Process message through AI service
      const botResponse = await processAIDoctorMessage(content, user, [...messages, userMessage]);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
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
  }, [messages, user]);

  return {
    messages,
    inputText,
    setInputText,
    isProcessing,
    sendMessage,
    medicalContext
  };
};

export default useAIDoctorChat;
