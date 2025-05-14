
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../ai-doctor/types";
import { generateAIResponse } from "@/services/ai/openai-client";
import { toast } from "sonner";

export const useAIDoctorChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content:
        "Здравствуйте! Я ваш персональный ИИ-доктор. Как я могу помочь вам сегодня?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);
    
    try {
      // Get AI response
      const response = await generateAIResponse(text);
      
      // Add AI response to chat
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setError(null);
    } catch (err) {
      console.error("Error getting AI response:", err);
      setError("Произошла ошибка при получении ответа. Пожалуйста, попробуйте позже.");
      toast.error("Ошибка соединения с ИИ-доктором");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return {
    messages,
    inputText,
    setInputText,
    sendMessage,
    isProcessing,
    error,
  };
};
